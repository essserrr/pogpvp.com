package main

import (
	"Solutions/pvpSimulator/core/errors"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"time"

	users "Solutions/pvpSimulator/core/users"
	mongocalls "Solutions/pvpSimulator/core/users/mongocalls"

	"github.com/mssola/user_agent"
	log "github.com/sirupsen/logrus"

	"net/http"
	"os"

	"github.com/prometheus/client_golang/prometheus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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
		return errors.NewHTTPError(fmt.Errorf("Registration data err"), http.StatusConflict, err.Error())
	}
	id, err := mongocalls.Signup(app.mongo.client, form)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Registration err"), http.StatusInternalServerError, err.Error())
	}
	browser, os := browserAndOs(r.Header.Get("User-Agent"))
	tokens, err := mongocalls.NewSession(app.mongo.client, mongocalls.Session{
		Browser: browser,
		Os:      os,
		IP:      ip,
	}, id)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		log.WithFields(log.Fields{"location": app.metrics.ipLocations}).Errorf("Token creation failed")
		tokens = &mongocalls.Tokens{}
	}
	fmt.Println("New user has just registered " + form.Username)

	setCookie(w, tokens)
	if err = respond(w, authResp{Token: tokens.AToken.Token, Expires: tokens.AToken.Expires, Username: form.Username}); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func setCookie(w *http.ResponseWriter, tokens *mongocalls.Tokens) {
	expiresIn := int(tokens.RToken.Expires - time.Now().Unix())
	cookie := http.Cookie{Name: "refToken", Value: tokens.RToken.Token, Domain: "localhost",
		Path: "/api/auth", MaxAge: expiresIn, HttpOnly: true, SameSite: http.SameSiteStrictMode}
	http.SetCookie(*w, &cookie)
	http.SetCookie(*w, &http.Cookie{Name: "appS", Value: "true", Domain: "localhost", Path: "/", MaxAge: expiresIn})
}

func discardCookie(w *http.ResponseWriter) {
	cookie := http.Cookie{Name: "refToken", Value: "", Domain: "localhost",
		Path: "/api/auth", MaxAge: -1, HttpOnly: true, SameSite: http.SameSiteStrictMode}
	http.SetCookie(*w, &cookie)
	http.SetCookie(*w, &http.Cookie{Name: "appS", Value: "false", Domain: "localhost", Path: "/", MaxAge: -1})
}

type authResp struct {
	Token    string
	Expires  int64
	Username string
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

func login(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodPost {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	form := new(users.RegForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyLogForm(ip); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Login form err"), http.StatusBadRequest, err.Error())
	}
	form.Encode()
	browser, os := browserAndOs(r.Header.Get("User-Agent"))
	tokens, err := mongocalls.Signin(app.mongo.client, form, mongocalls.Session{
		Browser: browser,
		Os:      os,
		IP:      ip,
	})
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Login error"), http.StatusBadRequest, err.Error())
	}
	fmt.Println("New user has just logged in " + form.Username)

	setCookie(w, tokens)
	if err = respond(w, authResp{Token: tokens.AToken.Token, Expires: tokens.AToken.Expires, Username: form.Username}); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func changePassword(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodPost {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	form := new(users.ChPassForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyChPassForm(); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Change password form err"), http.StatusBadRequest, err.Error())
	}
	cookie, err := r.Cookie("refToken")
	if err != nil {
		return errors.NewHTTPError(nil, http.StatusUnauthorized, "No session")
	}
	form.Encode()
	uname, err := mongocalls.ChPass(app.mongo.client, form, cookie)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Login error"), http.StatusBadRequest, err.Error())
	}
	fmt.Println("New user has just chached their password " + uname)

	if err = respond(w, "Ok"); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func refresh(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodGet {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "refresh_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	cookie, err := r.Cookie("refToken")
	if err != nil {
		return errors.NewHTTPError(nil, http.StatusUnauthorized, "No session")
	}
	browser, os := browserAndOs(r.Header.Get("User-Agent"))
	tokens, uname, err := mongocalls.Refresh(app.mongo.client, mongocalls.Session{
		Browser: browser,
		Os:      os,
		IP:      ip,
	}, cookie)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "refresh_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Refresh error"), http.StatusBadRequest, err.Error())
	}

	fmt.Println("User has just refreshed their token " + uname)

	setCookie(w, tokens)
	if err = respond(w, authResp{Token: tokens.AToken.Token, Expires: tokens.AToken.Expires, Username: uname}); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "refresh_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func logout(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodGet {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	cookie, err := r.Cookie("refToken")
	if err != nil {
		return errors.NewHTTPError(nil, http.StatusUnauthorized, "No session")
	}
	uname, err := mongocalls.Logout(app.mongo.client, cookie)
	discardCookie(w)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Refresh error"), http.StatusBadRequest, err.Error())
	}

	fmt.Println("User has just logged out " + uname)

	if err = respond(w, "Logged out"); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func logoutAll(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodGet {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	cookie, err := r.Cookie("refToken")
	if err != nil {
		return errors.NewHTTPError(nil, http.StatusUnauthorized, "No session")
	}
	uname, err := mongocalls.LogoutAll(app.mongo.client, cookie)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Refresh error"), http.StatusBadRequest, err.Error())
	}
	discardCookie(w)
	fmt.Println("User has just ended all their sessions " + uname)

	if err = respond(w, "Logged out"); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "logout_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func fetchUinfo(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodPost {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "unfo_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	req := new(users.Request)
	if err := parseBody(r, &req); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "unfo_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	info, err := mongocalls.GetUserInfo(app.mongo.client, req)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "unfo_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}
	if err = respond(w, *info); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "unfo_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func fetchUsessions(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodPost {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	req := new(users.Request)
	if err := parseBody(r, &req); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	sessions, err := mongocalls.GetUserSessions(app.mongo.client, req)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}
	if err = respond(w, *sessions); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
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
