package main

import (
	getbase "Solutions/pvpSimulator/bases"
	"Solutions/pvpSimulator/core/errors"
	sim "Solutions/pvpSimulator/core/sim"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/boltdb/bolt"
	"github.com/go-chi/chi"
	"github.com/prometheus/client_golang/prometheus"
)

type newsRequest struct {
	News rawNews
	Auth authForm
	ID   uint64
}

type rawNews struct {
	Title            string
	Date             string
	ShortDescription string
	Description      string
	ID               uint64
}

type baseRequest struct {
	Value map[string][]byte
	Auth  authForm
	Body  []byte
}

type authForm struct {
	Login    string
	Password string
}

func (dbs *database) suAuthorization(login, password string, app *App) error {
	if login == "" {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusBadRequest, "There must be login")
	}
	if password == "" {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusBadRequest, "There must be password")
	}

	pass := dbs.readBase("SUPERADMINS", login)
	if pass == nil {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusProxyAuthRequired, "Incorrect login")
	}
	if string(pass[:]) != password {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusBadRequest, "Incorrect password")
	}
	return nil
}

func newsAPIHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_count"}).Inc()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	var newsRequest newsRequest
	if err = json.Unmarshal(body, &newsRequest); err != nil {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while parsing request body")
	}

	if err = app.users.suAuthorization(newsRequest.Auth.Login, newsRequest.Auth.Password, app); err != nil {
		return err
	}

	action := chi.URLParam(r, "action")
	switch action {
	case "delete":
		err = app.newsDatabse.deleteNews(newsRequest.ID, []string{"NEWS_HEADERS", "NEWS"})
		if err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while deleting news page")
		}
	case "update":
		err = app.newsDatabse.updateNews(newsRequest.ID, newsRequest.News, []string{"NEWS_HEADERS", "NEWS"})
		if err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while putting news page")
		}
	}
	_, err = (*w).Write([]byte("Success"))
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func (dbs *database) deleteNews(newsKey uint64, bucketName []string) error {
	for _, value := range bucketName {
		err := dbs.value.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(value))
			return b.Delete(uintToByte(newsKey))
		})
		if err != nil {
			return err
		}
	}

	return nil
}

func (dbs *database) updateNews(newsKey uint64, news rawNews, bucketName []string) error {
	for _, value := range bucketName {
		err := dbs.value.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(value))
			page := news
			page.ID = newsKey
			switch value {
			case "NEWS_HEADERS":
				page.Description = ""
			case "NEWS":
				page.ShortDescription = ""
			}
			value, err := json.Marshal(page)
			if err != nil {
				return err
			}
			return b.Put(uintToByte(newsKey), value)
		})
		if err != nil {
			return err
		}
	}

	return nil
}

func logAPIHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	go app.metrics.apiCounters.With(prometheus.Labels{"type": "logAPI_count"}).Inc()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "logAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "logAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	var authForm newsRequest
	if err = json.Unmarshal(body, &authForm); err != nil {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "logAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while parsing request body")
	}

	if err = app.users.suAuthorization(authForm.Auth.Login, authForm.Auth.Password, app); err != nil {
		return err
	}

	action := chi.URLParam(r, "action")
	localLog := make([]byte, 0, 0)
	switch action {
	case "require":
		localLog, err = ioutil.ReadFile(path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "/logs/logs.log"))
		if err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading log")
		}
	}
	_, err = (*w).Write(localLog)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func dbUpdateAPIHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	go app.metrics.apiCounters.With(prometheus.Labels{"type": "dbupdateAPI_count"}).Inc()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "dbupdateAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "dbupdateAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	var authForm baseRequest
	if err = json.Unmarshal(body, &authForm); err != nil {
		go app.metrics.apiCounters.With(prometheus.Labels{"type": "dbupdateAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Error while parsing request body")
	}

	if err = app.users.suAuthorization(authForm.Auth.Login, authForm.Auth.Password, app); err != nil {
		return err
	}
	bucketKey := strings.ToUpper(chi.URLParam(r, "action"))

	switch bucketKey {
	case "POKEMONS":
		switch authForm.Body {
		//udate pokdb from request body or web
		case nil:
			if err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.UpdatePokemons); err != nil {
				return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
			}
		default:
			if err = app.semistaticDatabase.createNewEntry(bucketKey, "value", authForm.Body); err != nil {
				return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
			}
			if err = app.semistaticDatabase.updateBaseVersion(bucketKey); err != nil {
				return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket ver: "+bucketKey)
			}
		}
		//reinit db
		if err = app.semistaticDatabase.reinitDB("./semistatic.db", app.semistaticBuckets); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reinitializing db: ")
		}
	case "MOVES":
		//udate movedb from request body or web
		switch authForm.Body {
		case nil:
			if err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.UpdateMoves); err != nil {
				return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
			}
		default:
			if err = app.semistaticDatabase.createNewEntry(bucketKey, "value", authForm.Body); err != nil {
				return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
			}
			if err = app.semistaticDatabase.updateBaseVersion(bucketKey); err != nil {
				return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket ver: "+bucketKey)
			}
		}
		//reinit db
		err = app.semistaticDatabase.reinitDB("./semistatic.db", app.semistaticBuckets)
		if err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reinitializing db: ")
		}
	case "LEVELS":
		//udate levelsdb from request body
		if err = app.semistaticDatabase.createNewEntry(bucketKey, "value", authForm.Body); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
		}
		if err = app.semistaticDatabase.updateBaseVersion(bucketKey); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket ver: "+bucketKey)
		}
		//reinit db
		if err = app.semistaticDatabase.reinitDB("./semistatic.db", app.semistaticBuckets); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reinitializing db: ")
		}
	case "MULTIPLIERS":
		//udate multdb from request body
		if err = app.semistaticDatabase.createNewEntry(bucketKey, "value", authForm.Body); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
		}
		if err = app.semistaticDatabase.updateBaseVersion(bucketKey); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket ver: "+bucketKey)
		}
		//reinit db
		if err = app.semistaticDatabase.reinitDB("./semistatic.db", app.semistaticBuckets); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reinitializing db: ")
		}
	case "SHINY":
		//udate shiny db from web
		if err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.GetShinyBase); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
		}
	case "RAIDS":
		//udate raids db from web
		if err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.GetRaidsList); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
		}
		//udate eggs db from web
	case "EGGS":
		if err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.GetEggsList); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
		}
		//udate misc db from request body
	case "MISC":
		switch authForm.Body {
		case nil:
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey+" , nil body")
		default:
			if err = app.semistaticDatabase.createNewEntry(bucketKey, "value", authForm.Body); err != nil {
				return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket: "+bucketKey)
			}
			if err = app.semistaticDatabase.updateBaseVersion(bucketKey); err != nil {
				return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket ver: "+bucketKey)
			}
		}
		//udate rating db from request body
	case "RATING":
		for key, value := range authForm.Value {
			if err = app.semistaticDatabase.createNewEntry(bucketKey, key, value); err != nil {
				return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket and key: "+bucketKey+", "+key)
			}
		}
		if err = app.semistaticDatabase.updateBaseVersion(bucketKey); err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Error while updating bucket ver: "+bucketKey)
		}
	default:
		return errors.NewHTTPError(err, http.StatusRequestedRangeNotSatisfiable, "Unsupported method")
	}

	_, err = (*w).Write([]byte("Success"))
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func (dbs *database) reinitDB(dbPath string, buckets []string) error {
	dbs.Close()
	sim.InitApp()
	if err := dbs.createDatabase(dbPath, "BOLTDB", buckets); err != nil {
		return err
	}
	return nil
}
