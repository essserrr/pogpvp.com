package main

import (
	"Solutions/pvpSimulator/core/errors"
	"Solutions/pvpSimulator/core/parser"
	sim "Solutions/pvpSimulator/core/sim"
	appl "Solutions/pvpSimulator/core/sim/app"
	useractions "Solutions/pvpSimulator/core/users/userActions"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/boltdb/bolt"
	"github.com/go-chi/chi"
	"github.com/prometheus/client_golang/prometheus"
	log "github.com/sirupsen/logrus"
)

func pvpHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("pvp"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodGet {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method is not allowed")
	}
	//Check visitor's requests limit
	if err := checkLimits(getIP(r), "limiterPvp"); err != nil {
		return err
	}
	go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_count"}).Inc()

	//Parse request
	attacker, defender, err := parser.ParsePvpRequest(chi.URLParam(r, "pok1"), chi.URLParam(r, "pok2"))
	if err != nil {
		return err
	}

	pvpReq := singlePvpReq{
		answer:      []byte{},
		attacker:    attacker,
		defender:    defender,
		isPvpoke:    r.Header.Get("Pvp-Type"),
		pvpBaseKey:  chi.URLParam(r, "pok1") + chi.URLParam(r, "pok2"),
		constr:      appl.Constructor{},
		customMoves: getUserMovelist(w, r, app),
	}

	//if we have pvp in the base, there is no need to create it again
	switch pvpReq.isPvpoke {
	case "pvpoke":
		pvpReq.answer = app.pvpDatabase.readBase("PVPRESULTS", pvpReq.pvpBaseKey+"pvpoke")
		log.WithFields(log.Fields{"location": r.RequestURI}).Println("Pvpoke enabled")
	default:
		pvpReq.answer = app.pvpDatabase.readBase("PVPRESULTS", pvpReq.pvpBaseKey)
	}

	switch pvpReq.answer {
	case nil:
		if err := pvpReq.singlePvpWrap(app, r); err != nil {
			return err
		}
	default:
		log.WithFields(log.Fields{"location": r.RequestURI}).Println("Got from pvp base")
	}

	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(pvpReq.answer)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

type singlePvpReq struct {
	attacker    appl.InitialData
	defender    appl.InitialData
	constr      appl.Constructor
	customMoves *map[string]appl.MoveBaseEntry

	answer     []byte
	isPvpoke   string
	pvpBaseKey string
}

func (spr *singlePvpReq) singlePvpWrap(app *App, r *http.Request) error {
	//Start new PvP
	var (
		pvpResult appl.PvpResults
		err       error
	)
	switch spr.isPvpoke {
	case "pvpoke":
		pvpResult, err = sim.NewPvpBetweenPvpoke(appl.SinglePvpInitialData{
			AttackerData: spr.attacker,
			DefenderData: spr.defender,
			Constr:       spr.constr,
			CustomMoves:  spr.customMoves,
			Logging:      true})
	default:
		pvpResult, err = sim.NewPvpBetween(appl.SinglePvpInitialData{
			AttackerData: spr.attacker,
			DefenderData: spr.defender,
			Constr:       spr.constr,
			CustomMoves:  spr.customMoves,
			Logging:      true})
	}

	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("PvP error"), http.StatusBadRequest, err.Error())
	}
	log.WithFields(log.Fields{"location": r.RequestURI}).Println("Calculated")
	//Create json answer from pvpResult
	spr.answer, err = json.Marshal(pvpResult)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
		return fmt.Errorf("PvP result marshal error: %v", err)
	}
	if !pvpResult.IsRandom {
		switch spr.isPvpoke {
		case "pvpoke":
			go app.writePvp(spr.answer, spr.pvpBaseKey+"pvpoke")
		default:
			go app.writePvp(spr.answer, spr.pvpBaseKey)
		}
	}
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
		return err
	}
	return nil
}

func getUserMovelist(w *http.ResponseWriter, r *http.Request, app *App) *map[string]appl.MoveBaseEntry {
	accSession, err := newAccessSession(r)
	if err != nil {
		emptyMap := make(map[string]appl.MoveBaseEntry)
		return &emptyMap
	}
	moves, err := useractions.GetUserMoves(app.mongo.client, accSession)
	if err != nil {
		emptyMap := make(map[string]appl.MoveBaseEntry)
		return &emptyMap
	}
	switch moves {
	case nil:
		emptyMap := make(map[string]appl.MoveBaseEntry)
		return &emptyMap
	default:
		return moves
	}
}

func (a *App) writePvp(battleRes []byte, key string) {
	//put it into the base
	err := a.pvpDatabase.createNewEntry("PVPRESULTS", key, battleRes)
	if err != nil {
		a.metrics.appCounters.With(prometheus.Labels{"type": "pvp_error_count"}).Inc()
		log.WithFields(log.Fields{"location": "writePvp"}).Error(err)
		return
	}
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

func constructorPvpHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("constructor_pvp"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method is not allowed")
	}

	//Check visitor's requests limit
	if err := checkLimits(getIP(r), "limiterPvp"); err != nil {
		return err
	}
	go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp"}).Inc()

	//Read request body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("PvP error"), http.StatusBadRequest, err.Error())
	}

	pvpReq := singlePvpReq{isPvpoke: r.Header.Get("Pvp-Type")}

	//Parse request
	pvpReq.attacker, pvpReq.defender, pvpReq.constr, err = parser.ParseConstructorRequest(body)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return err
	}

	//Start new PvP
	var pvpResult appl.PvpResults
	switch pvpReq.isPvpoke {
	case "pvpoke":
		log.WithFields(log.Fields{"location": r.RequestURI}).Println("Pvpoke enabled")
		pvpResult, err = sim.NewPvpBetweenPvpoke(appl.SinglePvpInitialData{
			AttackerData: pvpReq.attacker,
			DefenderData: pvpReq.defender,
			Constr:       pvpReq.constr,
			CustomMoves:  getUserMovelist(w, r, app),
			Logging:      true,
		})
	default:
		pvpResult, err = sim.NewPvpBetween(appl.SinglePvpInitialData{
			AttackerData: pvpReq.attacker,
			DefenderData: pvpReq.defender,
			Constr:       pvpReq.constr,
			CustomMoves:  getUserMovelist(w, r, app),
			Logging:      true,
		})
	}

	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("PvP error"), http.StatusBadRequest, err.Error())
	}
	log.WithFields(log.Fields{"location": r.RequestURI}).Println("Calculated")
	//Create json answer from pvpResult
	answer, err := json.Marshal(pvpResult)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "constructor_pvp_error_count"}).Inc()
		return fmt.Errorf("PvP result marshal error: %v", err)
	}
	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func matrixHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("matrix_pvp"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method is not allowed")
	}

	//Check visitor's requests limit
	if err := checkLimits(getIP(r), "limiterPvp"); err != nil {
		return err
	}
	go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp"}).Inc()
	//Read request body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	//Parse request
	matrixObj := matrixPvpReq{}
	matrixObj.rowA, matrixObj.rowB, err = parser.ParseMatrixRequest(body)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return err
	}
	if len(matrixObj.rowA) > 50 || len(matrixObj.rowB) > 50 {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Parties with length more than 50 are not allowed")
	}
	//Start new PvP
	shieldsNumber := r.Header.Get("Pvp-Shields")
	matrixObj.isPvpoke = r.Header.Get("Pvp-Type")
	matrixObj.app = app
	matrixObj.result = make([][]appl.MatrixResult, 0, 1)
	matrixObj.customMoves = getUserMovelist(w, r, app)

	switch shieldsNumber {
	case "triple":
		if err = matrixObj.calculateMatrix(0); err != nil {
			return err
		}
		if err = matrixObj.calculateMatrix(1); err != nil {
			return err
		}
		if err = matrixObj.calculateMatrix(2); err != nil {
			return err
		}
	default:
		if err = matrixObj.calculateMatrix(5); err != nil {
			return err
		}
	}

	log.WithFields(log.Fields{"location": r.RequestURI}).Println("Calculated")
	//Create json answer from pvpResult
	answer, err := json.Marshal(matrixObj.result)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return fmt.Errorf("PvP result marshal error: %v", err)
	}
	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

type matrixPvpReq struct {
	rowA []appl.InitialData
	rowB []appl.InitialData

	pokA appl.InitialData
	pokB appl.InitialData

	errChan     appl.ErrorChan
	customMoves *map[string]appl.MoveBaseEntry

	result [][]appl.MatrixResult
	app    *App

	isPvpoke string
	i        int
	k        int
}

func (mp *matrixPvpReq) calculateMatrix(shields uint8) error {
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
	if errStr := mp.errChan.Flush(); errStr != "" {
		go mp.app.metrics.appCounters.With(prometheus.Labels{"type": "matrix_pvp_error_count"}).Inc()
		return fmt.Errorf(errStr)
	}
	mp.result = append(mp.result, singleMatrixResults)
	return nil
}

func (mp *matrixPvpReq) runMatrixPvP(singleMatrixResults *[]appl.MatrixResult) {
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
				CustomMoves:  mp.customMoves,
				Logging:      true})
		default:
			singleBattleResult, err = sim.NewPvpBetween(appl.SinglePvpInitialData{
				AttackerData: mp.pokA,
				DefenderData: mp.pokB,
				Constr:       appl.Constructor{},
				CustomMoves:  mp.customMoves,
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
					log.WithFields(log.Fields{"location": "writeMatrixRwsult"}).Error(fmt.Errorf("Matrix PvP result marshal error: %v", err))
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
		if err = json.Unmarshal(baseEntry, &singleBattleResult); err != nil {
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

func pveHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("pve"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodGet {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "pve_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method is not allowed")
	}
	//Check visitor's requests limit
	if err := checkLimits(getIP(r), "limiterPve"); err != nil {
		return err
	}
	go app.metrics.appCounters.With(prometheus.Labels{"type": "pve_count"}).Inc()

	//Parse request
	inDat, err := parser.ParseRaidRequest(chi.URLParam(r, "attacker"), chi.URLParam(r, "boss"), chi.URLParam(r, "obj"), chi.URLParam(r, "booster"))
	if err != nil {
		return err
	}
	inDat.CustomMoves = getUserMovelist(w, r, app)

	//Start new raid
	pveResult, err := sim.CalculteCommonPve(inDat)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "pve_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("PvE error"), http.StatusBadRequest, err.Error())
	}
	log.WithFields(log.Fields{"location": r.RequestURI}).Println("Calculated raid")

	//Create json answer from pvpResult
	answer, err := json.Marshal(pveResult)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "pve_error_count"}).Inc()
		return fmt.Errorf("PvE result marshal error: %v", err)
	}

	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func customPveHandler(w *http.ResponseWriter, r *http.Request, app *App) error {
	timer := prometheus.NewTimer(app.metrics.histogram.WithLabelValues("pve"))
	defer timer.ObserveDuration().Milliseconds()
	//Check if method is allowed
	if r.Method != http.MethodPost {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "custom_pve_count_error_count"}).Inc()
		return errors.NewHTTPError(nil, http.StatusMethodNotAllowed, "Method is not allowed")
	}
	//Check visitor's requests limit
	if err := checkLimits(getIP(r), "limiterPve"); err != nil {
		return err
	}
	go app.metrics.appCounters.With(prometheus.Labels{"type": "custom_pve_count"}).Inc()

	req := appl.IntialDataPve{}
	if err := parseBody(r, &req); err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "set_umoves_error_count"}).Inc()
		return errors.NewHTTPError(err, http.StatusBadRequest, "Error while reading request body")
	}
	req.CustomMoves = getUserMovelist(w, r, app)
	if req.FindInCollection {
		req.UserPokemon = returnUserPokemon(w, r, app)
	}

	//Start new raid
	pveResult, err := sim.CalculteCustomPve(req)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "custom_pve_count_error_count"}).Inc()
		return errors.NewHTTPError(fmt.Errorf("PvE error"), http.StatusBadRequest, err.Error())
	}
	log.WithFields(log.Fields{"location": r.RequestURI}).Println("Calculated raid")

	//Create json answer from pvpResult
	answer, err := json.Marshal(pveResult)
	if err != nil {
		go app.metrics.appCounters.With(prometheus.Labels{"type": "custom_pve_count_error_count"}).Inc()
		return fmt.Errorf("PvE result marshal error: %v", err)
	}

	//Write answer
	(*w).Header().Set("Content-Type", "application/json")
	_, err = (*w).Write(answer)
	if err != nil {
		return fmt.Errorf("Write response error: %v", err)
	}
	return nil
}

func returnUserPokemon(w *http.ResponseWriter, r *http.Request, app *App) []appl.UserPokemon {
	accSession, err := newAccessSession(r)
	if err != nil {
		return []appl.UserPokemon{}
	}
	pokemon, err := useractions.GetUserPokemon(app.mongo.client, accSession)
	if err != nil {
		return []appl.UserPokemon{}
	}
	switch pokemon {
	case nil:
		return []appl.UserPokemon{}
	default:
		return pokemon
	}
}
