package main

import (
	"Solutions/pvpSimulator/core/errors"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/boltdb/bolt"
	"github.com/go-chi/chi"
	"github.com/prometheus/client_golang/prometheus"
	log "github.com/sirupsen/logrus"
)

func dbCallHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New db call from: " + r.Header.Get("User-Agent"))
	timer := prometheus.NewTimer(app.metrics.latency.WithLabelValues("base"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodGet {
		app.metrics.dbGaugeCount.With(prometheus.Labels{"type": "base_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	//Check visitor's requests limit
	if err := checkLimits(getIP(r), "limiterBase"); err != nil {
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
	case "MISC":
	default:
		return errors.NewHTTPError(nil, http.StatusBadRequest, "Unsupported db")
	}
	//check vase version; if not modified return 304 status
	ver := strconv.FormatUint(byteToUint(app.semistaticDatabase.readBase(bucketName, "version")), 10)
	if (*r).Header.Get("If-None-Match") == ver {
		(*w).WriteHeader(http.StatusNotModified)
		return nil
	}

	app.metrics.dbGaugeCount.With(prometheus.Labels{"type": strings.ToLower(bucketName)}).Inc()
	if value == "" {
		value = "value"
	}
	//return base
	base := app.semistaticDatabase.readBase(bucketName, value)
	if base == nil {
		app.metrics.dbGaugeCount.With(prometheus.Labels{"type": "base_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Base not exists")
	}
	//set up etag
	(*w).Header().Set("Etag", ver)
	(*w).Header().Set("Content-Type", "application/json")
	_, err := (*w).Write(base)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func newsHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	go log.WithFields(log.Fields{"location": r.RequestURI}).Println("New news call from: " + r.Header.Get("User-Agent"))
	app.metrics.dbGaugeCount.With(prometheus.Labels{"type": "news"}).Inc()
	timer := prometheus.NewTimer(app.metrics.latency.WithLabelValues("news"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodGet {
		app.metrics.dbGaugeCount.With(prometheus.Labels{"type": "news_base_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method not allowed")
	}
	//Check visitor's requests limit
	if err := checkLimits(getIP(r), "limiterBase"); err != nil {
		return err
	}
	var (
		bucketName string
		bucketKey  = chi.URLParam(r, "id")
	)

	lang := ""
	rCookie, _ := r.Cookie("appLang")
	if rCookie != nil && rCookie.Value == "ru" {
		lang = "RU_"
	}

	switch chi.URLParam(r, "type") {
	case "page":
		bucketName = lang + "NEWS_HEADERS"
	case "id":
		bucketName = lang + "NEWS"
	default:
		return errors.NewHTTPError(nil, http.StatusBadRequest, "Unsupported method")
	}

	newsHeadersBase, err := app.newsDatabse.readNews(bucketName, bucketKey)
	if err != nil {
		app.metrics.dbGaugeCount.With(prometheus.Labels{"type": "news_base_error_count"}).Inc()
		return err
	}
	answer, err := json.Marshal(newsHeadersBase)
	if err != nil {
		app.metrics.dbGaugeCount.With(prometheus.Labels{"type": "news_base_error_count"}).Inc()
		return fmt.Errorf("Marshal error: %v", err)
	}

	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

//reads news from the base
func (dbs *database) readNews(bucket, page string) ([]string, error) {
	var answer []string
	err := dbs.value.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		c := b.Cursor()

		k, v := c.Last()
		//if there is no news, return "no"
		if v == nil {
			answer = append(answer, "no")
			return nil
		}

		lastKey := int64(binary.BigEndian.Uint64(k))
		requstedKey, err := strconv.ParseUint(page, 10, 64)
		//check key format
		if err != nil {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Wrong key number fromat")
		}
		if int64(requstedKey) <= 0 {
			return errors.NewHTTPError(err, http.StatusBadRequest, "Key cannot be negative")
		}
		//process news request
		if bucket == "NEWS" || bucket == "RU_NEWS" {
			if int64(requstedKey) > lastKey {
				return errors.NewHTTPError(err, http.StatusNotFound, "News not found")
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
