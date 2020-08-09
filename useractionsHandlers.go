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
	accSession, err := newAccessSession(r)
	if err != nil {
		discardCookie(w)
		return err
	}
	form.Encode(true)
	if err := useractions.ChPass(app.mongo.client, form, accSession); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Login error"), http.StatusBadRequest, err.Error())
	}

	log.WithFields(log.Fields{"location": r.RequestURI}).Printf("User: %v has just chached their password", accSession.UserID)

	if err = respond(w, "Ok"); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "chpass_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}

func getUserInfo(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodGet {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "unfo_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	accSession, err := newAccessSession(r)
	if err != nil {
		discardCookie(w)
		return err
	}
	info, err := useractions.GetUserInfo(app.mongo.client, accSession)
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

func getUserUsessions(w *http.ResponseWriter, r *http.Request, app *App) error {
	if r.Method != http.MethodGet {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	accSession, err := newAccessSession(r)
	if err != nil {
		discardCookie(w)
		return err
	}
	sessions, err := useractions.GetUserSessions(app.mongo.client, accSession)
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
	if r.Method != http.MethodGet {
		app.metrics.dbCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	ip := getIP(r)
	if err := checkLimits(ip, "limiterBase", app.metrics.ipLocations); err != nil {
		return err
	}
	accSession, err := newAccessSession(r)
	if err != nil {
		discardCookie(w)
		return err
	}
	moves, err := useractions.GetUserMoves(app.mongo.client, accSession)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	if err := respond(w, *moves); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
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
	req := new(users.SetMovesRequest)
	if err := parseBody(r, &req); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	accSession, err := newAccessSession(r)
	if err != nil {
		discardCookie(w)
		return err
	}
	if err = useractions.SetUserMoves(app.mongo.client, req, accSession); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		discardCookie(w)
		return errors.NewHTTPError(fmt.Errorf("Auth err"), http.StatusBadRequest, err.Error())
	}

	if err := respond(w, "Ok"); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "usess_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("Write response error"), http.StatusInternalServerError, err.Error())
	}
	return nil
}
