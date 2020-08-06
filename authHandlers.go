package main

import (
	"Solutions/pvpSimulator/core/errors"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"time"

	appl "Solutions/pvpSimulator/core/sim/app"
	users "Solutions/pvpSimulator/core/users"
	mongocalls "Solutions/pvpSimulator/core/users/mongocalls"

	"github.com/go-chi/chi"
	"github.com/mssola/user_agent"
	log "github.com/sirupsen/logrus"

	"net/http"
	"net/smtp"
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
	form := new(users.SubmitForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyRegForm(ip); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reg_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Registration form err"), http.StatusBadRequest, err.Error())
	}
	form.Encode(false)
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
		log.WithFields(log.Fields{"location": r.RequestURI}).Errorf("Token creation failed")
		tokens = &mongocalls.Tokens{}
	}

	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("New user: %v has just registered", form.Username)
	app.metrics.userCounters.With(prometheus.Labels{"type": "new_users"}).Inc()

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
	cookie := http.Cookie{Name: "refToken", Value: tokens.RToken.Token, Domain: os.Getenv("COOKIE_DOMAIN"),
		Path: "/api/auth", MaxAge: expiresIn, HttpOnly: true, SameSite: http.SameSiteStrictMode}
	http.SetCookie(*w, &cookie)
	http.SetCookie(*w, &http.Cookie{Name: "appS", Value: "true", Domain: os.Getenv("COOKIE_DOMAIN"), Path: "/", MaxAge: expiresIn})
}

func discardCookie(w *http.ResponseWriter) {
	cookie := http.Cookie{Name: "refToken", Value: "", Domain: os.Getenv("COOKIE_DOMAIN"),
		Path: "/api/auth", MaxAge: -1, HttpOnly: true, SameSite: http.SameSiteStrictMode}
	http.SetCookie(*w, &cookie)
	http.SetCookie(*w, &http.Cookie{Name: "appS", Value: "false", Domain: os.Getenv("COOKIE_DOMAIN"), Path: "/", MaxAge: -1})
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

func reset(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodPost {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "reset_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	form := new(users.SubmitForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reset_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyResetForm(ip); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reset_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Reset pasword form err"), http.StatusBadRequest, err.Error())

	}
	info, err := mongocalls.ResetPass(app.mongo.client, form)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reset_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Reset pasword err"), http.StatusBadRequest, err.Error())
	}

	if err := SendResetEmail(info); err != nil {
		log.WithFields(log.Fields{"location": r.RequestURI}).Printf("Send email error %v", err)
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reset_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Reset pasword err"), http.StatusBadRequest, "Error while sending email")
	}

	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User has just requested password reset %key", info.RestoreKey)

	if err := respond(w, "ok"); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "reset_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

//SendResetEmail sends email to a user
func SendResetEmail(info *mongocalls.ResetInfo) error {
	const (
		source = "pogpvpsupp@gmail.com"
		adr    = "smtp.gmail.com:587"
		host   = "smtp.gmail.com"

		from = "From: pogpvpsupp@gmail.com\n"
		mime = "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
		subj = "Subject: Reset your password\n"
	)
	to := "To: " + source + "\n"

	info.RestoreKey = "pogpvp.com/restore/confirm/" + info.RestoreKey
	body, err := parseTemplate("./templates/message_en.html", info)
	if err != nil {
		return err
	}

	msg := []byte(from + to + subj + mime + body)
	if err := smtp.SendMail(adr, smtp.PlainAuth("", source, os.Getenv("GMAIL_PASS"), host), source, []string{info.Email}, msg); err != nil {
		return err
	}
	return nil
}

func parseTemplate(templateFileName string, data interface{}) (string, error) {
	templ, err := template.ParseFiles(templateFileName)
	if err != nil {
		return "", err
	}
	buf := new(bytes.Buffer)
	if err = templ.Execute(buf, data); err != nil {
		return "", err
	}
	return buf.String(), nil
}

func restoreConfirm(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodGet {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "restore_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	idKey := chi.URLParam(r, "id")

	username, err := mongocalls.ConfirmRestorePass(app.mongo.client, idKey)
	if err != nil {
		log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User %v got an error while resetting their password %v", username, err)
		go app.metrics.appCounters.With(prometheus.Labels{"type": "restore_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Reset pasword err"), http.StatusBadRequest, err.Error())
	}

	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User %v has just reseted their password", username)

	if err := respond(w, "ok"); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "restore_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func login(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodPost {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "restore_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	form := new(users.SubmitForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyLogForm(ip); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "login_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Login form err"), http.StatusBadRequest, err.Error())
	}
	form.Encode(false)
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

	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has logged in", form.Username)

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
	form := new(users.SubmitForm)
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
	form.Encode(true)
	uname, err := mongocalls.ChPass(app.mongo.client, form, cookie)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Login error"), http.StatusBadRequest, err.Error())
	}

	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just chached their password", uname)

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

	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just refreshed their token", uname)

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

	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just just logged out", uname)

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
	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just ended all their sessions", uname)

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

func getUserMoves(w *http.ResponseWriter, r *http.Request, app *App) error {
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
	/*	sessions, err := mongocalls.GetUserSessions(app.mongo.client, req)
		if err != nil {
			go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
			discardCookie(w)
			return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
		}*/

	pbj := appl.MoveBaseEntry{
		Stat:               []string{},
		Subject:            "",
		Title:              "Tackle",
		MoveCategory:       "Fast Move",
		MoveType:           12,
		PvpDamage:          3,
		Probability:        0,
		Cooldown:           500,
		DamageWindow:       300,
		DodgeWindow:        200,
		PvpDurationSeconds: 0.5,
		Damage:             5,
		PvpEnergy:          2,
		Energy:             5,
		StageDelta:         0,
		PvpDuration:        0,
	}
	/*obj := {
		"Stat": [
		 ""
		],
		"Subject": "",
		"Title": "Tackle",
		"MoveCategory": "Fast Move",
		"MoveType": 12,
		"PvpDamage": 3,
		"Probability": 0,
		"Cooldown": 500,
		"DamageWindow": 300,
		"DodgeWindow": 200,
		"PvpDurationSeconds": 0.5,
		"Damage": 5,
		"PvpEnergy": 2,
		"Energy": 5,
		"StageDelta": 0,
		"PvpDuration": 0
	   }*/

	if err := respond(w, map[string]appl.MoveBaseEntry{"Tackle": pbj}); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

type Request struct {
	AccessToken string
	Moves       map[string]appl.MoveBaseEntry
}

func setUserMoves(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodPost {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	req := new(Request)
	if err := parseBody(r, &req); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}

	fmt.Println(req.Moves)

	if err := respond(w, "Ok"); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}
