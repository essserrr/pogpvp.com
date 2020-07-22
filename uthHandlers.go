package main

import (
	"Solutions/pvpSimulator/core/errors"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"

	users "Solutions/pvpSimulator/core/users"
	mongocalls "Solutions/pvpSimulator/core/users/mongocalls"

	"github.com/mssola/user_agent"
	log "github.com/sirupsen/logrus"

	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"github.com/prometheus/client_golang/prometheus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readconcern"
	"go.mongodb.org/mongo-driver/mongo/writeconcern"
	"golang.org/x/crypto/bcrypt"
)

type mongoDatabse struct {
	client *mongo.Client
}

func (mdb *mongoDatabse) newMongo() error {
	client, err := connectToMongo()
	if err != nil {
		return err
	}
	mdb.client = client
	return nil
}

func connectToMongo() (*mongo.Client, error) {
	//start new connection
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGO_URI"))
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return nil, err
	}
	//test connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.WithFields(log.Fields{"location": "createApp"}).Errorf("Ping failed")
		return nil, err
	}
	return client, nil
}

func register(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodPost {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	form := new(users.RegForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyRegForm(ip); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Registration form err"), http.StatusBadRequest, err.Error())
	}
	form.Encode()
	if err := mongocalls.CheckUserExistance(app.mongo.client, form); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Registration data err"), http.StatusBadRequest, err.Error())
	}
	id, err := mongocalls.Signup(app.mongo.client, form)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Registration err"), http.StatusBadRequest, err.Error())
	}
	browser, os := browserAndOs(r.Header.Get("User-Agent"))
	tokens, err := mongocalls.NewSession(app.mongo.client, mongocalls.Session{
		SessionFingerprint: form.Fingerprint,
		Browser:            browser,
		Os:                 os,
	}, id)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		log.WithFields(log.Fields{"location": app.metrics.ipLocations}).Errorf("Token creation failed")
		tokens = &mongocalls.Tokens{}
	}
	fmt.Println("New user has just registered " + form.Username)
	http.SetCookie(*w, &http.Cookie{Name: "refToken", Value: tokens.RToken.Token, Path: "/api/auth", Domain: "localhost",
		MaxAge: int(tokens.RToken.Expires), Secure: true, HttpOnly: true})
	if err = respond(w, tokens.AToken); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func browserAndOs(agent string) (string, string) {
	ua := user_agent.New(agent)
	name, version := ua.Browser()
	return name + " " + version, ua.OS()
}

func parseBody(r *http.Request, target interface{}) error {
	//read req body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	//parse RegForm
	if err = json.Unmarshal(body, &target); err != nil {
		return err
	}
	return nil
}

func respond(w *http.ResponseWriter, target interface{}) error {
	answer, err := json.Marshal(target)
	if err != nil {
		return err
	}
	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	if err != nil {
		return err
	}
	return nil
}

type request struct {
	GUID      string
	SessionID string
	Refresh   string
}

func login(w *http.ResponseWriter, r *http.Request, app *App) error {
	reqBody, err := processRequestBody(r)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	tokens, hash, err := generateTokens(reqBody)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return fmt.Errorf("Generate tokens error: %v", err)
	}
	tokens.SessionID = uuid.New().String()
	err = writeTransaction(user{tokens.SessionID, reqBody.GUID, hash, tokens.RtExpires, tokens.AtExpires})
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return fmt.Errorf("Write transaction error: %v", err)
	}
	if err = tokens.writeResponse(w); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func processRequestBody(r *http.Request) (*request, error) {
	//read req body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}
	//parse request obj
	var reqBody request
	if err = json.Unmarshal(body, &reqBody); err != nil {
		return nil, err
	}
	if err = reqBody.check(); err != nil {
		return nil, err
	}
	return &reqBody, nil
}

func generateTokens(reqBody *request) (*tokenDetails, string, error) {
	//make new token obj
	tokens := tokenDetails{}
	if err := tokens.newAccess(reqBody.GUID); err != nil {
		return nil, "", err
	}
	refresh := tokens.newRefresh()
	//make new write transaction
	refreshHash, err := makeHash([]byte(refresh))
	if err != nil {
		return nil, "", err
	}
	return &tokens, refreshHash, nil
}

type tokenDetails struct {
	SessionID string

	AccessToken  string
	RefreshToken string

	AtExpires int64
	RtExpires int64
}

func (td *tokenDetails) newRefresh() string {
	//lifetime
	td.RtExpires = time.Now().Add(time.Second * 10).Unix()
	//toke body
	refresh := uuid.New().String()
	td.RefreshToken = newBase64(refresh)
	return refresh
}

func (td *tokenDetails) newAccess(userid string) error {
	//lifetime
	td.AtExpires = time.Now().Add(time.Second * 60).Unix()
	//token body
	var err error
	atClaims := jwt.MapClaims{}
	atClaims["user_id"] = userid
	atClaims["exp"] = td.AtExpires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte("123456"))
	if err != nil {
		return err
	}
	return nil
}

func (req *request) check() error {
	if req.GUID == "" {
		return fmt.Errorf("Zero GUID")
	}
	if req.SessionID == "" {
		return fmt.Errorf("Zero session ID")
	}
	if req.Refresh == "" {
		return fmt.Errorf("Zero token")
	}
	return nil
}

func (td *tokenDetails) writeResponse(w *http.ResponseWriter) error {
	answer, err := json.Marshal(*td)
	if err != nil {
		return err
	}
	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	if err != nil {
		return err
	}
	return nil
}

type user struct {
	ID        string `bson:"_id,omitempty"`
	GUID      string `bson:guid,omitempty"`
	Refresh   string `bson:"refresh,omitempty"`
	RExpires  int64  `bson:"rexp,omitempty"`
	AtExpires int64  `bson:"aexp,omitempty"`
}

type tranObj struct {
	collection *mongo.Collection
	txnOpts    *options.TransactionOptions
	client     *mongo.Client
	session    mongo.Session
}

func initTransaction() (*tranObj, error) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		return nil, err
	}
	database := client.Database("testdb")
	collection := database.Collection("users")
	database.RunCommand(context.TODO(), bson.D{{"create", "users"}})

	wc := writeconcern.New(writeconcern.WMajority())
	rc := readconcern.Snapshot()
	txnOpts := options.Transaction().SetWriteConcern(wc).SetReadConcern(rc)

	session, err := client.StartSession()
	if err != nil {
		return nil, err
	}
	return &tranObj{collection, txnOpts, client, session}, nil
}

func writeTransaction(usr user) error {
	tran, err := initTransaction()
	if err != nil {
		return err
	}
	defer tran.client.Disconnect(context.TODO())
	defer tran.session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), tran.session, func(sessionContext mongo.SessionContext) error {
		if err = tran.session.StartTransaction(tran.txnOpts); err != nil {
			return err
		}
		_, err := tran.collection.InsertOne(
			sessionContext,
			usr,
		)
		if err != nil {
			return err
		}
		if err = tran.session.CommitTransaction(sessionContext); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		if abortErr := tran.session.AbortTransaction(context.Background()); abortErr != nil {
			return err
		}
		return err
	}
	return nil
}

func makeHash(pwd []byte) (string, error) {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}
func comparePasswords(hashPwd string, plainPwd []byte) error {
	byteHash := []byte(hashPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, plainPwd)
	if err != nil {
		return err
	}
	return nil
}

func newBase64(s string) string {
	return base64.StdEncoding.EncodeToString([]byte(s))
}

func decodeBase64(s string) ([]byte, error) {
	decoded, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return nil, err
	}
	return decoded, nil
}

func refresh(w *http.ResponseWriter, r *http.Request, app *App) error {
	reqBody, err := processRequestBody(r)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "refresh_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err = checkRefreshToken(reqBody); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "refresh_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusUnauthorized, "Authorization error")
	}
	tokens, hash, err := generateTokens(reqBody)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "refresh_error_count"}).Inc()
		return fmt.Errorf("Generate tokens error: %v", err)
	}
	tokens.SessionID = reqBody.SessionID
	err = updateTransaction(user{reqBody.SessionID, reqBody.GUID, hash, tokens.RtExpires, tokens.AtExpires})
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "refresh_error_count"}).Inc()
		return fmt.Errorf("Update transaction error: %v", err)
	}

	if err = tokens.writeResponse(w); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "refresh_error_count"}).Inc()
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func checkRefreshToken(usr *request) error {
	tran, err := initTransaction()
	if err != nil {
		return err
	}
	defer tran.client.Disconnect(context.TODO())
	defer tran.session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), tran.session, func(sessionContext mongo.SessionContext) error {
		if err = tran.session.StartTransaction(tran.txnOpts); err != nil {
			return err
		}

		filterCursor, err := tran.collection.Find(sessionContext, bson.M{"_id": usr.SessionID})
		if err != nil {
			return err
		}
		var usersFiltered []user
		if err = filterCursor.All(sessionContext, &usersFiltered); err != nil {
			return err
		}
		if len(usersFiltered) > 1 {
			return fmt.Errorf("Oops found dupplicate session")
		}
		if len(usersFiltered) < 1 {
			return fmt.Errorf("Oops Session not found")
		}

		if err = usersFiltered[0].compare(usr); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		if abortErr := tran.session.AbortTransaction(context.Background()); abortErr != nil {
			return err
		}
		return err
	}
	return nil
}

func (u *user) compare(usr *request) error {
	if usr.GUID != u.GUID {
		return fmt.Errorf("Wrong username")
	}
	token, err := decodeBase64(usr.Refresh)
	if usr.GUID != u.GUID {
		return err
	}
	if err = comparePasswords(u.Refresh, token); err != nil {
		return err
	}
	return nil
}

func updateTransaction(usr user) error {
	tran, err := initTransaction()
	if err != nil {
		return err
	}
	defer tran.client.Disconnect(context.TODO())
	defer tran.session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), tran.session, func(sessionContext mongo.SessionContext) error {
		if err = tran.session.StartTransaction(tran.txnOpts); err != nil {
			return err
		}

		_, err := tran.collection.UpdateOne(
			sessionContext,
			bson.M{"_id": usr.ID},
			bson.M{"$set": bson.M{
				"_id":     usr.ID,
				"guid":    usr.GUID,
				"refresh": usr.Refresh,
				"rexp":    usr.RExpires,
				"aexp":    usr.AtExpires,
			}},
		)
		if err != nil {
			return err
		}
		if err = tran.session.CommitTransaction(sessionContext); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		if abortErr := tran.session.AbortTransaction(context.Background()); abortErr != nil {
			return err
		}
		return err
	}
	return nil
}

func logout(w *http.ResponseWriter, r *http.Request, app *App) error {
	reqBody, err := processRequestBody(r)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err = checkRefreshToken(reqBody); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusUnauthorized, "Authorization error")
	}
	reqType := chi.URLParam(r, "type")
	switch reqType {
	case "one":
		if err = logoutTransaction(reqBody); err != nil {
			go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
			return fmt.Errorf("Logout transaction error: %v", err)
		}
	case "all":
		if err = logoutAllTransaction(reqBody); err != nil {
			go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
			return fmt.Errorf("Logout all transaction error: %v", err)
		}
	default:
		go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return fmt.Errorf("Unknown path")
	}
	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write([]byte("Successfully deleted"))
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func logoutTransaction(newRequest *request) error {
	tran, err := initTransaction()
	if err != nil {
		return err
	}
	defer tran.client.Disconnect(context.TODO())
	defer tran.session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), tran.session, func(sessionContext mongo.SessionContext) error {
		if err = tran.session.StartTransaction(tran.txnOpts); err != nil {
			return err
		}
		_, err := tran.collection.DeleteOne(sessionContext, bson.M{"_id": newRequest.SessionID})
		if err != nil {
			return err
		}
		if err = tran.session.CommitTransaction(sessionContext); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		if abortErr := tran.session.AbortTransaction(context.Background()); abortErr != nil {
			return err
		}
		return err
	}
	return nil
}

func logoutAllTransaction(newRequest *request) error {
	tran, err := initTransaction()
	if err != nil {
		return err
	}
	defer tran.client.Disconnect(context.TODO())
	defer tran.session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), tran.session, func(sessionContext mongo.SessionContext) error {
		if err = tran.session.StartTransaction(tran.txnOpts); err != nil {
			return err
		}
		_, err := tran.collection.DeleteMany(sessionContext, bson.M{"guid": newRequest.GUID})
		if err != nil {
			return err
		}
		if err = tran.session.CommitTransaction(sessionContext); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		if abortErr := tran.session.AbortTransaction(context.Background()); abortErr != nil {
			return err
		}
		return err
	}
	return nil
}

//help-functions to test functionality
func retrive(w *http.ResponseWriter, r *http.Request, app *App) error {
	users, err := mongocalls.RetriveAction(app.mongo.client)
	if err != nil {
		return fmt.Errorf("Retrive error: %v", err)
	}
	answer, err := json.Marshal(users)
	if err != nil {
		return fmt.Errorf("Marshaling response error: %v", err)
	}
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func deleteAll(w *http.ResponseWriter, r *http.Request, app *App) error {
	if err := mongocalls.DeleteAllAction(app.mongo.client); err != nil {
		return fmt.Errorf("Delete all error: %v", err)
	}
	answer, err := json.Marshal("ok")
	if err != nil {
		return fmt.Errorf("Marshaling response error: %v", err)
	}
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}
