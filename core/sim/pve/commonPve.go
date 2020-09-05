package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"math/rand"
	"sort"
	"sync"
	"time"
)

type conStruct struct {
	sync.Mutex
	errChan app.ErrorChan
	wg      sync.WaitGroup
	inDat   *app.IntialDataPve
	count   int

	attackerGroups [][]preRun
	attackerRow    []preRun
	boosterRow     []preRun
	bossRow        []app.BossInfo

	resArray []PveResult
}

type PveResult struct {
	Party  []preRun
	Result []app.VsBossResult
}

//ReturnCommonRaid return common raid results as an array of format pokemon+moveset:boss:result
func ReturnCommonRaid(inDat *app.IntialDataPve) ([]PveResult, error) {
	//if boss is not specified return error
	_, ok := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	if !ok {
		return nil, &customError{"Unknown boss"}
	}
	//otherwise make initial preparations
	rand.Seed(time.Now().UnixNano())
	inDat.SetCommonPveRuns()

	//make cancurrent object of this pve
	bossRow, err := generateBossRow(inDat)
	if err != nil {
		return nil, err
	}
	boosterRow, err := makeBoostersRow(inDat, &bossRow)
	if err != nil {
		return nil, err
	}
	attackerRow, err := makeAttackerRow(inDat)
	if err != nil {
		return nil, err
	}

	conObj := conStruct{
		boosterRow:  boosterRow,
		attackerRow: attackerRow,
		bossRow:     bossRow,

		inDat: inDat,
		wg:    sync.WaitGroup{},
		count: 0,
	}

	conObj.startCommonPve()

	close(conObj.errChan)
	errStr := conObj.errChan.Flush()
	if errStr != "" {
		return []PveResult{}, &customError{
			errStr,
		}
	}

	sort.Sort(byAvgDamage(conObj.resArray))

	switch len(conObj.resArray) > 500 {
	case true:
		conObj.resArray = conObj.resArray[:500]
	default:
	}
	return conObj.resArray, nil
}

type pvpeInitialData struct {
	App         *app.SimApp
	CustomMoves *map[string]app.MoveBaseEntry

	NumberOfRuns  int
	FriendStage   int
	Weather       int
	DodgeStrategy int

	AttackerPokemon []app.PokemonInitialData
	AggresiveMode   bool

	Boss          app.BossInfo
	PartySize     uint8
	PlayersNumber uint8

	BoostSlotPokemon app.PokemonInitialData
}

func (co *conStruct) startCommonPve() {
	co.resArray = make([]PveResult, 0, len(co.attackerRow))
	co.errChan = make(app.ErrorChan, len(co.attackerRow)*len(co.bossRow))

	for number, pok := range co.attackerRow {
		attackers, partyDescription, booster := co.returnCommonPveInitialData(pok)

		co.resArray = append(co.resArray, PveResult{
			Result: make([]app.VsBossResult, 0, len(co.bossRow)),
			Party:  partyDescription,
		})

		for _, boss := range co.bossRow {
			//limit rountines number
			for co.count > 500 {
				time.Sleep(10 * time.Microsecond)
			}
			co.wg.Add(1)
			co.Lock()
			co.count++
			co.Unlock()

			go func(currBoss app.BossInfo, i int) {
				defer co.wg.Done()
				singleResult, err := setOfRuns(pvpeInitialData{
					CustomMoves: co.inDat.CustomMoves, App: co.inDat.App,
					AttackerPokemon: attackers, BoostSlotPokemon: booster, Boss: currBoss,
					PartySize: co.inDat.PartySize, PlayersNumber: co.inDat.PlayersNumber, NumberOfRuns: co.inDat.NumberOfRuns,
					FriendStage: co.inDat.FriendStage, Weather: co.inDat.Weather, DodgeStrategy: co.inDat.DodgeStrategy, AggresiveMode: co.inDat.AggresiveMode,
				})
				if err != nil {
					co.errChan <- err
					return
				}
				co.Lock()
				co.count--
				co.resArray[i].Result = append(co.resArray[i].Result, singleResult)
				co.Unlock()
			}(boss, number)
		}
	}
	co.wg.Wait()
}

func (co *conStruct) returnCommonPveInitialData(pok preRun) ([]app.PokemonInitialData, []preRun, app.PokemonInitialData) {
	//make attakers initial data array
	attackers := make([]app.PokemonInitialData, 0, 1)
	partyDescription := make([]preRun, 0, 1)
	//select booster for current pok
	selectedBooster := co.selectBoosterFor([]int{co.inDat.App.PokemonMovesBase[pok.Quick].MoveType, co.inDat.App.PokemonMovesBase[pok.Charge].MoveType})
	boosterInData := app.PokemonInitialData{}
	//if booster selected make initial data for him
	if selectedBooster.Name != "" {
		boosterInData = app.PokemonInitialData{Name: selectedBooster.Name, QuickMove: selectedBooster.Quick, ChargeMove: selectedBooster.Charge,
			Level: co.inDat.BoostSlotPokemon.Level, AttackIV: co.inDat.BoostSlotPokemon.AttackIV, DefenceIV: co.inDat.BoostSlotPokemon.DefenceIV, StaminaIV: co.inDat.BoostSlotPokemon.StaminaIV,
		}

		attackers = append(attackers, boosterInData)
		partyDescription = append(partyDescription, selectedBooster)
	}

	attackers = append(attackers, app.PokemonInitialData{Name: pok.Name, QuickMove: pok.Quick, ChargeMove: pok.Charge, Level: co.inDat.Pok.Level,
		AttackIV: co.inDat.Pok.AttackIV, DefenceIV: co.inDat.Pok.DefenceIV, StaminaIV: co.inDat.Pok.StaminaIV, IsShadow: co.inDat.Pok.IsShadow})
	partyDescription = append(partyDescription, pok)

	return attackers, partyDescription, boosterInData
}

func (co *conStruct) selectBoosterFor(types []int) preRun {
	if co.boosterRow == nil || len(co.boosterRow) == 0 {
		return preRun{}
	}
	selectedBooster := preRun{}
	//select booster
	for _, booster := range co.boosterRow {
		//define matches of type
		matches := 0
		for _, boosterType := range co.inDat.App.PokemonStatsBase[booster.Name].Type {
			for _, typeValue := range types {
				if typeValue == boosterType {
					matches++
				}
			}
		}
		//if both types of moves matched select and exit
		if matches == 2 {
			selectedBooster = booster
			break
		}
		//if 1 type matched continue search
		if matches == 1 {
			if selectedBooster.Name == "" {
				selectedBooster = booster
			}
		}
	}
	//if none selected, select the best dps option
	if selectedBooster.Name == "" {
		selectedBooster = co.boosterRow[0]
	}

	return selectedBooster
}

type byAvgDamage []PveResult

func (a byAvgDamage) Len() int { return len(a) }
func (a byAvgDamage) Less(i, j int) bool {
	var (
		avgDamageLeft  int32
		avgDamageRight int32

		avgTimeLeft  int32
		avgTimeRight int32
	)
	for _, value := range a[i].Result {
		avgDamageLeft += value.DAvg
		avgTimeLeft += (300000 + value.TAvg)
	}
	for _, value := range a[j].Result {
		avgDamageRight += value.DAvg
		avgTimeRight += (300000 + value.TAvg)
	}
	if avgDamageLeft == avgDamageRight {
		dpsLeft := float64(avgDamageLeft) / float64(avgTimeLeft/1000)
		dpsRight := float64(avgDamageRight) / float64(avgTimeRight/1000)
		if dpsLeft == dpsRight {
			return avgTimeLeft < avgTimeRight
		}
		return dpsLeft > dpsRight
	}
	return avgDamageLeft > avgDamageRight
}
func (a byAvgDamage) Swap(i, j int) { a[i], a[j] = a[j], a[i] }

type byAvgDps []PveResult

func (a byAvgDps) Len() int { return len(a) }
func (a byAvgDps) Less(i, j int) bool {
	var (
		avgDamageLeft  int32
		avgDamageRight int32

		avgTimeLeft  int32
		avgTimeRight int32
	)
	for _, value := range a[i].Result {
		avgDamageLeft += value.DAvg
		avgTimeLeft += (300000 - value.TAvg)
	}
	for _, value := range a[j].Result {
		avgDamageRight += value.DAvg
		avgTimeRight += (300000 - value.TAvg)
	}

	dpsLeft := float64(avgDamageLeft) / float64(avgTimeLeft/1000)
	dpsRight := float64(avgDamageRight) / float64(avgTimeRight/1000)

	if dpsLeft == dpsRight {
		if avgDamageLeft == avgDamageRight {
			return avgTimeLeft < avgTimeRight
		}
		return avgDamageLeft > avgDamageRight
	}
	return avgDamageLeft > avgDamageRight
}
func (a byAvgDps) Swap(i, j int) { a[i], a[j] = a[j], a[i] }

//setOfRuns starts new set of pve's, returns set result and error
func setOfRuns(inDat pvpeInitialData) (app.VsBossResult, error) {
	result := app.VsBossResult{}
	result.DMin = tierHP[inDat.Boss.Tier]
	result.TMin = tierTimer[inDat.Boss.Tier]
	result.FMin = uint32(inDat.PartySize)

	for i := 0; i < inDat.NumberOfRuns; i++ {
		res, err := simulatorRun(&inDat)
		if err != nil {
			return app.VsBossResult{}, err
		}
		collect(&result, &res)
	}

	result.DAvg = int32(float64(result.DAvg) / float64(inDat.NumberOfRuns))
	result.TAvg = int32(float64(result.TAvg) / float64(inDat.NumberOfRuns))

	result.BName, result.BQ, result.BCh = inDat.Boss.Name, inDat.Boss.QuickMove, inDat.Boss.ChargeMove
	result.NOfWins = result.NOfWins / float32(inDat.NumberOfRuns) * 100

	return result, nil
}

//collect collects run
func collect(cr *app.VsBossResult, run *runResult) {
	if run.damageDealt > cr.DMax {
		cr.DMax = run.damageDealt
	}
	if run.damageDealt < cr.DMin {
		cr.DMin = run.damageDealt
	}
	cr.DAvg += run.damageDealt

	if run.timeRemained > cr.TMax {
		cr.TMax = run.timeRemained
	}
	if run.timeRemained < cr.TMin {
		cr.TMin = run.timeRemained
	}
	cr.TAvg += run.timeRemained

	if run.fainted > cr.FMax {
		cr.FMax = run.fainted
	}
	if run.fainted < cr.FMin {
		cr.FMin = run.fainted
	}
	if run.isWin {
		cr.NOfWins++
	}
}
