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

	users "Solutions/pvpSimulator/core/users"
	userauth "Solutions/pvpSimulator/core/users/userAuth"

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

type authResp struct {
	Expires  int64
	Username string
}

func register(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New reg request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodPost {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reg_error"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterUserProfile"); err != nil {
		return err
	}
	form := new(users.SubmitForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reg_error"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyRegForm(ip); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reg_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Registration form err"), http.StatusBadRequest, err.Error())
	}
	form.Encode(false)
	if err := userauth.CheckUserExistance(app.mongo.client, form); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reg_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Registration data err"), http.StatusConflict, err.Error())
	}
	id, err := userauth.Signup(app.mongo.client, form)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reg_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Registration err"), http.StatusInternalServerError, err.Error())
	}
	browser, os := browserAndOs(r.Header.Get("User-Agent"))
	tokens, err := userauth.NewSession(app.mongo.client, users.Session{
		Browser: browser,
		Os:      os,
		IP:      ip,
	}, id)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reg_error"}).Inc()
		log.WithFields(log.Fields{"location": r.RequestURI}).Errorf("Token creation failed")
		tokens = &users.Tokens{}
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("New user: %v has just registered", tokens.UserID)
	go app.metrics.userCount.With(prometheus.Labels{"type": "new_users"}).Inc()
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reg"}).Inc()

	setCookie(w, tokens)
	if err = respond(w, authResp{Expires: tokens.AToken.Expires, Username: form.Username}); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reg_error"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func setCookie(w *http.ResponseWriter, tokens *users.Tokens) {
	//set refresh token
	reExpiresIn := int(tokens.RToken.Expires - time.Now().Unix())
	rCookie := http.Cookie{Name: "__rjwt", Value: tokens.RToken.Token, Domain: os.Getenv("COOKIE_DOMAIN"),
		Path: "/api/auth", MaxAge: reExpiresIn, HttpOnly: true, SameSite: http.SameSiteStrictMode}
	http.SetCookie(*w, &rCookie)

	//set access token
	acExpiresIn := int(tokens.AToken.Expires - time.Now().Unix())
	aCookie := http.Cookie{Name: "__ajwt", Value: tokens.AToken.Token, Domain: os.Getenv("COOKIE_DOMAIN"),
		Path: "/", MaxAge: acExpiresIn, HttpOnly: true, SameSite: http.SameSiteStrictMode}
	http.SetCookie(*w, &aCookie)

	http.SetCookie(*w, &http.Cookie{Name: "uid", Value: tokens.UserID, Domain: os.Getenv("COOKIE_DOMAIN"), Path: "/", MaxAge: reExpiresIn, SameSite: http.SameSiteStrictMode})
	http.SetCookie(*w, &http.Cookie{Name: "sid", Value: tokens.SessionID, Domain: os.Getenv("COOKIE_DOMAIN"), Path: "/", MaxAge: acExpiresIn, SameSite: http.SameSiteStrictMode})
}

func discardCookie(w *http.ResponseWriter) {
	reCookie := http.Cookie{Name: "__rjwt", Value: "", Domain: os.Getenv("COOKIE_DOMAIN"), Path: "/api/auth", MaxAge: -1, HttpOnly: true, SameSite: http.SameSiteStrictMode}
	http.SetCookie(*w, &reCookie)

	acCookie := http.Cookie{Name: "__ajwt", Value: "", Domain: os.Getenv("COOKIE_DOMAIN"), Path: "/", MaxAge: -1, SameSite: http.SameSiteStrictMode}
	http.SetCookie(*w, &acCookie)

	http.SetCookie(*w, &http.Cookie{Name: "uid", Value: "", Domain: os.Getenv("COOKIE_DOMAIN"), Path: "/", MaxAge: -1, SameSite: http.SameSiteStrictMode})
	http.SetCookie(*w, &http.Cookie{Name: "sid", Value: "", Domain: os.Getenv("COOKIE_DOMAIN"), Path: "/", MaxAge: -1, SameSite: http.SameSiteStrictMode})
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
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New reset request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodPost {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reset_error"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterUserProfile"); err != nil {
		return err
	}
	form := new(users.SubmitForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reset_error"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyResetForm(ip); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reset_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Reset pasword form err"), http.StatusBadRequest, err.Error())

	}
	info, err := userauth.ResetPass(app.mongo.client, form)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reset_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Reset pasword err"), http.StatusBadRequest, err.Error())
	}

	if err := SendResetEmail(info); err != nil {
		log.WithFields(log.Fields{"location": r.RequestURI}).Printf("Send email error %v", err)
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reset_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Reset pasword err"), http.StatusBadRequest, "Error while sending email")
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User with email %v has just requested password reset %v", info.Email, info.RestoreKey)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reset"}).Inc()

	if err := respond(w, "ok"); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "reset_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

//SendResetEmail sends email to a user
func SendResetEmail(info *userauth.ResetInfo) error {
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
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New restore request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodGet {
		app.metrics.appGaugeCount.With(prometheus.Labels{"type": "restore_error"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterUserProfile"); err != nil {
		return err
	}
	restoreKey := chi.URLParam(r, "id")

	username, err := userauth.ConfirmRestorePass(app.mongo.client, restoreKey)
	if err != nil {
		log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User %v got an error while resetting their password %v", username, err)
		go app.metrics.appGaugeCount.With(prometheus.Labels{"type": "restore_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Reset pasword err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User %v has just reseted their password", username)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "restore"}).Inc()

	if err := respond(w, "ok"); err != nil {
		go app.metrics.appGaugeCount.With(prometheus.Labels{"type": "restore_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func login(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New login request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodPost {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "login_error"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterUserProfile"); err != nil {
		return err
	}
	form := new(users.SubmitForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "login_error"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyLogForm(ip); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "login_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Login form err"), http.StatusBadRequest, err.Error())
	}
	form.Encode(false)
	browser, os := browserAndOs(r.Header.Get("User-Agent"))
	tokens, err := userauth.Signin(app.mongo.client, form, users.Session{
		Browser: browser,
		Os:      os,
		IP:      ip,
	})
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "login_error"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Login error"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has logged in", tokens.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "login"}).Inc()

	setCookie(w, tokens)
	if err = respond(w, authResp{Expires: tokens.AToken.Expires, Username: form.Username}); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "login_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func refresh(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New refresh request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodGet {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "refresh_error"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterUserProfile"); err != nil {
		return err
	}
	rCookie, err := r.Cookie("__rjwt")
	if err != nil {
		return errors.NewHTTPError(nil, http.StatusUnauthorized, "No session")
	}
	browser, os := browserAndOs(r.Header.Get("User-Agent"))
	tokens, uname, err := userauth.Refresh(app.mongo.client, users.Session{
		Browser: browser,
		Os:      os,
		IP:      ip,
	}, rCookie)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "refresh_error"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Refresh error"), http.StatusBadRequest, err.Error())
	}

	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just refreshed their token", tokens.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "refresh"}).Inc()

	setCookie(w, tokens)
	if err = respond(w, authResp{Expires: tokens.AToken.Expires, Username: uname}); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "refresh_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func logout(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New logout request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodGet {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "logout_error"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterUserProfile"); err != nil {
		return err
	}
	accSession, err := newAccessSession(r)
	if err != nil {
		discardCookie(w)
		return err
	}
	if err = userauth.Logout(app.mongo.client, accSession); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "logout_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Refresh error"), http.StatusBadRequest, err.Error())
	}

	discardCookie(w)

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just just logged out", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "logout"}).Inc()

	if err = respond(w, "Ok"); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "logout_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func logoutAll(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New logout all request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodGet {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "logout_all_error"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterUserProfile"); err != nil {
		return err
	}
	accSession, err := newAccessSession(r)
	if err != nil {
		discardCookie(w)
		return err
	}
	if err = userauth.LogoutAll(app.mongo.client, accSession); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "logout_all_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Refresh error"), http.StatusBadRequest, err.Error())
	}

	discardCookie(w)
	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just ended all their sessions", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "logout_all"}).Inc()

	if err = respond(w, "Logged out"); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "logout_all_error"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}
