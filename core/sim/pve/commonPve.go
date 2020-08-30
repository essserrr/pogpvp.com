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

	boosterRow  []preRun
	attackerRow []preRun
	bossRow     []app.BossInfo
	resArray    [][]app.CommonResult
}

func setUpRunsNumber(inDat *app.IntialDataPve) {
	if inDat.NumberOfRuns > 0 {
		return
	}
	_, ok := inDat.App.PokemonStatsBase[inDat.Pok.Name]
	if !ok {
		inDat.NumberOfRuns = 10
		return
	}

	if _, ok = findMove(inDat.App, inDat.CustomMoves, inDat.Pok.QuickMove); !ok {
		inDat.NumberOfRuns = 100
		return
	}

	if _, ok = findMove(inDat.App, inDat.CustomMoves, inDat.Pok.ChargeMove); !ok {
		inDat.NumberOfRuns = 100
		return
	}

	inDat.NumberOfRuns = 500
}

func findMove(app *app.SimApp, customMoves *map[string]app.MoveBaseEntry, moveName string) (app.MoveBaseEntry, bool) {
	//if a move not found in the main databse
	move, ok := app.PokemonMovesBase[moveName]
	if !ok {
		//try to search in the custom database
		move, ok = (*customMoves)[moveName]
		if !ok {
			return move, ok
		}
	}
	return move, ok
}

//ReturnCommonRaid return common raid results as an array of format pokemon+moveset:boss:result
func ReturnCommonRaid(inDat *app.IntialDataPve) ([][]app.CommonResult, error) {
	//if boss is not specified return error
	_, ok := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	if !ok {
		return nil, &customError{"Unknown boss"}
	}
	//otherwise make initial preparations
	rand.Seed(time.Now().UnixNano())
	setUpRunsNumber(inDat)

	//make cancurrent object of this pve
	bossRow, err := generateBossRow(inDat)
	if err != nil {
		return nil, err
	}
	boosterRow, err := makeBoostersRow(inDat)
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

		inDat:    inDat,
		wg:       sync.WaitGroup{},
		count:    0,
		resArray: [][]app.CommonResult{},
	}

	conObj.start()

	conObj.wg.Wait()

	close(conObj.errChan)
	errStr := conObj.errChan.Flush()
	if errStr != "" {
		return [][]app.CommonResult{}, &customError{
			errStr,
		}
	}

	sort.Sort(byAvgDamage(conObj.resArray))

	switch len(conObj.resArray) > 300 {
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

func (co *conStruct) start() {
	co.resArray = make([][]app.CommonResult, 0, 1000)
	co.errChan = make(app.ErrorChan, len(co.attackerRow)*len(co.bossRow))

	for number, pok := range co.attackerRow {
		co.resArray = append(co.resArray, make([]app.CommonResult, 0, len(co.bossRow)))
		for _, boss := range co.bossRow {
			//limit rountines number
			for co.count > 20000 {
				time.Sleep(10 * time.Microsecond)
			}
			co.wg.Add(1)
			co.Lock()
			co.count++
			co.Unlock()

			go func(currBoss app.BossInfo, pok preRun, i int) {
				defer co.wg.Done()

				attackers := make([]app.PokemonInitialData, 0, 1)
				booster := co.selectBoosterFor(pok)
				if booster.Name != "" {
					attackers = append(attackers, booster)
				}
				attackers = append(attackers, app.PokemonInitialData{
					Name: pok.Name,

					QuickMove:  pok.Quick,
					ChargeMove: pok.Charge,

					Level: co.inDat.Pok.Level,

					AttackIV:  co.inDat.Pok.AttackIV,
					DefenceIV: co.inDat.Pok.DefenceIV,
					StaminaIV: co.inDat.Pok.StaminaIV,

					IsShadow: co.inDat.Pok.IsShadow,
				})

				singleResult, err := setOfRuns(pvpeInitialData{
					CustomMoves: co.inDat.CustomMoves,
					App:         co.inDat.App,

					AttackerPokemon:  attackers,
					BoostSlotPokemon: booster,

					PartySize:     co.inDat.PartySize,
					PlayersNumber: co.inDat.PlayersNumber,

					Boss: currBoss,

					NumberOfRuns:  co.inDat.NumberOfRuns,
					FriendStage:   co.inDat.FriendStage,
					Weather:       co.inDat.Weather,
					DodgeStrategy: co.inDat.DodgeStrategy,
					AggresiveMode: co.inDat.AggresiveMode,
				})
				if err != nil {
					co.errChan <- err
					return
				}
				co.Lock()
				co.count--
				co.resArray[i] = append(co.resArray[i], singleResult)
				co.Unlock()
			}(boss, pok, number)
		}
	}
	co.wg.Wait()
}

func (co *conStruct) selectBoosterFor(pok preRun) app.PokemonInitialData {
	if co.boosterRow == nil || len(co.boosterRow) == 0 {
		return app.PokemonInitialData{}
	}

	pokQuickType := co.inDat.App.PokemonMovesBase[pok.Quick].MoveType
	pokChargeType := co.inDat.App.PokemonMovesBase[pok.Charge].MoveType

	selectedBooster := preRun{}
	//select booster
	for _, booster := range co.boosterRow {
		//define matches of type
		matches := 0
		for _, boosterType := range co.inDat.App.PokemonStatsBase[booster.Name].Type {
			if pokQuickType == boosterType {
				matches++
			}
			if pokChargeType == boosterType {
				matches++
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

	return app.PokemonInitialData{
		Name: selectedBooster.Name,

		QuickMove:  selectedBooster.Quick,
		ChargeMove: selectedBooster.Charge,

		Level: co.inDat.BoostSlotPokemon.Level,

		AttackIV:  co.inDat.BoostSlotPokemon.AttackIV,
		DefenceIV: co.inDat.BoostSlotPokemon.DefenceIV,
		StaminaIV: co.inDat.BoostSlotPokemon.StaminaIV,

		IsShadow: false,
	}
}

type byAvgDamage [][]app.CommonResult

func (a byAvgDamage) Len() int { return len(a) }
func (a byAvgDamage) Less(i, j int) bool {
	var (
		avgDamageLeft  int32
		avgDamageRight int32

		avgTimeLeft  int32
		avgTimeRight int32
	)
	for _, value := range a[i] {
		avgDamageLeft += value.DAvg
		avgTimeLeft += value.TAvg
	}
	for _, value := range a[j] {
		avgDamageRight += value.DAvg
		avgTimeRight += value.TAvg
	}
	if avgDamageLeft == avgDamageRight {
		dpsLeft := float64(avgDamageLeft) / float64(avgTimeLeft/1000)
		dpsRight := float64(avgDamageRight) / float64(avgTimeRight/1000)
		if dpsLeft == dpsRight {
			return avgTimeLeft > avgTimeRight
		}
		return dpsLeft < dpsRight
	}
	return avgDamageLeft > avgDamageRight
}
func (a byAvgDamage) Swap(i, j int) { a[i], a[j] = a[j], a[i] }

//setOfRuns starts new set of pve's, returns set result and error
func setOfRuns(inDat pvpeInitialData) (app.CommonResult, error) {
	result := app.CommonResult{}
	result.DMin = tierHP[inDat.Boss.Tier]
	result.TMin = tierTimer[inDat.Boss.Tier]
	result.FMin = uint32(inDat.PartySize)

	for i := 0; i < inDat.NumberOfRuns; i++ {
		res, err := simulatorRun(&inDat)
		if err != nil {
			return app.CommonResult{}, err
		}
		collect(&result, &res)
	}

	result.DAvg = int32(float64(result.DAvg) / float64(inDat.NumberOfRuns))
	result.TAvg = int32(float64(result.TAvg) / float64(inDat.NumberOfRuns))

	result.BoostName, result.BoostQ, result.BoostCh = inDat.BoostSlotPokemon.Name, inDat.BoostSlotPokemon.QuickMove, inDat.BoostSlotPokemon.ChargeMove
	result.AName, result.AQ, result.ACh = inDat.AttackerPokemon[0].Name, inDat.AttackerPokemon[0].QuickMove, inDat.AttackerPokemon[0].ChargeMove
	result.BName, result.BQ, result.BCh = inDat.Boss.Name, inDat.Boss.QuickMove, inDat.Boss.ChargeMove

	result.NOfWins = result.NOfWins / float32(inDat.NumberOfRuns) * 100

	return result, nil
}

//collect collects run
func collect(cr *app.CommonResult, run *runResult) {
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
