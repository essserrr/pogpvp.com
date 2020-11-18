package main

import (
	"Solutions/pvpSimulator/core/errors"
	"Solutions/pvpSimulator/core/limiter"
	appl "Solutions/pvpSimulator/core/sim/app"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"

	getbase "Solutions/pvpSimulator/bases"
	"Solutions/pvpSimulator/core/geoip"

	"bytes"
	"encoding/binary"
	"io"
	"io/ioutil"
	"net"
	"os"
	"path"
	"strings"
	"time"

	"github.com/go-chi/chi/middleware"
	"github.com/mssola/user_agent"

	"github.com/boltdb/bolt"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	log "github.com/sirupsen/logrus"
)

type App struct {
	semistaticDatabase database
	pvpDatabase        database
	pveDatabase        database
	newsDatabse        database
	users              database
	mongo              mongoDatabse

	metrics pageMetrics

	metricsSrv *http.Server
	pvpSrv     *http.Server

	semistaticBuckets []string

	iconVer     string
	corsEnabled bool
}

type pageMetrics struct {
	appGaugeCount  *prometheus.GaugeVec
	userGaugeCount *prometheus.GaugeVec
	dbGaugeCount   *prometheus.GaugeVec
	apiGaugeCount  *prometheus.GaugeVec

	userCount *prometheus.CounterVec
	locations *prometheus.CounterVec
	latency   *prometheus.SummaryVec
}

type database struct {
	value *bolt.DB
}

func initializeLog() (*os.File, error) {
	logFile, err := os.OpenFile(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"/logs/logs.log"), os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666) //0666
	if err != nil {
		return &os.File{}, fmt.Errorf("Error during log initialization: %v", err)
	}
	writer := io.MultiWriter(os.Stdout, logFile)
	log.SetOutput(writer)
	return logFile, nil
}

func createApp(withLog *os.File) (*App, error) {
	var (
		app App
		err error
	)

	if os.Getenv("APP_CORS") == "true" {
		app.corsEnabled = true
	}
	app.iconVer = "2"

	app.semistaticBuckets = []string{"POKEMONS", "MOVES", "LEVELS", "MULTIPLIERS", "SHINY", "RAIDS", "EGGS", "RATING", "MISC"}
	//create/open bases
	if err = app.semistaticDatabase.createDatabase("./semistatic.db", "BOLTDB", app.semistaticBuckets); err != nil {
		return nil, err
	}
	if err = app.newsDatabse.createDatabase("./news.db", "BOLTDB", []string{"NEWS_HEADERS", "NEWS", "RU_NEWS_HEADERS", "RU_NEWS"}); err != nil {
		return nil, err
	}
	if err = app.users.createDatabase("./users.db", "BOLTDB", []string{"SUPERADMINS"}); err != nil {
		return nil, err
	}
	if err = app.pvpDatabase.createDatabase("./pvp.db", "BOLTDB", []string{"PVPRESULTS"}); err != nil {
		return nil, err
	}
	if err = app.pveDatabase.createDatabase("./pve.db", "BOLTDB", []string{"PVERESULTS"}); err != nil {
		return nil, err
	}
	//init mongo
	if err = app.mongo.newMongo(); err != nil {
		return nil, err
	}

	//init server
	app.initServer()
	//start clean up task
	go app.pvpDatabase.cleanupBucket(24, "PVPRESULTS", &app)
	//start update db task
	go app.semistaticDatabase.startUpdaterService(5, "SHINY", "value", &app, getbase.GetShinyBase)
	go app.semistaticDatabase.startUpdaterService(12, "RAIDS", "value", &app, getbase.GetRaidsList)
	go app.semistaticDatabase.startUpdaterService(12, "EGGS", "value", &app, getbase.GetEggsList)
	return &app, nil
}

func (a *App) initServer() {
	a.metricsSrv = a.initMetrics()
	a.pvpSrv = a.initPvpSrv()
}

func (dbs *database) createDatabase(pathToDB, envPath string, bucketName []string) error {
	var err error
	if dbs.value, err = bolt.Open(path.Join(os.Getenv(envPath)+pathToDB), 0600, nil); err != nil {
		return err
	}
	return dbs.value.Update(func(tx *bolt.Tx) error {
		for _, value := range bucketName {
			_, err := tx.CreateBucketIfNotExists([]byte(value))
			if err != nil {
				return fmt.Errorf("Can not create bucket %v: %v", value, err)
			}
		}
		return nil
	})
}

func (dbs *database) addStaticBase(path, bucketName string) error {
	//rewrite bucket value on restart
	base, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}
	return dbs.value.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		err = b.Put([]byte("value"), base)
		if err != nil {
			return fmt.Errorf("Can not insert to the bucket %v: %v", bucketName, err)
		}
		return nil
	})
}

//Clean up pvp bucket
func (dbs *database) cleanupBucket(timer uint, bucketName string, app *App) {
	for {
		time.Sleep(time.Duration(timer) * time.Hour)
		app.metrics.appGaugeCount.With(
			prometheus.Labels{"type": fmt.Sprintf("cleanup_%v", strings.ToLower(bucketName))}).Inc()

		err := dbs.value.Update(func(tx *bolt.Tx) error {
			var obj appl.PvpResults
			b := tx.Bucket([]byte(bucketName))

			b.ForEach(func(k, v []byte) error {
				if err := json.Unmarshal(v, &obj); err != nil {
					return fmt.Errorf("Error while cleaning bucket %v: %v", bucketName, err)
				}
				if time.Now().Sub(obj.CreatedAt) > time.Duration(timer)*time.Hour {
					b.Delete(k)
				}
				return nil
			})
			return nil
		})
		if err != nil {
			app.metrics.appGaugeCount.With(prometheus.Labels{"type": fmt.Sprintf("cleanup_%v_error", strings.ToLower(bucketName))}).Inc()
			log.WithFields(log.Fields{"location": "cleanupBucket: " + bucketName}).Error(err)
			continue
		}
	}
}

func (dbs *database) startUpdaterService(timer uint, bucketName, key string, app *App, funcCall func() ([]byte, error)) {
	//start updater service
	for {
		time.Sleep(time.Duration(timer) * time.Hour)
		app.metrics.dbGaugeCount.With(prometheus.Labels{"type": "update_db"}).Inc()
		if err := dbs.updateBase(bucketName, key, funcCall); err != nil {
			app.metrics.dbGaugeCount.With(prometheus.Labels{"type": "update_db_error"}).Inc()
			log.WithFields(log.Fields{"location": "updater: " + bucketName}).Error(err)
			continue
		}
	}
}

func (dbs *database) updateBase(bucketName, key string, funcCall func() ([]byte, error)) error {
	table, err := funcCall()
	if err != nil {
		return err
	}
	newVer := dbs.returnNewVersion(bucketName)

	err = dbs.value.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if err = b.Put([]byte(key), table); err != nil {
			return fmt.Errorf("Can not insert key: %v to the bucket %v: %v", key, bucketName, err)
		}
		if err = b.Put([]byte("version"), uintToByte(newVer)); err != nil {
			return fmt.Errorf("Can not insert key: version to the bucket %v: %v", bucketName, err)
		}
		return nil
	})
	if err != nil {
		return err
	}
	log.WithFields(log.Fields{"location": "updater"}).Printf("Base: %v updated, ver: %v", bucketName, newVer)
	return nil
}

func (dbs *database) updateBaseVersion(bucketName string) error {
	newVer := dbs.returnNewVersion(bucketName)
	err := dbs.value.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if err := b.Put([]byte("version"), uintToByte(newVer)); err != nil {
			return fmt.Errorf("Can not insert key: version to the bucket %v: %v", bucketName, err)
		}
		return nil
	})
	if err != nil {
		return err
	}
	log.WithFields(log.Fields{"location": "updater"}).Printf("Base: %v updated, ver: %v", bucketName, newVer)
	return nil
}

func (dbs *database) returnNewVersion(bucketName string) uint64 {
	var (
		verInBytes []byte
		newVer     uint64
	)
	dbs.value.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		verInBytes = b.Get([]byte("version"))
		return nil
	})
	switch verInBytes {
	case nil:
		newVer = 1
	default:
		newVer = byteToUint(verInBytes) + 1
	}
	return newVer
}

func byteToUint(byteArray []byte) uint64 {
	var v uint64
	buf := bytes.NewBuffer(byteArray)
	binary.Read(buf, binary.BigEndian, &v)
	return v
}

func setupCors(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Pvp-Type, Pvp-Shields")
}

//45678
//rootHandler implements http.Handler interface
type rootHandler struct {
	function func(*http.ResponseWriter, *http.Request, *App) error
	app      *App
}

func (rh rootHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	//close request body
	defer r.Body.Close()
	//set up CORS
	if rh.app.corsEnabled {
		setupCors(&w, r)
	}

	rh.app.registerUserAgent(r.Header.Get("User-Agent"), getIP(r))

	//handle options method
	if (*r).Method == "OPTIONS" && rh.app.corsEnabled {
		w.WriteHeader(200)
		return
	}
	// Call handler function
	err := rh.function(&w, r, rh.app)
	if err == nil {
		return
	}
	//If there is an error, log it
	//Check if it is a ClientError
	clientError, ok := err.(errors.ClientError)
	if !ok {
		log.WithFields(log.Fields{"location": r.RequestURI}).Error(err)
		//If the error is not ClientError, consider that it is an ServerError
		w.WriteHeader(http.StatusInternalServerError) // return 500 Internal Server Error
		return
	}
	//Try to get response body of ClientError
	body, err := clientError.ResponseBody()
	if err != nil {
		log.WithFields(log.Fields{"location": r.RequestURI}).Errorf("An error accured during parsing error body: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.WithFields(log.Fields{"location": r.RequestURI}).Errorf(string(body))

	//Get http status code and headers
	status, headers := clientError.ResponseHeaders()
	for k, v := range headers {
		w.Header().Set(k, v)
	}
	w.WriteHeader(status)
	_, err = w.Write(body)
	if err != nil {
		log.WithFields(log.Fields{"location": r.RequestURI}).Errorf("An error accured during writing error body: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func checkLimits(remoteAddr, limiterType string) error {
	//Check visitor's requests limit
	if limiter.CheckVisitorLimit(remoteAddr, limiterType) == false {
		return errors.NewHTTPError(nil, http.StatusTooManyRequests, "Too many Requests")
	}
	return nil
}

//registers new user and returns true if it is a bot
func (a *App) registerUserAgent(agent, ip string) bool {
	ua := user_agent.New(agent)
	switch ua.Bot() {
	case true:
		go a.metrics.userGaugeCount.With(prometheus.Labels{"type": "bots"}).Inc()
	default:
		if !limiter.CheckExistence(ip) {
			go a.recordGeo(ip)
			go a.metrics.userGaugeCount.With(prometheus.Labels{"type": "visitors"}).Inc()
		}
	}
	return ua.Bot()
}

func (a *App) recordGeo(ip string) {
	code, err := geoip.GetCode(ip)
	if err != nil {
		log.WithFields(log.Fields{"location": "geoIP"}).Errorf("An error accured while getting user country code: %v", err)
		return
	}
	a.metrics.locations.With(prometheus.Labels{"country": code}).Inc()
	return
}

func serveIndex(w *http.ResponseWriter, r *http.Request, app *App) error {
	agent := r.Header.Get("User-Agent")
	ip := getIP(r)
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New visitor, User-agent: " + agent)
	//SEO actions
	//if it is a user
	if !app.registerUserAgent(agent, ip) {
		//Check visitor's requests limit
		if err := checkLimits(ip, "limiterPage"); err != nil {
			return err
		}
		http.ServeFile(*w, r, "./interface/build/200.html")
		return nil
	}
	//if it is a bot
	s := strings.Split(r.RequestURI, "/")
	switch s[1] {
	case "":
		http.ServeFile(*w, r, "./interface/build/index.html")
	case "news":
		if len(s) < 3 {
			http.ServeFile(*w, r, "./interface/build/index.html")
			return nil
		}
		switch s[2] {
		case "id":
			http.ServeFile(*w, r, "./interface/build/news/id/index.html")
		default:
			http.ServeFile(*w, r, "./interface/build/index.html")
		}
	case "pvp":
		if len(s) < 3 {
			http.ServeFile(*w, r, "./interface/build/404.html")
			return nil
		}
		switch s[2] {
		case "matrix":
			http.ServeFile(*w, r, "./interface/build/pvp/matrix/index.html")
		default:
			http.ServeFile(*w, r, "./interface/build/pvp/single/index.html")
		}
	case "pve":
		if len(s) < 3 {
			http.ServeFile(*w, r, "./interface/build/404.html")
			return nil
		}
		switch s[2] {
		case "custom":
			http.ServeFile(*w, r, "./interface/build/pve/custom/index.html")
		default:
			http.ServeFile(*w, r, "./interface/build/pve/common/index.html")
		}
	case "pvprating":
		http.ServeFile(*w, r, "./interface/build/pvprating/index.html")
	case "shinyrates":
		http.ServeFile(*w, r, "./interface/build/shinyrates/index.html")
	case "evolution":
		http.ServeFile(*w, r, "./interface/build/evolution/index.html")
	case "pokedex":
		http.ServeFile(*w, r, "./interface/build/pokedex/index.html")
	case "movedex":
		http.ServeFile(*w, r, "./interface/build/movedex/index.html")
	case "raids":
		http.ServeFile(*w, r, "./interface/build/raids/index.html")
	case "eggs":
		http.ServeFile(*w, r, "./interface/build/eggs/index.html")
	case "shinybroker":
		http.ServeFile(*w, r, "./interface/build/shinybroker/index.html")
	case "privacy":
		http.ServeFile(*w, r, "./interface/build/privacy/index.html")
	case "terms":
		http.ServeFile(*w, r, "./interface/build/terms/index.html")
	case "login":
		http.ServeFile(*w, r, "./interface/build/login/index.html")
	case "registration":
		http.ServeFile(*w, r, "./interface/build/registration/index.html")
	case "restore":
		http.ServeFile(*w, r, "./interface/build/restore/index.html")
	default:
		http.ServeFile(*w, r, "./interface/build/200.html")
	}
	return nil
}

func (dbs *database) Close() error {
	dbs.value.Sync()
	err := dbs.value.Close()
	if err != nil {
		return err
	}
	return nil
}

func (a *App) listen() {
	go a.metricsSrv.ListenAndServe()
	log.WithFields(log.Fields{"location": "global"}).Printf("Metrics are up: %v", os.Getenv("METRICS_LISTEN_ADDR"))

	log.WithFields(log.Fields{"location": "global"}).Printf("Local port: %v", os.Getenv("APP_LISTEN_ADDR"))
	log.WithFields(log.Fields{"location": "global"}).Printf("Root location: %v", os.Getenv("PVP_SIMULATOR_ROOT"))
	log.WithFields(log.Fields{"location": "global"}).Printf("BoltDB location: %v", os.Getenv("BOLTDB"))
	log.WithFields(log.Fields{"location": "global"}).Printf("PvP node limit: %v", os.Getenv("NODE_LIMIT"))
	log.WithFields(log.Fields{"location": "global"}).Printf("CORS are: %v", os.Getenv("APP_CORS"))
	log.WithFields(log.Fields{"location": "global"}).Printf("Mongo path: %v", os.Getenv("MONGO_URI"))
	log.WithFields(log.Fields{"location": "global"}).Println("Server is listening...")

	log.WithFields(log.Fields{"location": "global"}).Println(a.pvpSrv.ListenAndServe())
}

func (a *App) initMetrics() *http.Server {
	a.metrics.appGaugeCount = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{Name: "app_calls", Help: "Number of app calls by type"},
		[]string{"type"})
	a.metrics.userGaugeCount = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{Name: "user_calls", Help: "Number of user calls by type"},
		[]string{"type"})
	a.metrics.dbGaugeCount = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "db_calls", Help: "Number of base calls by type"},
		[]string{"type"})
	a.metrics.apiGaugeCount = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{Name: "api_calls", Help: "Number of api calls by type"},
		[]string{"type"})
	a.metrics.userCount = prometheus.NewCounterVec(
		prometheus.CounterOpts{Name: "total", Help: "Total counters"},
		[]string{"type"})
	a.metrics.locations = prometheus.NewCounterVec(
		prometheus.CounterOpts{Name: "locations", Help: "Number of connections by country"},
		[]string{"country"})
	a.metrics.latency = prometheus.NewSummaryVec(
		prometheus.SummaryOpts{Name: "request_duration_ms", Objectives: map[float64]float64{0.5: 0.05, 0.9: 0.01, 0.99: 0.001}},
		[]string{"code"})

	prometheus.MustRegister(a.metrics.appGaugeCount)
	prometheus.MustRegister(a.metrics.userGaugeCount)
	prometheus.MustRegister(a.metrics.dbGaugeCount)
	prometheus.MustRegister(a.metrics.apiGaugeCount)
	prometheus.MustRegister(a.metrics.locations)
	prometheus.MustRegister(a.metrics.latency)
	prometheus.MustRegister(a.metrics.userCount)

	metrics := chi.NewRouter()
	metrics.Handle("/metrics", promhttp.Handler())
	metricsSrv := &http.Server{
		Handler:      metrics,
		Addr:         os.Getenv("METRICS_LISTEN_ADDR"),
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	return metricsSrv
}

func getIP(r *http.Request) string {
	clientIP := ""
	//If real ip is set use it
	if xri := r.Header.Get("X-Real-Ip"); len(xri) > 0 {
		if ip := net.ParseIP(xri); ip != nil {
			clientIP = ip.String()
			return clientIP
		}
	}
	//otherwise try to get from forwarded
	if xff := r.Header.Get("X-Forwarded-For"); len(xff) > 0 {
		ipSet := strings.Split(xff, ",")
		lastIP := ipSet[len(ipSet)-1]
		if ip := net.ParseIP(lastIP); ip != nil {
			clientIP = ip.String()
			return clientIP
		}
	}
	//if everything failed get it from remote adress
	clientIP, _, _ = net.SplitHostPort(r.RemoteAddr)

	return clientIP
}

func versioning(h http.Handler, app *App) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.RequestURI, "/") {
			http.ServeFile(w, r, "./interface/build/200.html")
			return
		}
		//set up CORS
		if app.corsEnabled {
			setupCors(&w, r)
		}
		//handle options method

		if (*r).Header.Get("If-None-Match") == app.iconVer {
			(w).WriteHeader(http.StatusNotModified)
			return
		}
		(w).Header().Set("Etag", app.iconVer)
		h.ServeHTTP(w, r) // call original
	})
}

func listingblock(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.RequestURI, "/") {
			http.ServeFile(w, r, "./interface/build/200.html")
			return
		}
		h.ServeHTTP(w, r) // call original
	})
}

func (a *App) initPvpSrv() *http.Server {
	router := chi.NewRouter()

	router.Use(middleware.Compress(5))

	//statics
	router.Handle("/static/*", http.StripPrefix("/static/", listingblock(http.FileServer(http.Dir("./interface/build/static")))))
	router.Handle("/images/*", http.StripPrefix("/images/", versioning(http.FileServer(http.Dir("./interface/build/images")), a)))
	router.Handle("/sitemap/*", http.StripPrefix("/sitemap/", listingblock(http.FileServer(http.Dir("./interface/build/sitemap")))))

	//pages
	router.Handle("/", rootHandler{serveIndex, a})
	router.Handle("/pvp*", rootHandler{serveIndex, a})
	router.Handle("/news*", rootHandler{serveIndex, a})
	router.Handle("/shinyrates*", rootHandler{serveIndex, a})
	router.Handle("/evolution*", rootHandler{serveIndex, a})
	router.Handle("/raids*", rootHandler{serveIndex, a})
	router.Handle("/eggs*", rootHandler{serveIndex, a})
	router.Handle("/pvprating*", rootHandler{serveIndex, a})
	router.Handle("/pve*", rootHandler{serveIndex, a})
	router.Handle("/movedex*", rootHandler{serveIndex, a})
	router.Handle("/pokedex*", rootHandler{serveIndex, a})
	router.Handle("/registration*", rootHandler{serveIndex, a})
	router.Handle("/login*", rootHandler{serveIndex, a})
	router.Handle("/profile*", rootHandler{serveIndex, a})
	router.Handle("/privacy*", rootHandler{serveIndex, a})
	router.Handle("/terms*", rootHandler{serveIndex, a})
	router.Handle("/restore*", rootHandler{serveIndex, a})
	router.Handle("/shinybroker*", rootHandler{serveIndex, a})

	//dynamic content requsts
	router.Handle("/request/single/{league}/{pok1}/{pok2}", rootHandler{pvpHandler, a})
	router.Handle("/request/constructor", rootHandler{constructorPvpHandler, a})
	router.Handle("/request/matrix", rootHandler{matrixHandler, a})
	router.Handle("/request/common/{attacker}/{boss}/{obj}", rootHandler{pveHandler, a})
	router.Handle("/request/common/{attacker}/{boss}/{obj}/{booster}", rootHandler{pveHandler, a})
	router.Handle("/request/custom/", rootHandler{customPveHandler, a})

	//db calls
	router.Handle("/db/{type}", rootHandler{dbCallHandler, a})
	router.Handle("/db/{type}/{value}", rootHandler{dbCallHandler, a})
	router.Handle("/newsdb/{type}/{id}", rootHandler{newsHandler, a})
	//admin services
	router.Handle("/api/news/{action}", rootHandler{newsAPIHandler, a})
	router.Handle("/api/log/{action}", rootHandler{logAPIHandler, a})
	router.Handle("/api/dbupdate/{action}", rootHandler{dbUpdateAPIHandler, a})
	//auth
	router.Handle("/api/auth/reg", rootHandler{register, a})
	router.Handle("/api/auth/login", rootHandler{login, a})
	router.Handle("/api/auth/refresh", rootHandler{refresh, a})
	router.Handle("/api/auth/logout", rootHandler{logout, a})
	router.Handle("/api/auth/logout/all", rootHandler{logoutAll, a})
	router.Handle("/api/auth/chpass", rootHandler{changePassword, a})
	router.Handle("/api/auth/restore", rootHandler{reset, a})
	router.Handle("/api/auth/confirm/{id}", rootHandler{restoreConfirm, a})

	//user requests
	router.Handle("/api/user/info", rootHandler{getUserInfo, a})
	router.Handle("/api/user/sessions", rootHandler{getUserUsessions, a})
	router.Handle("/api/user/setmoves", rootHandler{setUserMoves, a})
	router.Handle("/api/user/getmoves", rootHandler{getUserMoves, a})
	router.Handle("/api/user/setbroker", rootHandler{setUserBroker, a})
	router.Handle("/api/user/getbroker", rootHandler{getUserBroker, a})
	router.Handle("/api/user/filterbrokers", rootHandler{getFilteredBrokers, a})
	router.Handle("/api/user/setpokemon", rootHandler{setUserCollection, a})
	router.Handle("/api/user/getpokemon", rootHandler{getUserCollection, a})

	router.NotFound(func(w http.ResponseWriter, r *http.Request) {
		rootHandler.ServeHTTP(rootHandler{serveIndex, a}, w, r)
	})

	srv := &http.Server{
		Handler:      router,
		Addr:         os.Getenv("APP_LISTEN_ADDR"),
		WriteTimeout: 120 * time.Second,
		ReadTimeout:  120 * time.Second,
	}
	return srv
}

func main() {
	logFile, err := initializeLog()
	if err != nil {
		fmt.Println(err)
		return
	}
	defer logFile.Close()

	app, err := createApp(logFile)
	if err != nil {
		log.WithFields(log.Fields{"location": "createApp"}).Errorf("An error accured during creating app: %v", err)
		return
	}
	defer log.WithFields(log.Fields{"location": "datbase"}).Error(app.mongo.client.Disconnect)
	defer log.WithFields(log.Fields{"location": "datbase"}).Error(app.semistaticDatabase.Close)
	defer log.WithFields(log.Fields{"location": "datbase"}).Error(app.pvpDatabase.Close)
	defer log.WithFields(log.Fields{"location": "datbase"}).Error(app.newsDatabse.Close)
	defer log.WithFields(log.Fields{"location": "datbase"}).Error(app.users.Close)
	app.listen()
}
