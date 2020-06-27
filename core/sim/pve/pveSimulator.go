package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"math"
	"math/rand"
	"sort"
	"strings"
	"sync"
	"time"
)

type pveObject struct {
	app *app.SimApp

	DodgeStrategy int
	ActivePok     int

	Attacker []pokemon
	Weather  map[int]float32

	Boss          pokemon
	FriendStage   float32
	AggresiveMode bool

	Timer         int32
	Tier          uint8
	PartySize     uint8
	PlayersNumber uint8
}

type commonPvpInData struct {
	App *app.SimApp

	NumberOfRuns  int
	FriendStage   int
	Weather       int
	DodgeStrategy int

	Pok           app.PokemonInitialData
	AggresiveMode bool

	Boss          app.BossInfo
	PartySize     uint8
	PlayersNumber uint8
}

type conStruct struct {
	count int
	sync.Mutex
	errChan app.ErrorChan
	wg      sync.WaitGroup

	attackerRow []app.PokemonInitialData
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
	_, ok = inDat.App.PokemonMovesBase[inDat.Pok.QuickMove]
	if !ok {
		inDat.NumberOfRuns = 100
		return
	}
	_, ok = inDat.App.PokemonMovesBase[inDat.Pok.ChargeMove]
	if !ok {
		inDat.NumberOfRuns = 100
		return
	}
	inDat.NumberOfRuns = 500
}

//ReturnCommonRaid return common raid results as an array of format pokemon+moveset:boss:result
func ReturnCommonRaid(inDat *app.IntialDataPve) ([][]app.CommonResult, error) {
	rand.Seed(time.Now().UnixNano())
	_, ok := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	if !ok {
		return [][]app.CommonResult{}, &customError{
			fmt.Sprintf("Unknown boss"),
		}
	}
	setUpRunsNumber(inDat)

	var err error
	conObj := conStruct{
		attackerRow: generateAttackersRow(inDat),

		wg:       sync.WaitGroup{},
		count:    0,
		resArray: [][]app.CommonResult{},
	}
	conObj.bossRow, err = generateBossRow(inDat)
	if err != nil {
		return [][]app.CommonResult{}, err
	}

	switch conObj.attackerRow == nil {
	case true:
		conObj.startForAll(inDat)
	default:
		conObj.startWithAttackerRow(inDat)
	}

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
		conObj.resArray = conObj.resArray[:300]
	default:
	}

	return conObj.resArray, nil
}

func (co *conStruct) startForAll(inDat *app.IntialDataPve) {
	co.resArray = make([][]app.CommonResult, 0, 1000)
	preRunArr := createAllMovesets(inDat)
	co.errChan = make(app.ErrorChan, len(preRunArr)*len(co.bossRow))

	for number, pok := range preRunArr {
		co.resArray = append(co.resArray, make([]app.CommonResult, 0, len(co.bossRow)))
		for _, boss := range co.bossRow {
			co.wg.Add(1)
			co.Lock()
			co.count++
			co.Unlock()
			for co.count > 20000 {

			}
			go func(currBoss app.BossInfo, p, q, ch string, i int) {
				defer co.wg.Done()
				singleResult, err := setOfRuns(commonPvpInData{
					App: inDat.App,
					Pok: app.PokemonInitialData{
						Name: p,

						QuickMove:  q,
						ChargeMove: ch,

						Level: inDat.Pok.Level,

						AttackIV:  inDat.Pok.AttackIV,
						DefenceIV: inDat.Pok.DefenceIV,
						StaminaIV: inDat.Pok.StaminaIV,

						IsShadow: inDat.Pok.IsShadow,
					},

					PartySize:     inDat.PartySize,
					PlayersNumber: inDat.PlayersNumber,

					Boss: currBoss,

					NumberOfRuns:  inDat.NumberOfRuns,
					FriendStage:   inDat.FriendStage,
					Weather:       inDat.Weather,
					DodgeStrategy: inDat.DodgeStrategy,
					AggresiveMode: inDat.AggresiveMode,
				})
				if err != nil {
					co.errChan <- err
					return
				}
				co.Lock()
				co.count--
				co.resArray[i] = append(co.resArray[i], singleResult)
				co.Unlock()
			}(boss, pok.Name, pok.Quick, pok.Charge, number)
		}
	}
	co.wg.Wait()
}

func (co *conStruct) startWithAttackerRow(inDat *app.IntialDataPve) {
	co.resArray = make([][]app.CommonResult, 0, len(co.attackerRow))
	co.errChan = make(app.ErrorChan, len(co.attackerRow)*len(co.bossRow))

	for number, singlePok := range co.attackerRow {
		co.resArray = append(co.resArray, make([]app.CommonResult, 0, len(co.bossRow)))
		for _, boss := range co.bossRow {
			//number of concurrent routines
			for co.count > 20000 {
			}
			co.wg.Add(1)
			co.Lock()
			co.count++
			co.Unlock()
			go func(currPok app.PokemonInitialData, currBoss app.BossInfo, i int) {
				defer co.wg.Done()
				singleResult, err := setOfRuns(commonPvpInData{
					App: inDat.App,
					Pok: currPok,

					PartySize:     inDat.PartySize,
					PlayersNumber: inDat.PlayersNumber,

					Boss: currBoss,

					NumberOfRuns:  inDat.NumberOfRuns,
					FriendStage:   inDat.FriendStage,
					Weather:       inDat.Weather,
					DodgeStrategy: inDat.DodgeStrategy,
					AggresiveMode: inDat.AggresiveMode,
				})
				if err != nil {
					co.errChan <- err
					return
				}
				co.Lock()
				co.resArray[i] = append(co.resArray[i], singleResult)
				co.count--
				co.Unlock()
			}(singlePok, boss, number)
		}
	}
}

type byAvgDamage [][]app.CommonResult

func (a byAvgDamage) Len() int { return len(a) }
func (a byAvgDamage) Less(i, j int) bool {
	var (
		avgDamageLeft  int32
		avgDamageRight int32
	)
	for _, value := range a[i] {
		avgDamageLeft += value.DAvg
	}
	for _, value := range a[j] {
		avgDamageRight += value.DAvg
	}
	return avgDamageLeft > avgDamageRight
}
func (a byAvgDamage) Swap(i, j int) { a[i], a[j] = a[j], a[i] }

func createAllMovesets(inDat *app.IntialDataPve) []preRun {
	pokemonsAll := make([]preRun, 0, 14000)
	// calculate boss params
	bossStat := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	bossLvl := tierMult[inDat.Boss.Tier]
	bossEffDef := (float32(15.0) + float32(bossStat.Def)) * bossLvl
	//define shadow bonus
	var shadowBonus float32 = 1.0
	if inDat.Pok.IsShadow {
		shadowBonus = 1.2
	}

	quickMBody := app.MoveBaseEntry{}
	chargeMBody := app.MoveBaseEntry{}

	for _, pok := range inDat.App.PokemonStatsBase {
		//skip trash pokemons
		if (pok.Atk + pok.Def + pok.Sta) < 400 {
			continue
		}
		for _, qm := range pok.QuickMoves {
			//skip empty moves
			if qm == "" {
				continue
			}
			for _, chm := range pok.ChargeMoves {
				//skip empty moves
				if chm == "" {
					continue
				}
				//calculate attacker stats
				effAtk := (float32(inDat.Pok.AttackIV) + float32(pok.Atk)) * shadowBonus * inDat.App.LevelData[int(inDat.Pok.Level/0.5)]
				quickMBody = inDat.App.PokemonMovesBase[qm]
				chargeMBody = inDat.App.PokemonMovesBase[chm]

				damageCharge := (float32(chargeMBody.Damage)*0.5*(effAtk/bossEffDef)*
					getMultipliers(&pok, &bossStat, &chargeMBody, inDat) + 1)
				//dps*dpe
				dpsCharge := damageCharge / (float32(chargeMBody.Cooldown) / 1000.0) * damageCharge / float32(-chargeMBody.Energy)

				dpsQuick := (float32(quickMBody.Damage)*0.5*(effAtk/bossEffDef)*
					getMultipliers(&pok, &bossStat, &quickMBody, inDat) + 1) / (float32(quickMBody.Cooldown) / 1000.0)

				pokemonsAll = append(pokemonsAll, preRun{
					Name:   pok.Title,
					Quick:  qm,
					Charge: chm,
					Dps:    dpsCharge + dpsQuick,
				})
			}
		}
	}
	sort.Sort(byDps(pokemonsAll))
	return pokemonsAll[:900]
}

type preRun struct {
	Name   string
	Quick  string
	Charge string

	Dps float32
}

type byDps []preRun

func (a byDps) Len() int           { return len(a) }
func (a byDps) Less(i, j int) bool { return a[i].Dps > a[j].Dps }
func (a byDps) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

func getMultipliers(attacker, defender *app.PokemonsBaseEntry, move *app.MoveBaseEntry, inDat *app.IntialDataPve) float32 {
	moveEfficiency := inDat.App.TypesData[move.MoveType]

	var stabMultiplier float32 = 1.0
	for _, pokType := range attacker.Type {
		if pokType == move.MoveType {
			stabMultiplier = 1.2
			break
		}
	}

	var seMultiplier float32 = 1.0
	for _, trgType := range defender.Type {
		if moveEfficiency[trgType] != 0.0 {
			seMultiplier *= moveEfficiency[trgType]
		}
	}

	weatherMultiplier, ok := weather[inDat.Weather][move.MoveType]
	if !ok {
		weatherMultiplier = 1.0
	}

	return stabMultiplier * friendship[inDat.FriendStage] * seMultiplier * weatherMultiplier
}

func generateBossRow(inDat *app.IntialDataPve) ([]app.BossInfo, error) {
	pokVal, _ := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	if len(pokVal.QuickMoves) == 0 && inDat.Boss.QuickMove == "" {
		return []app.BossInfo{}, &customError{"Boss quick movelist is empty and he doesn't have a quick move; select a quick move"}
	}
	if len(pokVal.ChargeMoves) == 0 && inDat.Boss.ChargeMove == "" {
		return []app.BossInfo{}, &customError{"Boss charge movelist is empty and he doesn't have a charge move; select a charge move"}
	}
	//create quick move list
	quickM := make([]string, 0, 1)
	moveVal, ok := inDat.App.PokemonMovesBase[inDat.Boss.QuickMove]
	switch ok {
	case true:
		quickM = append(quickM, moveVal.Title)
	default:
		for _, value := range pokVal.QuickMoves {
			//append only not elite moves
			_, ok := pokVal.EliteMoves[value]
			if !ok {
				quickM = append(quickM, value)
			}
		}
	}
	//make charge move list
	chargeM := make([]string, 0, 1)
	moveVal, ok = inDat.App.PokemonMovesBase[inDat.Boss.ChargeMove]
	switch ok {
	case true:
		chargeM = append(chargeM, moveVal.Title)
	default:
		for _, value := range pokVal.ChargeMoves {
			//skip return
			if value == "Return" {
				continue
			}
			//append only not elite moves
			_, ok := pokVal.EliteMoves[value]
			if !ok {
				chargeM = append(chargeM, value)
			}
		}
	}

	var maxMoves = 10
	if len(quickM) > maxMoves && len(chargeM) > maxMoves {
		maxMoves = 7
	}

	//limit movelist if needed
	if len(quickM) > maxMoves {
		newQList, err := limitMoves(&pokVal, quickM, inDat, false, maxMoves)
		if err != nil {
			return []app.BossInfo{}, err
		}
		quickM = newQList
	}

	//limit if needed
	if len(chargeM) > maxMoves {
		newChList, err := limitMoves(&pokVal, chargeM, inDat, true, maxMoves)
		if err != nil {
			return []app.BossInfo{}, err
		}
		chargeM = newChList
	}

	//create boss list
	bosses := make([]app.BossInfo, 0, 1)
	for _, valueQ := range quickM {
		for _, valueCH := range chargeM {
			bosses = append(bosses,
				app.BossInfo{
					Name:       pokVal.Title,
					QuickMove:  valueQ,
					ChargeMove: valueCH,
					Tier:       inDat.Boss.Tier,
				})
		}
	}
	return bosses, nil

}

//limitMoves limits boss moves to n
func limitMoves(pok *app.PokemonsBaseEntry, moves []string, inDat *app.IntialDataPve, isCharge bool, n int) ([]string, error) {
	limiter := make([]moveLimiter, 0, len(moves))
	hiddenPower := make([]moveLimiter, 0, 0)
	newList := make([]string, 0, n)

	pokTyping := pok.Type

	//calculate dps / pds*dpe for every move
	for _, moveTitle := range moves {
		moveBody := inDat.App.PokemonMovesBase[moveTitle]
		stab := 1.0
		weatherMult := 1.0

		for _, singleType := range pokTyping {
			if singleType == moveBody.MoveType {
				stab = 1.2
				break
			}
		}

		val, ok := weather[inDat.Weather][moveBody.MoveType]
		if ok {
			weatherMult = float64(val)
		}

		dps := 0.0
		index := -1
		switch isCharge {
		case true:
			damage := float64(moveBody.Damage) * weatherMult * stab
			dps = damage / (float64(moveBody.Cooldown) / 1000) * damage / float64(-moveBody.Energy)
		default:
			dps = float64(moveBody.Damage) * weatherMult * stab / (float64(moveBody.Cooldown) / 1000)
			dps *= dps
			index = strings.Index(moveTitle, "Hidden Power")
		}

		if dps == 0.0 {
			return []string{}, &customError{
				"Boss has zero dps",
			}
		}

		switch index != -1 {
		case true:
			hiddenPower = append(hiddenPower, moveLimiter{
				MoveName: moveTitle,
				Dps:      dps,
			})
		default:
			limiter = append(limiter, moveLimiter{
				MoveName: moveTitle,
				Dps:      dps,
			})
		}
	}

	switch len(hiddenPower) > 0 {
	case true:
		//sort by dps
		sort.Sort(byDpsMoves(limiter))
		sort.Sort(byDpsMoves(hiddenPower))
		//get top-6 if possible
		switch len(limiter) >= 6 {
		case true:
			limiter = limiter[:6]
		default:
		}
		//add 4 hidden powers
		for i := 0; len(limiter) < n; i++ {
			limiter = append(limiter, hiddenPower[i])
		}
	default:
		//sort by dps
		sort.Sort(byDpsMoves(limiter))
		//get top-10
		limiter = limiter[:n]
	}
	//create new movelist
	for _, mName := range limiter {
		newList = append(newList, mName.MoveName)
	}
	return newList, nil
}

type moveLimiter struct {
	MoveName string
	Dps      float64
}

type byDpsMoves []moveLimiter

func (a byDpsMoves) Len() int           { return len(a) }
func (a byDpsMoves) Less(i, j int) bool { return a[i].Dps > a[j].Dps }
func (a byDpsMoves) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

//generateAttackersRow generates attacker row for simulations with know attacker name
func generateAttackersRow(inDat *app.IntialDataPve) []app.PokemonInitialData {
	//get pokemon from the base
	pokVal, ok := inDat.App.PokemonStatsBase[inDat.Pok.Name]
	if !ok {
		return nil
	}

	//get quick moves list
	quickM := make([]string, 0, 1)
	moveVal, ok := inDat.App.PokemonMovesBase[inDat.Pok.QuickMove]
	switch ok {
	case true:
		quickM = append(quickM, moveVal.Title)
	default:
		for _, value := range pokVal.QuickMoves {
			quickM = append(quickM, value)
		}
	}
	//get charge moves list
	chargeM := make([]string, 0, 1)
	moveVal, ok = inDat.App.PokemonMovesBase[inDat.Pok.ChargeMove]
	switch ok {
	case true:
		chargeM = append(chargeM, moveVal.Title)
	default:
		for _, value := range pokVal.ChargeMoves {
			chargeM = append(chargeM, value)
		}
	}

	//make entry for every moveset
	pokemons := make([]app.PokemonInitialData, 0, 1)
	for _, valueQ := range quickM {
		for _, valueCH := range chargeM {
			pokemons = append(pokemons,
				app.PokemonInitialData{
					Name: inDat.Pok.Name,

					QuickMove:  valueQ,
					ChargeMove: valueCH,

					Level: inDat.Pok.Level,

					AttackIV:  inDat.Pok.AttackIV,
					DefenceIV: inDat.Pok.DefenceIV,
					StaminaIV: inDat.Pok.StaminaIV,

					IsShadow: inDat.Pok.IsShadow,
				})

		}
	}
	return pokemons
}

//setOfRuns starts new set of pve's, returns set result and error
func setOfRuns(inDat commonPvpInData) (app.CommonResult, error) {
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

	result.AName = inDat.Pok.Name
	result.AQ = inDat.Pok.QuickMove
	result.ACh = inDat.Pok.ChargeMove

	result.BName = inDat.Boss.Name
	result.BQ = inDat.Boss.QuickMove
	result.BCh = inDat.Boss.ChargeMove

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

//simulatorRun makes a single raid simulator run (battle)
func simulatorRun(inDat *commonPvpInData) (runResult, error) {
	obj := pveObject{}

	obj.app = inDat.App

	obj.Tier = inDat.Boss.Tier
	obj.Timer = tierTimer[inDat.Boss.Tier]
	obj.AggresiveMode = inDat.AggresiveMode

	obj.PartySize = inDat.PartySize
	obj.PlayersNumber = inDat.PlayersNumber
	obj.DodgeStrategy = inDat.DodgeStrategy * 25

	obj.FriendStage = friendship[inDat.FriendStage]
	obj.Weather = weather[inDat.Weather]
	obj.Attacker = make([]pokemon, 1, 1)

	err := obj.makeNewCharacter(&inDat.Pok, &obj.Attacker[obj.ActivePok])
	if err != nil {
		return runResult{}, err
	}

	err = obj.makeNewBoss(&inDat.Boss, &obj.Boss)
	if err != nil {
		return runResult{}, err
	}

	err = obj.initializePve(inDat.Pok.Name, inDat.Boss.Name, 0)
	if err != nil {
		return runResult{}, err
	}

	err = obj.letsBattle()
	if err != nil {
		return runResult{}, err
	}

	if obj.Boss.hp < 0 {
		obj.Boss.hp = 0
	}
	return runResult{
		isWin:        obj.Boss.hp < 1,
		damageDealt:  tierHP[obj.Tier] - obj.Boss.hp,
		timeRemained: obj.Timer,
		fainted:      uint32(inDat.PartySize - obj.PartySize),
	}, nil
}

type runResult struct {
	damageDealt  int32
	timeRemained int32
	fainted      uint32
	isWin        bool
}

func (obj *pveObject) initializePve(attacker, boss string, i int) error {
	obj.Attacker[i].hp = obj.Attacker[i].maxHP

	obj.Attacker[i].damageRegistered = true
	obj.Attacker[i].energyRegistered = true

	obj.Boss.damageRegistered = true
	obj.Boss.energyRegistered = true

	err := obj.Attacker[i].quickMove.setMultipliers(attacker, boss, obj, false)
	if err != nil {
		return err
	}
	err = obj.Attacker[i].chargeMove.setMultipliers(attacker, boss, obj, false)
	if err != nil {
		return err
	}

	err = obj.Boss.quickMove.setMultipliers(boss, attacker, obj, true)
	if err != nil {
		return err
	}
	err = obj.Boss.chargeMove.setMultipliers(boss, attacker, obj, true)
	if err != nil {
		return err
	}
	return nil
}

func (m *move) setMultipliers(attacker, defender string, obj *pveObject, isBoss bool) error {
	//get move efficiency matrix
	moveEfficiency := obj.app.TypesData[m.moveType]

	var stabMultiplier float32 = 1.0
	for _, pokType := range obj.app.PokemonStatsBase[attacker].Type {
		if pokType == m.moveType {
			stabMultiplier = 1.2
			break
		}
	}

	var seMultiplier float32 = 1.0
	for _, trgType := range obj.app.PokemonStatsBase[defender].Type {
		if moveEfficiency[trgType] != 0.0 {
			seMultiplier *= moveEfficiency[trgType]
		}
	}

	weatherMultiplier, ok := obj.Weather[m.moveType]
	if !ok {
		weatherMultiplier = 1.0
	}

	switch isBoss {
	case true:
		m.multiplier = stabMultiplier * seMultiplier * weatherMultiplier
	default:
		m.multiplier = stabMultiplier * obj.FriendStage * seMultiplier * weatherMultiplier
	}
	return nil
}

func (obj *pveObject) letsBattle() error {
	obj.Timer -= 3000

	for obj.PartySize > 0 && obj.Timer > 0 && obj.Boss.hp > 0 {
		err := obj.nextRound()
		if err != nil {
			return err
		}

		//select next
		if obj.Attacker[obj.ActivePok].hp <= 0 {
			obj.PartySize--
			obj.Attacker[obj.ActivePok].revive()

			//switch pokemon
			obj.substructPause(1000)
			//switch party
			if obj.PartySize == 12 || obj.PartySize == 6 {
				obj.substructPause(10000)
				continue
			}
		}
	}
	return nil
}

func (pok *pokemon) revive() {
	pok.hp = pok.maxHP
	pok.energy = app.Energy(0)

	pok.action = 0
	pok.damageRegistered = true
	pok.energyRegistered = true

	pok.timeToDamage = 0
	pok.timeToEnergy = 0
	pok.moveCooldown = 0
}

//substructPause substructs oause from raid timer and sets up boss behavior
func (obj *pveObject) substructPause(pause int32) {
	switch obj.AggresiveMode {
	case true:
		//if there is remaining cooldown time (but action is already finished), memorize that time and nullify cooldown
		var tail int32
		if obj.Boss.timeToEnergy == 0 && obj.Boss.timeToDamage == 0 {
			tail = obj.Boss.moveCooldown
			obj.Boss.moveCooldown = 0
		}
		//if there is no cooldown, make a new desision
		if obj.Boss.moveCooldown == 0 {
			obj.Boss.whatToDoNextBoss(obj)
		}
		//add tail
		obj.Boss.timeToEnergy += tail
		obj.Boss.timeToDamage += tail
		obj.Boss.moveCooldown += tail

		//substract pause time
		if obj.Boss.timeToEnergy > 0 {
			switch obj.Boss.timeToEnergy > pause {
			case true:
				obj.Boss.timeToEnergy -= pause
			default:
				obj.Boss.timeToEnergy -= obj.Boss.timeToEnergy
			}
		}
		if obj.Boss.timeToDamage > 0 {
			switch obj.Boss.timeToDamage > pause {
			case true:
				obj.Boss.timeToDamage -= pause
			default:
				obj.Boss.timeToDamage -= obj.Boss.timeToDamage
			}
		}
		switch obj.Boss.moveCooldown > pause {
		case true:
			obj.Boss.moveCooldown -= pause
		default:
			obj.Boss.moveCooldown -= obj.Boss.moveCooldown
		}
	default:
		//start new action next time
		obj.Boss.timeToEnergy = 0
		obj.Boss.timeToDamage = 0
		obj.Boss.moveCooldown = 0
		obj.Boss.action = 0
		obj.Boss.damageRegistered = true
		obj.Boss.energyRegistered = true
	}
	//substruct pause
	switch obj.Timer > pause {
	case true:
		obj.Timer -= pause
	default:
		obj.Timer -= obj.Timer
	}
}

func (obj *pveObject) nextRound() error {
	//deal damage, get energy
	err := obj.Boss.turn(obj, &obj.Attacker[obj.ActivePok])
	if err != nil {
		return err
	}
	err = obj.Attacker[obj.ActivePok].turn(obj, &obj.Boss)
	if err != nil {
		return err
	}

	//if hp is below 1, force stop fight
	if obj.Attacker[obj.ActivePok].hp < 1 {
		return nil
	}
	if obj.Boss.hp < 1 {
		return nil
	}

	//if all actions are done, decide next one
	if obj.Boss.moveCooldown == 0 {
		obj.Boss.whatToDoNextBoss(obj)
	}
	if obj.Attacker[obj.ActivePok].moveCooldown == 0 {
		obj.Attacker[obj.ActivePok].whatToDoNext(obj)
	}

	err = obj.decreaseTimer()
	if err != nil {
		return err
	}
	return nil
}

//turn makes available actions: get energy, deal damage
func (pok *pokemon) turn(obj *pveObject, defender *pokemon) error {
	if pok.timeToEnergy < 0 || pok.timeToDamage < 0 || pok.moveCooldown < 0 {
		return &customError{
			fmt.Sprintf("Negative timer! Time to energy: %v, time to damamge: %v, cooldown: %v", pok.timeToEnergy, pok.timeToDamage, pok.moveCooldown),
		}
	}
	if pok.timeToEnergy > 0 {
		return nil
	}
	//get energy
	if !pok.energyRegistered {
		err := pok.getEnergy()
		if err != nil {
			return err
		}
	}
	if pok.timeToDamage > 0 {
		return nil
	}
	//deal damage
	if !pok.damageRegistered {
		err := pok.dealDamage(defender, obj)
		if err != nil {
			return err
		}
	}
	return nil
}

func (pok *pokemon) getEnergy() error {
	switch pok.action {
	case 2:
		pok.energyRegistered = true
		pok.energy.AddEnergy(pok.quickMove.energy)
	case 3:
		pok.energyRegistered = true
		pok.energy.AddEnergy(pok.chargeMove.energy)
	default:
		return &customError{
			fmt.Sprintf("Attempt to get energy with zero action"),
		}
	}
	return nil
}

func (pok *pokemon) dealDamage(defender *pokemon, obj *pveObject) error {
	var damage int32
	//calculate damage
	switch pok.action {
	case 2:
		damage = int32(float32(pok.quickMove.damage)*0.5*(pok.effectiveAttack/defender.effectiveDefence)*pok.quickMove.multiplier) + 1
	case 3:
		damage = int32(float32(pok.chargeMove.damage)*0.5*(pok.effectiveAttack/defender.effectiveDefence)*pok.chargeMove.multiplier*dodge(pok, defender, obj)) + 1
	default:
		return &customError{
			fmt.Sprintf("Attempt to deal damage with zero action"),
		}
	}
	pok.damageRegistered = true
	defender.hp -= damage

	//if defender is boss give him additinal number energy
	switch defender.isBoss {
	case true:
		defender.energy.AddEnergy(int16(math.Round(float64(int32(obj.PlayersNumber)*damage) * 0.5)))
	default:
		defender.energy.AddEnergy(int16(math.Round(float64(damage) * 0.5)))
	}
	return nil

}

func dodge(attacker, defender *pokemon, obj *pveObject) float32 {
	if obj.DodgeStrategy == 0 {
		return 1
	}
	if defender.isBoss {
		return 1
	}
	if rand.Intn(100) > obj.DodgeStrategy {
		return 1
	}

	var damage int32
	switch defender.action {
	case 2:
		damage = int32(float32(defender.quickMove.damage)*0.5*(defender.effectiveAttack/attacker.effectiveDefence)*defender.quickMove.multiplier) + 1
		defender.energy.AddEnergy(-defender.quickMove.energy)
	case 3:
		damage = int32(float32(defender.chargeMove.damage)*0.5*(defender.effectiveAttack/attacker.effectiveDefence)*defender.chargeMove.multiplier) + 1
		defender.energy.AddEnergy(-defender.chargeMove.energy)
	default:
		defender.damageRegistered = true
		defender.energyRegistered = true

		defender.timeToDamage = 0
		defender.timeToEnergy = 0
		defender.moveCooldown = 500
	}

	attacker.hp += damage
	attacker.energy.AddEnergy(-int16(math.Round(float64(damage) * 0.5)))

	return 0.25
}

func (pok *pokemon) whatToDoNextBoss(obj *pveObject) {
	pok.energyRegistered = false
	pok.damageRegistered = false
	const pause = 2000.0
	//check if energy is enogh to make a charge hit
	if int16(pok.energy) < -pok.chargeMove.energy {
		//make a quick hit
		pok.action = 2
		pok.timeToEnergy = pause + pok.quickMove.damageWindow
		pok.timeToDamage = pause + pok.quickMove.damageWindow + pok.quickMove.dodgeWindow
		pok.moveCooldown = pause + pok.quickMove.cooldown
		return
	}
	//flip coin
	coinflip := rand.Intn(10)
	switch coinflip < 5 {
	case true:
		//make a quick hit
		pok.action = 2
		pok.timeToEnergy = pause + pok.quickMove.damageWindow
		pok.timeToDamage = pause + pok.quickMove.damageWindow + pok.quickMove.dodgeWindow
		pok.moveCooldown = pause + pok.quickMove.cooldown
	default:
		//make a charge hit
		pok.action = 3
		pok.timeToEnergy = pause + pok.chargeMove.damageWindow
		pok.timeToDamage = pause + pok.chargeMove.damageWindow + pok.chargeMove.dodgeWindow
		pok.moveCooldown = pause + pok.chargeMove.cooldown
	}
	return
}

func (pok *pokemon) whatToDoNext(obj *pveObject) {
	pok.energyRegistered = false
	pok.damageRegistered = false
	//check if energy is enogh to make a charge hit
	if int16(pok.energy) < -pok.chargeMove.energy {
		//make a quick hit
		pok.action = 2
		pok.timeToEnergy = pok.quickMove.damageWindow
		pok.timeToDamage = pok.quickMove.damageWindow + pok.quickMove.dodgeWindow
		pok.moveCooldown = pok.quickMove.cooldown
		return
	}
	//make a charge hit
	pok.action = 3
	pok.timeToEnergy = pok.chargeMove.damageWindow
	pok.timeToDamage = pok.chargeMove.damageWindow + pok.chargeMove.dodgeWindow
	pok.moveCooldown = pok.chargeMove.cooldown
	return
}

func (obj *pveObject) decreaseTimer() error {
	if obj.Boss.moveCooldown == 0 {
		return &customError{
			fmt.Sprintf("Zero boss cooldown"),
		}
	}
	if obj.Attacker[obj.ActivePok].moveCooldown == 0 {
		return &customError{
			fmt.Sprintf("Zero cooldown"),
		}
	}

	//calculate next delta for the both participants
	pokemonTimerDelta := obj.Attacker[obj.ActivePok].returnTimer()
	bossTimerDelta := obj.Boss.returnTimer()

	switch pokemonTimerDelta > bossTimerDelta {
	case true:
		//prevent negative timer
		if bossTimerDelta > obj.Timer {
			bossTimerDelta = obj.Timer
		}
		obj.substructTimer(bossTimerDelta)
	default:
		//prevent negative timer
		if pokemonTimerDelta > obj.Timer {
			pokemonTimerDelta = obj.Timer
		}
		obj.substructTimer(pokemonTimerDelta)
	}
	return nil
}

//returnTimer return lowest of cooldowns
func (pok *pokemon) returnTimer() int32 {
	switch true {
	case pok.timeToEnergy > 0:
		return pok.timeToEnergy
	case pok.timeToDamage > 0:
		return pok.timeToDamage
	}
	return pok.moveCooldown
}

//substructTimer substruct calculated timer delta
func (obj *pveObject) substructTimer(timerDelta int32) {
	//for attacker
	if obj.Attacker[obj.ActivePok].timeToEnergy > 0 {
		obj.Attacker[obj.ActivePok].timeToEnergy -= timerDelta
	}
	if obj.Attacker[obj.ActivePok].timeToDamage > 0 {
		obj.Attacker[obj.ActivePok].timeToDamage -= timerDelta
	}
	obj.Attacker[obj.ActivePok].moveCooldown -= timerDelta

	//for boss
	if obj.Boss.timeToEnergy > 0 {
		obj.Boss.timeToEnergy -= timerDelta
	}
	if obj.Boss.timeToDamage > 0 {
		obj.Boss.timeToDamage -= timerDelta
	}
	obj.Boss.moveCooldown -= timerDelta

	//for object
	obj.Timer -= timerDelta
}
