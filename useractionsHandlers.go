package main

import (
	"Solutions/pvpSimulator/core/errors"
	"fmt"

	users "Solutions/pvpSimulator/core/users"
	useractions "Solutions/pvpSimulator/core/users/userActions"

	log "github.com/sirupsen/logrus"

	"net/http"

	"github.com/prometheus/client_golang/prometheus"
)

func newAccessSession(r *http.Request) (*users.AccessSession, error) {
	acc := new(users.AccessSession)
	aCookie, err := r.Cookie("__ajwt")
	if err != nil {
		return nil, errors.NewHTTPError(nil, http.StatusUnauthorized, "No session")
	}
	acc.AccessToken = aCookie.Value

	uidCookie, err := r.Cookie("uid")
	if err != nil {
		return nil, errors.NewHTTPError(nil, http.StatusUnauthorized, "No session")
	}
	acc.UserID = uidCookie.Value

	sidCookie, err := r.Cookie("sid")
	if err != nil {
		return nil, errors.NewHTTPError(nil, http.StatusUnauthorized, "No session")
	}
	acc.SessionID = sidCookie.Value

	return acc, nil
}

func changePassword(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New change pass request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodPost {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterUserProfile"); err != nil {
		return err
	}
	form := new(users.SubmitForm)
	if err := parseBody(r, &form); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	if err := form.VerifyChPassForm(); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Change password form err"), http.StatusBadRequest, err.Error())
	}
	accSession, err := newAccessSession(r)
	if err != nil {
		discardCookie(w)
		return err
	}
	form.Encode(true)
	if err := useractions.ChPass(app.mongo.client, form, accSession); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Login error"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just changed their password", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "chpass_count"}).Inc()

	if err = respond(w, "Ok"); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func getUserInfo(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New get user info request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodGet {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "uinfo_error_count"}).Inc()
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
	info, err := useractions.GetUserInfo(app.mongo.client, accSession)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "uinfo_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just got their info", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "uinfo_count"}).Inc()

	if err = respond(w, *info); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "uinfo_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func getUserUsessions(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New get user sessions request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodGet {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
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
	sessions, err := useractions.GetUserSessions(app.mongo.client, accSession)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just got their sessions", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "usess_count"}).Inc()

	if err = respond(w, *sessions); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func getUserMoves(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New get user moves request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodGet {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_umoves_error_count"}).Inc()
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
	moves, err := useractions.GetUserMoves(app.mongo.client, accSession)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_umoves_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just got their moves", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_umoves_count"}).Inc()

	if err := respond(w, *moves); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_umoves_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func setUserMoves(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New set user moves request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodPost {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_umoves_error_count"}).Inc()
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

	req := new(users.SetMovesRequest)
	if err := parseBody(r, &req); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_umoves_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}

	if err = useractions.SetUserMoves(app.mongo.client, req, accSession); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_umoves_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just set their moves", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_umoves_count"}).Inc()

	if err := respond(w, "Ok"); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_umoves_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func setUserBroker(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New set user broker request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodPost {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_ubroker_error_count"}).Inc()
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

	req := new(users.SetBrokerRequest)
	if err := parseBody(r, &req); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_ubroker_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}

	//limit map length
	req.Limit()

	if err = useractions.SetUserBroker(app.mongo.client, req, accSession); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_ubroker_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just set their broker", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_ubroker_count"}).Inc()

	if err := respond(w, "Ok"); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_ubroker_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func getUserBroker(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New get user broker request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodGet {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ubroker_error_count"}).Inc()
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
	broker, err := useractions.GetSelfBroker(app.mongo.client, accSession)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ubroker_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just got their broker", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ubroker_count"}).Inc()

	if err := respond(w, *broker); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ubroker_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func getFilteredBrokers(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New get filtered brokers request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodPost {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ufilteredbroker_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterUserProfile"); err != nil {
		return err
	}
	req := new(users.FilteredBrokerRequest)
	if err := parseBody(r, &req); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ufilteredbroker_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}

	if req.HaveCustom || req.WantCustom {
		if err := setCustomBroker(w, r, app, req); err != nil {
			go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ubroker_error_count"}).Inc()
			discardCookie(w)
			return err
		}
	}
	//limit req length
	req.Limit()

	query, err := req.MakeSearchPipline()
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ufilteredbroker_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Query error"), http.StatusBadRequest, err.Error())
	}

	brokers, err := useractions.GetFilteredBrokers(app.mongo.client, query)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ufilteredbroker_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("Broker filtering suceed")
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ufilteredbroker_count"}).Inc()

	if err := respond(w, *brokers); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_ufilteredbroker_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func setCustomBroker(w *http.ResponseWriter, r *http.Request, app *App, req *users.FilteredBrokerRequest) error {
	accSession, err := newAccessSession(r)
	if err != nil {
		return err
	}
	broker, err := useractions.GetSelfBroker(app.mongo.client, accSession)
	if err != nil {
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}
	if req.HaveCustom {
		req.Have = broker.Have
	}
	if req.WantCustom {
		req.Want = broker.Want
	}
	return nil
}

func getUserCollection(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New get user pokemon request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodGet {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_upok_error_count"}).Inc()
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
	pokemon, err := useractions.GetUserCollection(app.mongo.client, accSession)
	if err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_upok_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just got their pokemon", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_upok_count"}).Inc()

	if err := respond(w, *pokemon); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "get_upok_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func setUserCollection(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New set user pokemon request from: " + r.Header.Get("User-Agent"))
	if r.Method != http.MethodPost {
		app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_upok_error_count"}).Inc()
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

	req := new(users.UserPokemonList)
	if err := parseBody(r, &req); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_upok_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}

	if err = useractions.SetUserCollection(app.mongo.client, req, accSession); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_upok_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	go log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just set their pokemon", accSession.UserID)
	go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_upok_count"}).Inc()

	if err := respond(w, "Ok"); err != nil {
		go app.metrics.userGaugeCount.With(prometheus.Labels{"type": "set_upok_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}
