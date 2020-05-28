package main

import (
	getbase "Solutions/pvpSimulator/bases"
	"Solutions/pvpSimulator/core/errors"
	pvpsim "Solutions/pvpSimulator/core/pvp"
	"encoding/json"
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
		app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, 400, "There must be login")
	}
	if password == "" {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, 400, "There must be password")
	}

	pass := dbs.readBase("SUPERADMINS", login)
	if pass == nil {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, 400, "Incorrect login")
	}
	if string(pass[:]) != password {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, 400, "Incorrect password")
	}
	return nil
}

func newsAPIHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_count"}).Inc()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, 405, "Method not allowed")
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Error while reading request body")
	}
	var newsRequest newsRequest
	err = json.Unmarshal(body, &newsRequest)
	if err != nil {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "newsAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Error while parsing request body")
	}

	err = app.users.suAuthorization(newsRequest.Auth.Login, newsRequest.Auth.Password, app)
	if err != nil {
		return err
	}

	action := chi.URLParam(r, "action")
	switch action {
	case "delete":
		err = app.newsDatabse.deleteNews(newsRequest.ID, []string{"NEWS_HEADERS", "NEWS"})
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while deleting news page")
		}
	case "update":
		err = app.newsDatabse.updateNews(newsRequest.ID, newsRequest.News, []string{"NEWS_HEADERS", "NEWS"})
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while putting news page")
		}
	}

	_, err = (*w).Write([]byte("success"))
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
	app.metrics.apiCounters.With(prometheus.Labels{"type": "logAPI_count"}).Inc()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "logAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, 405, "Method not allowed")
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "logAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Error while reading request body")
	}
	var authForm newsRequest
	err = json.Unmarshal(body, &authForm)
	if err != nil {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "logAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Error while parsing request body")
	}

	err = app.users.suAuthorization(authForm.Auth.Login, authForm.Auth.Password, app)
	if err != nil {
		return err
	}

	action := chi.URLParam(r, "action")
	localLog := make([]byte, 0, 0)
	switch action {
	case "require":
		localLog, err = ioutil.ReadFile(path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "/logs/logs.log"))
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while reading log")
		}
	}

	_, err = (*w).Write(localLog)
	return nil
}

func dbUpdateAPIHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	app.metrics.apiCounters.With(prometheus.Labels{"type": "dbupdateAPI_count"}).Inc()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "dbupdateAPI_error_count"}).Inc()
		return errors.NewHTTPError(nil, 405, "Method not allowed")
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "dbupdateAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Error while reading request body")
	}
	var authForm baseRequest
	err = json.Unmarshal(body, &authForm)
	if err != nil {
		app.metrics.apiCounters.With(prometheus.Labels{"type": "dbupdateAPI_error_count"}).Inc()
		return errors.NewHTTPError(err, 400, "Error while parsing request body")
	}

	err = app.users.suAuthorization(authForm.Auth.Login, authForm.Auth.Password, app)
	if err != nil {
		return err
	}
	bucketKey := strings.ToUpper(chi.URLParam(r, "action"))

	switch bucketKey {
	case "POKEMONS":
		switch authForm.Body {
		case nil:
			err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.UpdatePokemons)
			if err != nil {
				return errors.NewHTTPError(err, 400, "Error while updating bucket: "+bucketKey)
			}
		default:
			err = app.semistaticDatabase.createNewEntry(bucketKey, "value", authForm.Body)
			if err != nil {
				return errors.NewHTTPError(err, 400, "Error while updating bucket: "+bucketKey)
			}
			err = app.semistaticDatabase.updateBaseVersion(bucketKey)
			if err != nil {
				return errors.NewHTTPError(err, 400, "Error while updating bucket ver: "+bucketKey)
			}
		}
		err = app.semistaticDatabase.reinitDB("./semistatic.db", app.semistaticBuckets)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while reinitializing db: ")
		}
	case "MOVES":
		switch authForm.Body {
		case nil:
			err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.UpdateMoves)
			if err != nil {
				return errors.NewHTTPError(err, 400, "Error while updating bucket: "+bucketKey)
			}
		default:
			err = app.semistaticDatabase.createNewEntry(bucketKey, "value", authForm.Body)
			if err != nil {
				return errors.NewHTTPError(err, 400, "Error while updating bucket: "+bucketKey)
			}
			err = app.semistaticDatabase.updateBaseVersion(bucketKey)
			if err != nil {
				return errors.NewHTTPError(err, 400, "Error while updating bucket ver: "+bucketKey)
			}
		}
		err = app.semistaticDatabase.reinitDB("./semistatic.db", app.semistaticBuckets)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while reinitializing db: ")
		}
	case "LEVELS":
		err = app.semistaticDatabase.createNewEntry(bucketKey, "value", authForm.Body)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while updating bucket: "+bucketKey)
		}
		err = app.semistaticDatabase.updateBaseVersion(bucketKey)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while updating bucket ver: "+bucketKey)
		}
		err = app.semistaticDatabase.reinitDB("./semistatic.db", app.semistaticBuckets)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while reinitializing db: ")
		}
	case "MULTIPLIERS":
		err = app.semistaticDatabase.createNewEntry(bucketKey, "value", authForm.Body)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while updating bucket: "+bucketKey)
		}
		err = app.semistaticDatabase.updateBaseVersion(bucketKey)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while updating bucket ver: "+bucketKey)
		}
		err = app.semistaticDatabase.reinitDB("./semistatic.db", app.semistaticBuckets)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while reinitializing db: ")
		}
	case "SHINY":
		err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.GetShinyBase)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while updating bucket: "+bucketKey)
		}
	case "RAIDS":
		err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.GetRaidsList)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while updating bucket: "+bucketKey)
		}
	case "EGGS":
		err = app.semistaticDatabase.updateBase(bucketKey, "value", getbase.GetEggsList)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while updating bucket: "+bucketKey)
		}
	case "RATING":
		for key, value := range authForm.Value {
			err = app.semistaticDatabase.createNewEntry(bucketKey, key, value)
			if err != nil {
				return errors.NewHTTPError(err, 400, "Error while updating bucket and key: "+bucketKey+", "+key)
			}
		}
		err = app.semistaticDatabase.updateBaseVersion(bucketKey)
		if err != nil {
			return errors.NewHTTPError(err, 400, "Error while updating bucket ver: "+bucketKey)
		}

	default:
		return errors.NewHTTPError(err, 400, "Unsupported method")
	}

	_, err = (*w).Write([]byte("success"))
	return nil
}

func (dbs *database) reinitDB(dbPath string, buckets []string) error {
	dbs.Close()
	pvpsim.InitApp()
	err := dbs.createDatabase(dbPath, "BOLTDB", buckets)
	if err != nil {
		return err
	}
	return nil
}
