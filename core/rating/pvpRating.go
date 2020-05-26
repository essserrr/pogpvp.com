package rating

import (
	pvpsim "Solutions/pvpSimulator/core/pvp"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"os"
	"path"
	"runtime"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

/*
	//getbase.GenerateRatingInitialData(80)
	rating.WriteRating(0, 0, false, 999999999, 2, 150, "master")
	rating.WriteRating(0, 1, false, 999999999, 2, 150, "master")
	rating.WriteRating(1, 1, false, 999999999, 5, 120, "master")
	rating.WriteRating(1, 2, false, 999999999, 8, 100, "master")
	rating.WriteRating(2, 2, false, 999999999, 15, 80, "master")

	rating.WriteRating(0, 0, false, 999999999, 2, 150, "ultra")
	rating.WriteRating(0, 1, false, 999999999, 2, 150, "ultra")
	rating.WriteRating(1, 1, false, 999999999, 5, 120, "ultra")
	rating.WriteRating(1, 2, false, 999999999, 8, 100, "ultra")
	rating.WriteRating(2, 2, false, 999999999, 15, 80, "ultra")

	rating.WriteRating(0, 0, false, 999999999, 2, 150, "great")
	rating.WriteRating(0, 1, false, 999999999, 2, 150, "great")
	rating.WriteRating(1, 1, false, 999999999, 5, 120, "great")
	rating.WriteRating(1, 2, false, 999999999, 8, 100, "great")
	rating.WriteRating(2, 2, false, 999999999, 15, 80, "great")

	rating.WriteOverall()
	rating.ProcessRating()
*/

type ivListByLeague struct {
	Great  map[string]ivListSingleLeague
	Ultra  map[string]ivListSingleLeague
	Master map[string]ivListSingleLeague
}

type ivListSingleLeague struct {
	Level   int
	Attack  int
	Defence int
	Stamina int
	MaxCP   uint32
}

type weightedList struct {
	Great  weightedLeague
	Ultra  weightedLeague
	Master weightedLeague
}

type weightedLeague map[string]uint32

type ratingStruct struct {
	fromFile bool
	shieldsA uint8
	shieldsB uint8

	dumpInterval  int
	sleepTime     int
	maxGoutotines int
	league        string

	dest string
}

//WriteRating writes rating output for given number of shileds
func WriteRating(shieldsA, shieldsB uint8, fromFile bool, dumpInterval, sleepTime, maxGoutotines int, league string) {
	rateObj := ratingStruct{
		fromFile:      fromFile,
		shieldsA:      shieldsA,
		shieldsB:      shieldsB,
		dumpInterval:  dumpInterval,
		sleepTime:     sleepTime,
		maxGoutotines: maxGoutotines,
		league:        league,

		dest: "",
	}
	rateObj.writeRatingByShieldsNumber()
}

func (rs *ratingStruct) writeRatingByShieldsNumber() {
	file, err := ioutil.ReadFile(path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./bases/rating/generated/maxIV.json"))
	if err != nil {
		log.Fatalln(err)
		return
	}
	maxIV := ivListByLeague{}
	err = json.Unmarshal(file, &maxIV)
	if err != nil {
		log.Fatalln(err)
		return
	}

	switch rs.league {
	case "great":
		rs.dest = "./bases/rating/rateGreat" + strconv.FormatInt(int64(rs.shieldsA), 10) + strconv.FormatInt(int64(rs.shieldsB), 10) + ".json"
		rs.calculateLeagueRating(maxIV.Great, "./bases/rating/generated/moveSetListGreat.json")
	case "ultra":
		rs.dest = "./bases/rating/rateUltra" + strconv.FormatInt(int64(rs.shieldsA), 10) + strconv.FormatInt(int64(rs.shieldsB), 10) + ".json"
		rs.calculateLeagueRating(maxIV.Ultra, "./bases/rating/generated/moveSetListUltra.json")
	case "master":
		rs.dest = "./bases/rating/rateMaster" + strconv.FormatInt(int64(rs.shieldsA), 10) + strconv.FormatInt(int64(rs.shieldsB), 10) + ".json"
		rs.calculateLeagueRating(maxIV.Master, "./bases/rating/generated/moveSetListMaster.json")
	}

}

func (rs *ratingStruct) calculateLeagueRating(leagueMaxIV map[string]ivListSingleLeague, origin string) {

	rowA := make([]pvpsim.InitialData, 0, 0)
	rowB := make([]pvpsim.InitialData, 0, 0)

	//choose continue calculations or start new
	switch rs.fromFile {
	case true:
		// if continue read dump files
		err := readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/rowAdump.json"), &rowA)
		if err != nil {
			log.Fatalln(err)
		}
		fmt.Printf("Dump A: %v \n", len(rowA))
		err = readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/rowBdump.json"), &rowB)
		if err != nil {
			log.Fatalln(err)
		}
		fmt.Printf("Dump B: %v \n", len(rowB))
	default:
		//if new, create rows of initial data
		leagueTemplate := make(map[string][]moveset)
		err := readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+origin), &leagueTemplate)
		if err != nil {
			log.Fatalln(err)
		}

		rowA = generateRow(leagueMaxIV, leagueTemplate, rs.shieldsA)

		fmt.Printf("Length of row A: %v \n", len(rowA))

		switch rs.shieldsA == rs.shieldsB {
		case true:
			rowB = rowA
			fmt.Printf("Length of row B: %v , row B is non unique \n", len(rowB))
		case false:
			rowB = append([]pvpsim.InitialData{}, rowA...)

			for key := range rowB {
				rowB[key].Shields = rs.shieldsB
			}
			fmt.Printf("Length of row B: %v  , row B is UNIQUE \n", len(rowB))
		}
	}

	errCh := rs.matrixForRate(rowA, rowB)
	if errCh != nil {
		errString := errCh.Flush()
		fmt.Println(errString)
		return
	}

}

func generateRow(leagueMaxIV map[string]ivListSingleLeague, leagueTemplate map[string][]moveset, shields uint8) []pvpsim.InitialData {
	row := make([]pvpsim.InitialData, 0, 5)
	for pokName, moveSet := range leagueTemplate {
		for _, singleSet := range moveSet {
			isShadow := false
			name := pokName
			index := strings.Index(pokName, " (Shadow)")
			if index != -1 {
				isShadow = true
				name = pokName[:index]
			}

			row = append(row, createInitalData(leagueMaxIV[name], name, singleSet, shields, isShadow))
		}
	}
	return row
}

func readJSON(filepath string, toTarget interface{}) error {
	file, err := ioutil.ReadFile(filepath)
	if err != nil {
		return err
	}
	err = json.Unmarshal(file, toTarget)
	if err != nil {
		return err
	}
	return nil
}

func createInitalData(stats ivListSingleLeague, name string, set moveset, shields uint8, shadow bool) pvpsim.InitialData {
	return pvpsim.InitialData{
		Name:       name,
		QuickMove:  set.Quick,
		ChargeMove: set.Charge,
		Level:      float32(stats.Level) * 0.5,
		AttackIV:   uint8(stats.Attack),
		DefenceIV:  uint8(stats.Defence),
		StaminaIV:  uint8(stats.Stamina),
		Shields:    shields,
		IsGreedy:   true,
		IsShadow:   shadow,
	}

}

func sumOf(n int) int {
	var sum int
	for i := 1; i <= n; i++ { // assigning 1 to i
		sum += i // sum = sum + i
	}
	return sum
}

//MatrixBattleNonUnique returns results of matrix battle between groups of pokemons
func (rs *ratingStruct) matrixForRate(rowA, rowB []pvpsim.InitialData) pvpsim.ErrorChan {
	var (
		outerWG sync.WaitGroup
		mutex   sync.Mutex
	)

	errChan := make(pvpsim.ErrorChan, len(rowA))
	timeVar := time.Duration(rs.sleepTime)
	leagueResult := map[string]map[string]map[string]map[string]pvpsim.RatingResult{}

	//if we continue from file, load previous result
	if rs.fromFile {
		err := readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/resdump.json"), &leagueResult)
		if err != nil {
			log.Fatalln(err)
		}
	}

	for keyA, pokA := range rowA {
		fmt.Printf("\n Line: %v - %v\n", keyA, pokA.Name)
		keyB := 0
		if rowA[0].Shields == rowB[0].Shields {
			keyB = keyA
		}
		for ; keyB < len(rowB); keyB++ {
			//do not calculate ties
			if keyA == keyB {
				continue
			}
			//limit number of routines + gc every time
			i := 0
			for {
				//skip first GC
				i++
				if i < 1 {
					time.Sleep(timeVar * time.Millisecond)
					fmt.Printf("%v: %v ", (keyB), rowB[keyB].Name)
					continue
				}
				//GC if we stucked
				if runtime.NumGoroutine() > rs.maxGoutotines {
					time.Sleep(timeVar * time.Millisecond)
					fmt.Printf("%v: %v ", (keyB), rowB[keyB].Name)
					runtime.GC()
					continue
				}
				break
			}

			outerWG.Add(1)
			go func(attacker, defender pvpsim.InitialData) {
				singleBattleResult, err := pvpsim.RatingPvp(&attacker, &defender)
				if err != nil {
					errChan <- err
					outerWG.Done()
					return
				}
				mutex.Lock()
				_, ok := leagueResult[singleBattleResult.Attacker.Name][makeMovesetKey(singleBattleResult.Attacker)][singleBattleResult.Defender.Name][makeMovesetKey(singleBattleResult.Defender)]
				if ok {
				}
				_, ok = leagueResult[singleBattleResult.Attacker.Name]
				if !ok {
					leagueResult[singleBattleResult.Attacker.Name] = make(map[string]map[string]map[string]pvpsim.RatingResult)
				}
				_, ok = leagueResult[singleBattleResult.Attacker.Name][makeMovesetKey(singleBattleResult.Attacker)]
				if !ok {
					leagueResult[singleBattleResult.Attacker.Name][makeMovesetKey(singleBattleResult.Attacker)] = make(map[string]map[string]pvpsim.RatingResult)
				}
				_, ok = leagueResult[singleBattleResult.Attacker.Name][makeMovesetKey(singleBattleResult.Attacker)][singleBattleResult.Defender.Name]
				if !ok {
					leagueResult[singleBattleResult.Attacker.Name][makeMovesetKey(singleBattleResult.Attacker)][singleBattleResult.Defender.Name] = make(map[string]pvpsim.RatingResult)
				}

				leagueResult[singleBattleResult.Attacker.Name][makeMovesetKey(singleBattleResult.Attacker)][singleBattleResult.Defender.Name][makeMovesetKey(singleBattleResult.Defender)] = singleBattleResult
				mutex.Unlock()
				outerWG.Done()
			}(pokA, rowB[keyB])
		}

		//dump variables every n iterations
		if keyA%rs.dumpInterval == 0 {
			fmt.Println()
			time.Sleep(5 * time.Second)
			fmt.Println("Start dumping")

			switch rowA[0].Shields == rowB[0].Shields {
			case true:
				writeJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/rowAdump.json"), rowA[(keyA+1):])
				writeJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/rowBdump.json"), rowB[(keyA+1):])
			case false:
				writeJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/rowAdump.json"), rowA[(keyA+1):])
				writeJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/rowBdump.json"), rowB)
			}

			writeJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/resdump.json"), leagueResult)

			fmt.Println("Dumped")
		}

	}
	outerWG.Wait()
	close(errChan)

	if len(errChan) > 0 {
		return errChan
	}
	time.Sleep(10 * time.Second)

	writeJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+rs.dest), leagueResult)

	return nil
}

func writeJSON(dest string, value interface{}) {
	res, err := json.Marshal(value)
	if err != nil {
		log.Fatalln(err)
	}

	err = ioutil.WriteFile(dest, res, 0770)
	if err != nil {
		log.Fatalln(err)
	}
}

func makeMovesetKey(res pvpsim.RatingBattleResult) string {
	return res.Quick + res.Charge[0] + res.Charge[1]
}

type rankingSheetToProcess struct {
	n                float64
	Name             string
	AvgRate          float64
	AvgRateWeighted  float64
	AvgWinrate       float64
	BestMetaMatchups []matchup
	Counters         []matchup
	Movesets         map[string]*moveset
}

type rankingSheetToWrite struct {
	Name             string
	AvgRate          float64
	AvgRateWeighted  float64
	AvgWinrate       float64
	BestMetaMatchups []matchup
	Counters         []matchup
	Movesets         []moveset
}

type matchup struct {
	Name string
	Rate uint32
}

type moveset struct {
	n          float64
	Quick      string
	Charge     []string
	Rate       float64
	Weighted   float64
	AvgWinrate float64
}

func (m *moveset) toString() string {
	return m.Quick + m.Charge[0] + m.Charge[1]
}

func ProcessRating() {
	//open weights
	weights := weightedList{}
	err := readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/generated/weights.json"), &weights)
	if err != nil {
		log.Fatalln(err)
	}

	setUpProcessing("./bases/rating/generated/moveSetListGreat.json",
		"./bases/rating/overallGreat.json", "./API/ratingAPI/avgOverallGreat.json",
		"Great", weights.Great)

	setUpProcessing("./bases/rating/generated/moveSetListUltra.json",
		"./bases/rating/overallUltra.json", "./API/ratingAPI/avgOverallUltra.json",
		"Ultra", weights.Ultra)

	setUpProcessing("./bases/rating/generated/moveSetListMaster.json",
		"./bases/rating/overallMaster.json", "./API/ratingAPI/avgOverallMaster.json",
		"Master", weights.Master)

}

func setUpProcessing(movesetAdr, overallAdr, overallDest, league string, weights weightedLeague) {
	//open movesetlist
	template := []string{"00", "01", "11", "12", "22"}
	movesetList := make(map[string][]moveset)
	err := readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+movesetAdr), &movesetList)
	if err != nil {
		log.Fatalln(err)
	}
	leagueObj := processingStruct{
		leagueList: movesetList,
		weights:    weights,
	}
	//process overall rating
	leagueObj.processSingleRating(overallAdr, overallDest)
	//process ecety other rating
	for _, value := range template {
		leagueObj := processingStruct{
			leagueList: movesetList,
			weights:    weights,
		}
		leagueObj.processSingleRating("./bases/rating/rate"+league+value+".json", "./API/ratingAPI/avg"+league+value+".json")
	}

}

//WriteOverall generates overall raw rating from generated data
func WriteOverall() {
	template := []string{"Great", "Ultra", "Master"}
	for _, value := range template {
		generateOverall(value)
	}

}

func generateOverall(league string) {
	result00 := make(map[string]map[string]map[string]map[string]pvpsim.RatingResult)
	err := readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/rate"+league+"00.json"), &result00)
	if err != nil {
		log.Fatalln(err)
	}
	result11 := make(map[string]map[string]map[string]map[string]pvpsim.RatingResult)
	err = readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/rate"+league+"11.json"), &result11)
	if err != nil {
		log.Fatalln(err)
	}
	result22 := make(map[string]map[string]map[string]map[string]pvpsim.RatingResult)
	err = readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/rate"+league+"22.json"), &result22)
	if err != nil {
		log.Fatalln(err)
	}
	for aName, aValue := range result00 {
		for aMoveKey, aMoveValue := range aValue {
			for dName, dValue := range aMoveValue {
				for dMoveName, dMoveValue := range dValue {

					rateA := float64(dMoveValue.Attacker.Rate) / 1000.0
					rateD := float64(dMoveValue.Defender.Rate) / 1000.0
					n := 1.0

					val, ok := result11[aName][aMoveKey][dName][dMoveName]
					switch ok {
					case true:
						if ok {
							rateA *= float64(val.Attacker.Rate) / 1000.0
							rateD *= float64(val.Defender.Rate) / 1000.0
							n++
						}
					case false:
						val, ok = result11[dName][dMoveName][aName][aMoveKey]
						switch ok {
						case true:
							if ok {
								rateA *= float64(val.Defender.Rate) / 1000.0
								rateD *= float64(val.Attacker.Rate) / 1000.0
								n++
							}
						case false:
							fmt.Println(dName, dMoveName, aName, aMoveKey+" not found in 11")
						}
					}

					val, ok = result22[aName][aMoveKey][dName][dMoveName]
					switch ok {
					case true:
						if ok {
							rateA *= float64(val.Attacker.Rate) / 1000.0
							rateD *= float64(val.Defender.Rate) / 1000.0
							n++
						}
					case false:
						val, ok = result22[dName][dMoveName][aName][aMoveKey]
						switch ok {
						case true:
							if ok {
								rateA *= float64(val.Defender.Rate) / 1000.0
								rateD *= float64(val.Attacker.Rate) / 1000.0
								n++
							}
						case false:
							fmt.Println(dName, dMoveName, aName, aMoveKey+" not found in 22")
						}
					}

					rateA = math.Pow(rateA, 1/n) * 1000
					rateD = math.Pow(rateD, 1/n) * 1000

					if rateA > 65530 {
						fmt.Println("Overflow")
					}
					if rateD > 65530 {
						fmt.Println("Overflow")
					}

					newRes := result00[aName][aMoveKey][dName][dMoveName]
					newRes.Attacker.Rate = uint16(rateA)
					newRes.Defender.Rate = uint16(rateD)

					result00[aName][aMoveKey][dName][dMoveName] = newRes
				}
			}
		}
	}

	writeJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+"./bases/rating/overall"+league+".json"), result00)
}

type processingStruct struct {
	leagueList map[string][]moveset
	weights    weightedLeague

	rawRate       map[string]map[string]map[string]map[string]pvpsim.RatingResult
	processedRate map[string]*rankingSheetToProcess
	result        []rankingSheetToWrite
}

func (ps *processingStruct) processSingleRating(ratePath, dest string) {
	//open rating
	err := readJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+ratePath), &ps.rawRate)
	if err != nil {
		log.Fatalln(err)
	}

	ps.processedRate = make(map[string]*rankingSheetToProcess)
	//calculate initial rating (weight every pokemon movesets)
	ps.calculateMovesRate()
	ps.weightMoves()

	//find the best moveset after weighting and assign it's rate to the corresponding pokemon
	ps.assignRateToPokemon()

	//weight pokemons
	ps.weightPokemons()

	//make slice from map
	ps.transformMapToSlice()
	//sort list
	sort.Sort(byRateList(ps.result))

	ps.makeListofBestsAndCounters(true)
	ps.makeListofBestsAndCounters(false)

	//create counters and bests list
	writeJSON(path.Join(os.Getenv("PVP_SIMULATOR_ROOT")+dest), ps.result)

}

func (ps *processingStruct) calculateMovesRate() {
	//for every pokemon
	for attacker, leftPokValue := range ps.leagueList {
		//create pok new entry
		ps.processedRate[attacker] = &rankingSheetToProcess{
			Name:     attacker,
			Movesets: make(map[string]*moveset),
		}
		//for every pokemon's move set
		for leftMoveKey, leftMoveValue := range leftPokValue {
			//create new set
			newSet := &moveset{}
			var (
				n float64
			)
			//against every other pokemon
			for defender, rightValue := range ps.leagueList {
				//and every other pokemon's move set
				for rightMoveKey, rightMoveValue := range rightValue {
					//exept self
					if attacker == defender && leftMoveKey == rightMoveKey && leftMoveValue.Quick == rightMoveValue.Quick && leftMoveValue.Charge[0] == rightMoveValue.Charge[0] && leftMoveValue.Charge[1] == rightMoveValue.Charge[1] {
						continue
					}
					rate := ps.findRate(attacker, leftMoveValue.toString(), defender, rightMoveValue.toString())

					newSet.Rate += float64(rate)

					if rate > 500 {
						newSet.AvgWinrate++
					}
					n++

				}
			}

			newSet.Rate = float64(uint64(newSet.Rate / n))
			newSet.AvgWinrate = math.Round((newSet.AvgWinrate/n)*100) / 100
			newSet.Quick = leftMoveValue.Quick
			newSet.Charge = leftMoveValue.Charge

			ps.processedRate[attacker].Movesets[leftMoveValue.toString()] = newSet
		}
	}
}

func (ps *processingStruct) weightMoves() {
	//for every pokemon
	for attacker, attackerVal := range ps.processedRate {
		//for every pokemon's move set
		for aSet, aSetVal := range attackerVal.Movesets {
			//against every other pokemon
			var (
				weight float64
				n      float64
			)
			for defender, defenderVal := range ps.processedRate {
				//exept self
				if attacker == defender {
					continue
				}
				//find other pokemon's best moveset
				var (
					bestName string
					bestRate float64
				)
				for dSet, dSetVal := range defenderVal.Movesets {
					if dSetVal.Rate > bestRate {
						bestName = dSet
					}
				}
				//find rating against this moveset
				rate := ps.findRate(attacker, aSet, defender, bestName)

				aSetVal.Weighted += float64(rate)

				weightVal, ok := ps.weights[defender]
				if rate > 500 && ok {
					weight += math.Pow(float64(weightVal), 1.08)
				}
				n++
			}
			if weight < 1 {
				weight = 1
			}
			ps.processedRate[attacker].Movesets[aSet].Weighted = aSetVal.Weighted / n
			ps.processedRate[attacker].Movesets[aSet].Weighted = aSetVal.Weighted * weight / float64(len(ps.weights))
		}
	}

}

func (ps *processingStruct) assignRateToPokemon() {
	for pok, val := range ps.processedRate {
		rate := 0.0
		rateW := 0.0
		winrate := 0.0
		for _, moveVal := range val.Movesets {
			if rateW < moveVal.Weighted {
				rate = moveVal.Rate
				rateW = moveVal.Weighted
				winrate = moveVal.AvgWinrate
			}
		}

		ps.processedRate[pok].AvgRate = rate
		ps.processedRate[pok].AvgWinrate = winrate
		ps.processedRate[pok].AvgRateWeighted = rateW
	}
}

func (ps *processingStruct) weightPokemons() {
	//for every pokemon
	for attacker, attackerVal := range ps.processedRate {
		//find name of the best moveset
		ps.processedRate[attacker].AvgRateWeighted = 0
		n := 0.0
		weight := 0.0
		keyA := findBestMovesetByRate(attackerVal.Movesets, attackerVal.AvgRate)
		//against every other pokemon
		for defender, defenderVal := range ps.processedRate {
			//exept self
			if attacker == defender {
				continue
			}
			//find name of the best moveset
			keyD := findBestMovesetByRate(defenderVal.Movesets, defenderVal.AvgRate)

			//find rating of that battle
			rate := ps.findRate(attacker, keyA, defender, keyD)

			weightVal, ok := ps.weights[defender]

			switch ok {
			case true:
				switch rate > 500 {
				case true:
					weight += math.Pow(float64(weightVal), 1.15)
				}
			}
			ps.processedRate[attacker].AvgRateWeighted += float64(rate)
			n++
		}
		if weight < 1 {
			weight = 1
		}
		ps.processedRate[attacker].AvgRateWeighted = (ps.processedRate[attacker].AvgRateWeighted / n) * (weight / float64(len(ps.weights)))
	}
}

func findBestMovesetByRate(movesets map[string]*moveset, pokRate float64) string {
	for key, set := range movesets {
		if pokRate == set.Rate {
			return key
		}
	}
	log.Fatal("Moveset not found")
	return ""
}

func (ps *processingStruct) findRate(aName, aSet, dName, dSet string) uint16 {
	//find rate in general order
	value, ok := ps.rawRate[aName][aSet][dName][dSet]
	switch ok {
	case true:
		return value.Attacker.Rate
	case false:
		//find rate in reverse order
		value, ok = ps.rawRate[dName][dSet][aName][aSet]
		if !ok {
			//if rate not found in both orders
			log.Println(aName, aSet, dName, dSet)
		}
		return value.Defender.Rate
	}
	return 0
}

func (ps *processingStruct) transformMapToSlice() {
	ps.result = make([]rankingSheetToWrite, 0, 0)
	for _, value := range ps.processedRate {
		newMoveset := make([]moveset, 0, 1)
		for _, value := range value.Movesets {
			newMoveset = append(newMoveset, *value)
		}
		//with sorted movesets
		sort.Sort(byWeightedRateMoves(newMoveset))

		ps.result = append(ps.result, rankingSheetToWrite{
			Name:            value.Name,
			AvgRate:         value.AvgRate,
			AvgRateWeighted: value.AvgRateWeighted,
			AvgWinrate:      value.AvgWinrate,
			Movesets:        newMoveset,
		})
	}
}

func (ps *processingStruct) makeListofBestsAndCounters(first bool) {
	for keyA, valA := range ps.result {
		for keyD, valD := range ps.result {
			if keyA == keyD {
				continue
			}
			if first {
				_, inWeightsList := ps.weights[valD.Name]
				if !inWeightsList {
					continue
				}
			}
			//try in general order
			value, ok := ps.rawRate[valA.Name][valA.Movesets[0].toString()][valD.Name][valD.Movesets[0].toString()]

			switch ok {
			case true:
				ps.result[keyA].addToBestsOrCounters(value.Attacker, value.Defender, valD.Name, ps.result[keyD].Name)
			case false:
				//if fails in reverse order
				value, ok := ps.rawRate[valD.Name][valD.Movesets[0].toString()][valA.Name][valA.Movesets[0].toString()]
				if !ok {
					log.Println(valD.Name, valD.Movesets[0].toString(), valA.Name, valA.Movesets[0].toString())
					continue
				}
				ps.result[keyA].addToBestsOrCounters(value.Defender, value.Attacker, valD.Name, ps.result[keyD].Name)
			}
		}
	}

	//sort matchups
	for key := range ps.result {
		sort.Sort(byRateMathcup(ps.result[key].Counters))
		sort.Sort(byRateMathcup(ps.result[key].BestMetaMatchups))
	}
}

func (rstw *rankingSheetToWrite) addToBestsOrCounters(resBest, resCounter pvpsim.RatingBattleResult, nameBest, nameCounter string) {
	if resBest.Rate > 500 && len(rstw.BestMetaMatchups) < 10 {
		for _, value := range rstw.BestMetaMatchups {
			if value.Name == nameBest {
				return
			}
		}
		rstw.BestMetaMatchups = append(rstw.BestMetaMatchups, matchup{nameBest, uint32(resBest.Rate)})
		return
	}
	if resCounter.Rate > 500 && len(rstw.Counters) < 10 {
		for _, value := range rstw.Counters {
			if value.Name == nameCounter {
				return
			}
		}
		rstw.Counters = append(rstw.Counters, matchup{nameCounter, uint32(resCounter.Rate)})
		return
	}
}

type byRateMathcup []matchup

func (a byRateMathcup) Len() int           { return len(a) }
func (a byRateMathcup) Less(i, j int) bool { return a[i].Rate > a[j].Rate }
func (a byRateMathcup) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

type byWeightedRateMoves []moveset

func (a byWeightedRateMoves) Len() int           { return len(a) }
func (a byWeightedRateMoves) Less(i, j int) bool { return a[i].Weighted > a[j].Weighted }
func (a byWeightedRateMoves) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

type byRateList []rankingSheetToWrite

func (a byRateList) Len() int           { return len(a) }
func (a byRateList) Less(i, j int) bool { return a[i].AvgRateWeighted > a[j].AvgRateWeighted }
func (a byRateList) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

type weighted struct {
	val  float64
	name string
}
