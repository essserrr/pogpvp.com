package main

import (
	getbase "Solutions/pvpSimulator/bases"
	"Solutions/pvpSimulator/core/limiter"
	sim "Solutions/pvpSimulator/core/sim"
	appl "Solutions/pvpSimulator/core/sim/app"
	"bytes"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	log "github.com/sirupsen/logrus"

	"Solutions/pvpSimulator/core/errors"
	"Solutions/pvpSimulator/core/parser"

	"github.com/boltdb/bolt"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type App struct {
	semistaticDatabase database
	pvpDatabase        database
	pveDatabase        database
	newsDatabse        database
	users              database

	metrics pageMetrics

	metricsSrv *http.Server
	pvpSrv     *http.Server

	semistaticBuckets []string
	botsList          []string

	corsEnabled bool
}

type pageMetrics struct {
	appCounters *prometheus.GaugeVec
	dbCounters  *prometheus.GaugeVec
	apiCounters *prometheus.GaugeVec
	ipLocations *prometheus.CounterVec
	histogram   *prometheus.SummaryVec
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

	app.botsList = []string{"aolbuild", "bingbot", "bingpreview", "msnbot", "duckduckgo", "adsbot-google", "googlebot",
		"mediapartners-google", "teoma", "slurp", "yandex", "facebookexternalhit", "facebookexternalhit/1.1", "twitterbot/1.0", "twitterbot/0.1",
		"telegrambot", "twitterbot"}

	app.semistaticBuckets = []string{"POKEMONS", "MOVES", "LEVELS", "MULTIPLIERS", "SHINY", "RAIDS", "EGGS", "RATING"}
	//create/open bases
	err = app.semistaticDatabase.createDatabase("./semistatic.db", "BOLTDB", app.semistaticBuckets)
	if err != nil {
		return &App{}, err
	}
	err = app.newsDatabse.createDatabase("./news.db", "BOLTDB", []string{"NEWS_HEADERS", "NEWS"})
	if err != nil {
		return &App{}, err
	}
	err = app.users.createDatabase("./users.db", "BOLTDB", []string{"SUPERADMINS"})
	if err != nil {
		return &App{}, err
	}
	err = app.pvpDatabase.createDatabase("./pvp.db", "BOLTDB", []string{"PVPRESULTS"})
	if err != nil {
		return &App{}, err
	}
	err = app.pveDatabase.createDatabase("./pve.db", "BOLTDB", []string{"PVERESULTS"})
	if err != nil {
		return &App{}, err
	}

	//init server
	app.initServer()
	//start clean up task
	go app.pvpDatabase.cleanupPvpBucket(72, "PVPRESULTS", &app)
	//start update db task
	go app.semistaticDatabase.startUpdaterService(5, "SHINY", "value", &app, getbase.GetShinyBase)
	go app.semistaticDatabase.startUpdaterService(24, "RAIDS", "value", &app, getbase.GetRaidsList)
	go app.semistaticDatabase.startUpdaterService(24, "EGGS", "value", &app, getbase.GetEggsList)
	return &app, nil
}

func (a *App) initServer() {
	a.metricsSrv = a.initMetrics()
	a.pvpSrv = a.initPvpSrv()
}

func (dbs *database) createDatabase(pathToDB, envPath string, bucketName []string) error {
	var err error
	dbs.value, err = bolt.Open(path.Join(os.Getenv(envPath)+pathToDB), 0600, nil)
	if err != nil {
		return err
	}
	err = dbs.value.Update(func(tx *bolt.Tx) error {
		for _, value := range bucketName {
			_, err := tx.CreateBucketIfNotExists([]byte(value))
			if err != nil {
				return fmt.Errorf("Can not create bucket %v: %v", value, err)
			}
		}
		return nil
	})
	return err
}

func (dbs *database) addStaticBase(path, bucketName string) error {
	//rewrite bucket value on restart
	base, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}
	err = dbs.value.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		err = b.Put([]byte("value"), base)
		if err != nil {
			return fmt.Errorf("Can not insert to the bucket %v: %v", bucketName, err)
		}
		return nil
	})
	return err
}

//Clean up pvp bucket
func (dbs *database) cleanupPvpBucket(timer uint, bucketName string, app *App) {
	for {
		time.Sleep(time.Duration(timer) * time.Hour)
		app.metrics.appCounters.With(prometheus.Labels{"type": "cleanup_pvp_count"}).Inc()

		err := dbs.value.Update(func(tx *bolt.Tx) error {
			var obj appl.PvpResults
			b := tx.Bucket([]byte(bucketName))

			b.ForEach(func(k, v []byte) error {
				if err := json.Unmarshal(v, &obj); err != nil {
					return fmt.Errorf("Error during %v bucket cleanup %v", bucketName, err)
				}
				if time.Now().Sub(obj.CreatedAt) > time.Duration(timer)*time.Hour {
					b.Delete(k)
				}
				return nil
			})
			return nil
		})
		if err != nil {
			app.metrics.appCounters.With(prometheus.Labels{"type": "cleanup_pvp_error_count"}).Inc()
			log.WithFields(log.Fields{"location": "cleanupPVP"}).Error(err)
			continue
		}
	}
}

func (dbs *database) startUpdaterService(timer uint, bucketName, key string, app *App, funcCall func() ([]byte, error)) {
	//start updater service
	for {
		time.Sleep(time.Duration(timer) * time.Hour)
		app.metrics.dbCounters.With(prometheus.Labels{"type": "update_db_count"}).Inc()
		err := dbs.updateBase(bucketName, key, funcCall)
		if err != nil {
			app.metrics.dbCounters.With(prometheus.Labels{"type": "update_db_error_count"}).Inc()
			log.WithFields(log.Fields{"location": "updaterService, " + bucketName}).Error(err)
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
		err = b.Put([]byte(key), table)
		if err != nil {
			return fmt.Errorf("Can not insert key: %v to the bucket %v: %v", key, bucketName, err)
		}
		err = b.Put([]byte("version"), uintToByte(newVer))
		if err != nil {
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
		err := b.Put([]byte("version"), uintToByte(newVer))
		if err != nil {
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
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Pvp-Type, Pvp-Shields")
}

type rootHandler struct {
	function func(*http.ResponseWriter, *http.Request, *App) error
	app      *App
}

// rootHandler implements http.Handler interface.
func (rh rootHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	//close request body
	defer r.Body.Close()
	//set up CORS
	if rh.app.corsEnabled {
		setupCors(&w, r)
	}
	//handle options method
	if (*r).Method == "OPTIONS" {
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
		log.WithFields(log.Fields{"location": "indexHandler"}).Error(err)

		//If the error is not ClientError, consider that it is an ServerError
		w.WriteHeader(500) // return 500 Internal Server Error
		return
	}
	//Try to get response body of ClientError
	body, err := clientError.ResponseBody()
	if err != nil {
		log.WithFields(log.Fields{"location": "indexHandler"}).Errorf("An error accured during parsing error body: %v", err)
		w.WriteHeader(500)
		return
	}
	log.WithFields(log.Fields{"location": "indexHandler"}).Errorf(string(body))

	//Get http status code and headers
	status, headers := clientError.ResponseHeaders()
	for k, v := range headers {
		w.Header().Set(k, v)
	}
	w.WriteHeader(status)
	_, err = w.Write(body)
	if err != nil {
		log.WithFields(log.Fields{"location": "indexHandler"}).Errorf("An error accured during writing error body: %v", err)
		w.WriteHeader(500)
		return
	}
}

func checkLimits(RemoteAddr, limiterType string, ipLocations *prometheus.CounterVec) error {
	//Check visitor's requests limit
	limiter := limiter.GetVisitor(RemoteAddr, limiterType, ipLocations)
	if limiter.Allow() == false {
		return errors.NewHTTPError(nil, 429, "Too many Requests")
	}
	return nil
}

func (a *App) checkBot(str string) bool {
	for _, sub := range a.botsList {
		if strings.Contains(str, sub) {
			return true
		}
	}
	return false
}

func serveIndex(w *http.ResponseWriter, r *http.Request, app *App) error {
	//Check visitor's requests limit
	err := checkLimits(getIP(r), "limiterPage", app.metrics.ipLocations)
	if err != nil {
		return err
	}
	agent := r.Header.Get("User-Agent")
	log.WithFields(log.Fields{"location": "index"}).Println("User-agent: " + agent)
	isBot := app.checkBot(strings.ToLower(agent))

	if !isBot {
		http.ServeFile(*w, r, "./interface/build/200.html")
		return nil
	}

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
		http.ServeFile(*w, r, "./interface/build/pve/common/index.html")
	case "pvprating":
		http.ServeFile(*w, r, "./interface/build/pvprating/index.html")
	case "shinyrates":
		http.ServeFile(*w, r, "./interface/build/shinyrates/index.html")
	case "evolution":
		http.ServeFile(*w, r, "./interface/build/evolution/index.html")
	case "raids":
		http.ServeFile(*w, r, "./interface/build/raids/index.html")
	case "eggs":
		http.ServeFile(*w, r, "./interface/build/eggs/index.html")
	default:
		http.ServeFile(*w, r, "./interface/build/404.html")
	}
	return nil
}

//reads key in the bucket specified
func (dbs *database) readBase(bucket, key string) []byte {
	var base []byte
	dbs.value.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		base = b.Get([]byte(key))
		return nil
	})
	return base
}

func (dbs *database) createNewEntry(bucketName, bucketKey string, answer []byte) error {
	var err error
	err = dbs.value.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		err = b.Put([]byte(bucketKey), answer)
		if err != nil {
			return fmt.Errorf("Can not insert entry to the bucket %v: %v", bucketName, err)
		}
		return nil
	})
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func dbCallHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("base"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodGet {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "base_error_count"}).Inc()
		return errors.NewHTTPError(nil, 405, "Method not allowed")
	}
	//Check visitor's requests limit
	err := checkLimits(getIP(r), "limiterBase", app.metrics.ipLocations)
	if err != nil {
		return err
	}

	bucketName := strings.ToUpper(chi.URLParam(r, "type"))
	value := chi.URLParam(r, "value")
	switch bucketName {
	case "POKEMONS":
	case "MOVES":
	case "SHINY":
	case "RAIDS":
	case "EGGS":
	case "RATING":
	default:
		return errors.NewHTTPError(nil, 400, "Unsupported db")
	}

	ver := strconv.FormatUint(byteToUint(app.semistaticDatabase.readBase(bucketName, "version")), 10)

	if (*r).Header.Get("If-None-Match") == ver {
		(*w).WriteHeader(304)
		return nil
	}

	app.metrics.dbCounters.With(prometheus.Labels{"type": strings.ToLower(bucketName)}).Inc()
	if value == "" {
		value = "value"
	}

	base := app.semistaticDatabase.readBase(bucketName, value)

	(*w).Header().Set("Etag", ver)
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(base)
	return nil
}

func newsHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	app.metrics.dbCounters.With(prometheus.Labels{"type": "news"}).Inc()
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("news"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodGet {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "base_error_count"}).Inc()
		return errors.NewHTTPError(nil, 405, "Method not allowed")
	}
	//Check visitor's requests limit
	err := checkLimits(getIP(r), "limiterBase", app.metrics.ipLocations)
	if err != nil {
		return err
	}
	var (
		bucketName string
		bucketKey  = chi.URLParam(r, "id")
	)
	switch chi.URLParam(r, "type") {
	case "page":
		bucketName = "NEWS_HEADERS"
	case "id":
		bucketName = "NEWS"
	default:
		return errors.NewHTTPError(err, 400, "Unsupported method")
	}

	newsHeadersBase, err := app.newsDatabse.readNews(bucketName, bucketKey)
	if err != nil {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "base_error_count"}).Inc()
		return err
	}
	answer, err := json.Marshal(newsHeadersBase)
	if err != nil {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "base_error_count"}).Inc()
		return fmt.Errorf("Marshal error: %v", err)
	}

	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	return nil
}

//reads news from the base
func (dbs *database) readNews(bucket, page string) ([]string, error) {
	var answer []string
	err := dbs.value.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		c := b.Cursor()

		k, v := c.Last()
		//if there are no news, return "no"
		if v == nil {
			answer = append(answer, "no")
			return nil
		}

		lastKey := int64(binary.BigEndian.Uint64(k))
		requstedKey, err := strconv.ParseUint(page, 10, 64)
		//check key format
		if err != nil {
			return errors.NewHTTPError(err, 400, "Wrong key number fromat")
		}
		if int64(requstedKey) <= 0 {
			return errors.NewHTTPError(err, 400, "Key cannot be negative")
		}
		//process news request
		if bucket == "NEWS" {
			if int64(requstedKey) > lastKey {
				return errors.NewHTTPError(err, 404, "News not found")
			}
			k, v = c.Seek(uintToByte(requstedKey))
			answer = append(answer, string(v[:]))
			return nil
		}
		nextPageExists := "yes"
		if lastKey-(int64(requstedKey))*5 <= 0 {
			nextPageExists = "no"
		}
		answer = append(answer, nextPageExists)
		//process news list request
		fromNews := lastKey - (int64(requstedKey)-1)*5
		if (fromNews) < 0 {
			return nil
		}
		k, v = c.Seek(uintToByte(uint64(fromNews)))
		answer = append(answer, string(v[:]))

		for i := 0; i < 4; i++ {
			k, v = c.Prev()
			if k == nil {
				break
			}
			answer = append(answer, string(v[:]))
		}
		return nil
	})
	return answer, err
}

func uintToByte(v uint64) []byte {
	b := make([]byte, 8)
	binary.BigEndian.PutUint64(b, v)
	return b
}

func pveHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("pve"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodGet {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "pve_error_count"}).Inc()
		return errors.NewHTTPError(nil, 405, "Method is not allowed")
	}
	//Check visitor's requests limit
	err := checkLimits(getIP(r), "limiterPvp", app.metrics.ipLocations)
	if err != nil {
		return err
	}
	go app.metrics.appCounters.With(prometheus.Labels{"type": "pve_count"}).Inc()

	attacker := chi.URLParam(r, "attacker")
	boss := chi.URLParam(r, "boss")
	obj := chi.URLParam(r, "obj")
	//if base aldready exists there is no need to create it again
	var answer []byte

	if answer == nil {
		//Parse request
		inDat, err := parser.ParseRaidRequest(attacker, boss, obj)
		if err != nil {
			return err
		}
		//Start new raid
		pveResult, err := sim.CalculteCommonPve(inDat)

		if err != nil {
			go app.metrics.appCounters.With(prometheus.Labels{"type": "pve_error_count"}).Inc()
			return errors.NewHTTPError(err, 400, "PvE error")
		}
		log.WithFields(log.Fields{"location": "pvpHandler"}).Println("Calculated raid")

		//Create json answer from pvpResult
		answer, err = json.Marshal(pveResult)
		if err != nil {
			go app.metrics.appCounters.With(prometheus.Labels{"type": "pve_error_count"}).Inc()
			return fmt.Errorf("PvE result marshal error: %v", err)
		}
	}

	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	return nil
}

func pvpHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("pvp"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodGet {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
		return errors.NewHTTPError(nil, 405, "Method is not allowed")
	}
	//Check visitor's requests limit
	err := checkLimits(getIP(r), "limiterPvp", app.metrics.ipLocations)
	if err != nil {
		return err
	}
	go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_count"}).Inc()
	pok1 := chi.URLParam(r, "pok1")
	pok2 := chi.URLParam(r, "pok2")
	isPvpoke := r.Header.Get("Pvp-Type")
	//if base aldready exists there is no need to create it again
	pvpBaseKey := pok1 + pok2

	var answer []byte
	switch isPvpoke {
	case "pvpoke":
		answer = app.pvpDatabase.readBase("PVPRESULTS", pvpBaseKey+"pvpoke")
		log.WithFields(log.Fields{"location": "pvpHandler"}).Println("Pvpoke enabled")
	default:
		answer = app.pvpDatabase.readBase("PVPRESULTS", pvpBaseKey)
	}

	if answer != nil {
		log.WithFields(log.Fields{"location": "pvpHandler"}).Println("Got from pvp base")
	}
	if answer == nil {
		//Parse request
		attacker, defender, err := parser.ParsePvpRequest(pok1, pok2)
		if err != nil {
			return err
		}
		//Start new PvP
		var pvpResult appl.PvpResults
		switch isPvpoke {
		case "pvpoke":
			pvpResult, err = sim.NewPvpBetweenPvpoke(appl.SinglePvpInitialData{
				AttackerData: attacker,
				DefenderData: defender,
				Constr:       appl.Constructor{},
				Logging:      true})
		default:
			pvpResult, err = sim.NewPvpBetween(appl.SinglePvpInitialData{
				AttackerData: attacker,
				DefenderData: defender,
				Constr:       appl.Constructor{},
				Logging:      true})
		}

		if err != nil {
			go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
			return errors.NewHTTPError(err, 400, "PvP error")
		}
		log.WithFields(log.Fields{"location": "pvpHandler"}).Println("Calculated")
		//Create json answer from pvpResult
		answer, err = json.Marshal(pvpResult)
		if err != nil {
			go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
			return fmt.Errorf("PvP result marshal error: %v", err)
		}
		if !pvpResult.IsRandom {
			switch isPvpoke {
			case "pvpoke":
				go app.writePvp(answer, pvpBaseKey+"pvpoke")
			default:
				go app.writePvp(answer, pvpBaseKey)
			}
		}
		if err != nil {
			go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
			return err
		}
	}
	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	return nil
}

func (a *App) writePvp(battleRes []byte, key string) {
	//put it into the base
	err := a.pvpDatabase.createNewEntry("PVPRESULTS", key, battleRes)
	if err != nil {
		a.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
		log.WithFields(log.Fields{"location": "putMatrixRwsult"}).Error(err)
		return
	}
}

func matrixHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("matrix_pvp"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return errors.NewHTTPError(nil, 405, "Method is not allowed")
	}

	//Check visitor's requests limit
	err := checkLimits(getIP(r), "limiterPvp", app.metrics.ipLocations)
	if err != nil {
		return err
	}
	go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp"}).Inc()
	//Read request body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Error while reading request body")
	}
	//Parse request
	matrixObj := matrixPvP{}
	matrixObj.rowA, matrixObj.rowB, err = parser.ParseMatrixRequest(body)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return err
	}
	if len(matrixObj.rowA) > 50 || len(matrixObj.rowB) > 50 {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Parties with length more than 50 ae not allowed")
	}
	//Start new PvP
	shieldsNumber := r.Header.Get("Pvp-Shields")
	matrixObj.isPvpoke = r.Header.Get("Pvp-Type")
	matrixObj.app = app
	matrixObj.result = make([][]appl.MatrixResult, 0, 1)
	switch shieldsNumber {
	case "triple":
		err = matrixObj.calculateMatrix(0)
		if err != nil {
			return err
		}
		err = matrixObj.calculateMatrix(1)
		if err != nil {
			return err
		}
		err = matrixObj.calculateMatrix(2)
		if err != nil {
			return err
		}
	default:
		err = matrixObj.calculateMatrix(5)
		if err != nil {
			return err
		}
	}

	log.WithFields(log.Fields{"location": "matrixPvpHandler"}).Println("Calculated")
	//Create json answer from pvpResult
	answer, err := json.Marshal(matrixObj.result)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return fmt.Errorf("PvP result marshal error: %v", err)
	}
	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write([]byte(answer))
	return nil
}

type matrixPvP struct {
	rowA []appl.InitialData
	rowB []appl.InitialData

	pokA appl.InitialData
	pokB appl.InitialData

	errChan appl.ErrorChan

	result [][]appl.MatrixResult
	app    *App

	isPvpoke string
	i        int
	k        int
}

func (mp *matrixPvP) calculateMatrix(shields uint8) error {
	mp.errChan = make(appl.ErrorChan, len(mp.rowA)*len(mp.rowB))
	singleMatrixResults := make([]appl.MatrixResult, 0, len(mp.rowA)*len(mp.rowB))
	for mp.i, mp.pokA = range mp.rowA {
		for mp.k, mp.pokB = range mp.rowB {
			if shields != 5 {
				mp.pokA.Shields = shields
				mp.pokA.Query = strconv.FormatUint(uint64(shields), 10) + mp.pokA.Query[1:]

				mp.pokB.Shields = shields
				mp.pokB.Query = strconv.FormatUint(uint64(shields), 10) + mp.pokB.Query[1:]
			}
			mp.runMatrixPvP(&singleMatrixResults)
		}
	}
	close(mp.errChan)
	errStr := mp.errChan.Flush()
	if errStr != "" {
		go mp.app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf(errStr), 400, "PvP error")
	}
	mp.result = append(mp.result, singleMatrixResults)
	return nil
}

func (mp *matrixPvP) runMatrixPvP(singleMatrixResults *[]appl.MatrixResult) {
	//if pokemons are the same, it should be tie without any calculations
	if mp.pokA.Query == mp.pokB.Query {
		*singleMatrixResults = append(*singleMatrixResults, appl.MatrixResult{
			I:      mp.i,
			K:      mp.k,
			Rate:   500,
			QueryA: mp.pokA.Query,
			QueryB: mp.pokB.Query,
		})
		return
	}

	matrixBattleResult := appl.MatrixResult{}
	//otherwise check pvp results in base
	pvpBaseKey := mp.pokA.Query + mp.pokB.Query

	var (
		baseEntry []byte
		err       error
	)
	switch mp.isPvpoke {
	case "pvpoke":
		baseEntry = mp.app.pvpDatabase.readBase("PVPRESULTS", pvpBaseKey+"pvpoke")
	default:
		baseEntry = mp.app.pvpDatabase.readBase("PVPRESULTS", pvpBaseKey)
	}

	switch baseEntry {
	case nil: //if result doesn't exist
		var singleBattleResult appl.PvpResults
		switch mp.isPvpoke {
		case "pvpoke":
			singleBattleResult, err = sim.NewPvpBetweenPvpoke(appl.SinglePvpInitialData{
				AttackerData: mp.pokA,
				DefenderData: mp.pokB,
				Constr:       appl.Constructor{},
				Logging:      true})
		default:
			singleBattleResult, err = sim.NewPvpBetween(appl.SinglePvpInitialData{
				AttackerData: mp.pokA,
				DefenderData: mp.pokB,
				Constr:       appl.Constructor{},
				Logging:      true})
		}

		if err != nil {
			mp.errChan <- err
			return
		}
		matrixBattleResult.Rate = singleBattleResult.Attacker.Rate
		matrixBattleResult.QueryA = mp.pokA.Query
		matrixBattleResult.QueryB = mp.pokB.Query
		//if results are not random
		if !singleBattleResult.IsRandom {
			go func(battleRes appl.PvpResults, key string) {
				//Create json from singleBattleResult
				newBaseEntry, err := json.Marshal(battleRes)
				if err != nil {
					mp.app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
					log.WithFields(log.Fields{"location": "putMatrixRwsult"}).Error(fmt.Errorf("Matrix PvP result marshal error: %v", err))
					return
				}
				switch mp.isPvpoke {
				case "pvpoke":
					mp.app.writePvp(newBaseEntry, pvpBaseKey+"pvpoke")
				default:
					mp.app.writePvp(newBaseEntry, pvpBaseKey)
				}
			}(singleBattleResult, pvpBaseKey)
		}

	default: //if result exists
		var singleBattleResult appl.PvpResults
		err = json.Unmarshal(baseEntry, &singleBattleResult)
		if err != nil {
			go mp.app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
			mp.errChan <- fmt.Errorf("Matrix PvP result unmarshal error: %v", err)
			return
		}
		matrixBattleResult.Rate = singleBattleResult.Attacker.Rate
		matrixBattleResult.QueryA = mp.pokA.Query
		matrixBattleResult.QueryB = mp.pokB.Query
	}

	matrixBattleResult.I = mp.i
	matrixBattleResult.K = mp.k
	*singleMatrixResults = append(*singleMatrixResults, matrixBattleResult)
}

func constructorPvpHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("constructor_pvp"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return errors.NewHTTPError(nil, 405, "Method is not allowed")
	}

	//Check visitor's requests limit
	err := checkLimits(getIP(r), "limiterPvp", app.metrics.ipLocations)
	if err != nil {
		return err
	}
	go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp"}).Inc()
	//Read request body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Error while reading request body")
	}
	//Parse request
	pokA, pokB, constructor, err := parser.ParseConstructorRequest(body)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return err
	}
	isPvpoke := r.Header.Get("Pvp-Type")

	//Start new PvP
	var pvpResult appl.PvpResults

	switch isPvpoke {
	case "pvpoke":
		log.WithFields(log.Fields{"location": "pvpHandler"}).Println("Pvpoke enabled")
		pvpResult, err = sim.NewPvpBetweenPvpoke(appl.SinglePvpInitialData{
			AttackerData: pokA,
			DefenderData: pokB,
			Constr:       constructor,
			Logging:      true,
		})
	default:
		pvpResult, err = sim.NewPvpBetween(appl.SinglePvpInitialData{
			AttackerData: pokA,
			DefenderData: pokB,
			Constr:       constructor,
			Logging:      true,
		})
	}

	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "PvP error")
	}
	log.WithFields(log.Fields{"location": "constructorPvpHandler"}).Println("Calculated")
	//Create json answer from pvpResult
	answer, err := json.Marshal(pvpResult)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return fmt.Errorf("PvP result marshal error: %v", err)
	}
	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write([]byte(answer))
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
	log.WithFields(log.Fields{"location": "global"}).Println("Server is listening...")

	log.WithFields(log.Fields{"location": "global"}).Println(a.pvpSrv.ListenAndServe())
}

func (a *App) initMetrics() *http.Server {
	a.metrics.appCounters = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "app_calls",
			Help: "Number of app calls by type",
		},
		[]string{"type"},
	)
	a.metrics.dbCounters = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "db_calls",
			Help: "Number of base calls by type",
		},
		[]string{"type"},
	)
	a.metrics.apiCounters = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "api_calls",
			Help: "Number of api calls by type",
		},
		[]string{"type"},
	)
	a.metrics.ipLocations = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "locations",
			Help: "Number of connections by country",
		},
		[]string{"country"},
	)
	a.metrics.histogram = prometheus.NewSummaryVec(prometheus.SummaryOpts{
		Name:       "request_duration_ms",
		Objectives: map[float64]float64{0.5: 0.05, 0.9: 0.01, 0.99: 0.001},
	}, []string{"code"})

	prometheus.MustRegister(a.metrics.appCounters)
	prometheus.MustRegister(a.metrics.dbCounters)
	prometheus.MustRegister(a.metrics.apiCounters)
	prometheus.MustRegister(a.metrics.ipLocations)
	prometheus.MustRegister(a.metrics.histogram)

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

func (a *App) initPvpSrv() *http.Server {
	router := chi.NewRouter()

	router.Use(middleware.Compress(5))

	//statics
	router.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("./interface/build/static"))))
	router.Handle("/images/*", http.StripPrefix("/images/", http.FileServer(http.Dir("./interface/build/images"))))
	router.Handle("/sitemap/*", http.StripPrefix("/sitemap/", http.FileServer(http.Dir("./interface/build/sitemap"))))

	router.Handle("/", rootHandler{serveIndex, a})
	router.Handle("/pvp*", rootHandler{serveIndex, a})
	router.Handle("/news*", rootHandler{serveIndex, a})
	router.Handle("/shinyrates*", rootHandler{serveIndex, a})
	router.Handle("/evolution*", rootHandler{serveIndex, a})
	router.Handle("/raids*", rootHandler{serveIndex, a})
	router.Handle("/eggs*", rootHandler{serveIndex, a})
	router.Handle("/pvprating*", rootHandler{serveIndex, a})
	router.Handle("/pve*", rootHandler{serveIndex, a})

	//dynamic content requsts
	router.Handle("/request/single/{league}/{pok1}/{pok2}", rootHandler{pvpHandler, a})
	router.Handle("/request/constructor", rootHandler{constructorPvpHandler, a})
	router.Handle("/request/matrix", rootHandler{matrixHandler, a})

	router.Handle("/request/common/{attacker}/{boss}/{obj}", rootHandler{pveHandler, a})

	//bd calls
	router.Handle("/db/{type}", rootHandler{dbCallHandler, a})
	router.Handle("/db/{type}/{value}", rootHandler{dbCallHandler, a})
	router.Handle("/newsdb/{type}/{id}", rootHandler{newsHandler, a})
	//admin services
	router.Handle("/api/news/{action}", rootHandler{newsAPIHandler, a})
	router.Handle("/api/log/{action}", rootHandler{logAPIHandler, a})
	router.Handle("/api/dbupdate/{action}", rootHandler{dbUpdateAPIHandler, a})
	//rootHandler{serveIndex, a}

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
	defer log.WithFields(log.Fields{"location": "datbase"}).Error(app.semistaticDatabase.Close)
	defer log.WithFields(log.Fields{"location": "datbase"}).Error(app.pvpDatabase.Close)
	defer log.WithFields(log.Fields{"location": "datbase"}).Error(app.newsDatabse.Close)
	defer log.WithFields(log.Fields{"location": "datbase"}).Error(app.users.Close)

	app.listen()
}
