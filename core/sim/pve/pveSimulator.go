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

//PveObject contains single pve data
type PveObject struct {
	Tier          uint8
	PartySize     uint8
	PlayersNumber uint8
	FriendStage   float32
	Weather       map[int]float32

	Attacker []pokemon
	Boss     pokemon

	Timer     int32
	app       *app.SimApp
	ActivePok int

	AggresiveMode bool
	DodgeStrategy uint8
}

type CommonPvpInData struct {
	App *app.SimApp
	Pok PokemonInitialData

	PartySize     uint8
	PlayersNumber uint8

	Boss BossInfo

	NumberOfRuns  int
	FriendStage   int
	Weather       int
	DodgeStrategy uint8
	AggresiveMode bool
}

type IntialDataPve struct {
	App *app.SimApp
	Pok PokemonInitialData

	PartySize     uint8
	PlayersNumber uint8

	Boss BossInfo

	NumberOfRuns  int
	FriendStage   int
	Weather       int
	DodgeStrategy uint8
	AggresiveMode bool
}

type conStruct struct {
	attackerRow []PokemonInitialData
	bossRow     []BossInfo
	resArray    [][]CommonResult

	errChan app.ErrorChan
	wg      sync.WaitGroup
	count   int
	sync.Mutex
}

func CommonSimulatorWrapper(inDat IntialDataPve) ([][]CommonResult, error) {
	rand.Seed(time.Now().UnixNano())
	_, ok := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	if !ok {
		return [][]CommonResult{}, fmt.Errorf("Unknown boss")
	}
	if inDat.Boss.Tier > 5 || inDat.Boss.Tier < 0 {
		return [][]CommonResult{}, fmt.Errorf("Unknown raid tier")
	}
	if inDat.FriendStage > 8 || inDat.FriendStage < 0 {
		return [][]CommonResult{}, fmt.Errorf("Unknown friendship tier")
	}
	if inDat.PlayersNumber > 20 || inDat.PlayersNumber < 1 {
		return [][]CommonResult{}, fmt.Errorf("Wrong players number")
	}
	if inDat.PartySize > 18 || inDat.PartySize < 1 {
		return [][]CommonResult{}, fmt.Errorf("Wrong party size")
	}
	if inDat.Weather > 7 || inDat.Weather < 0 {
		return [][]CommonResult{}, fmt.Errorf("Unknown weather")
	}

	var err error
	conObj := conStruct{
		attackerRow: generateAttackersRow(&inDat),

		wg:       sync.WaitGroup{},
		count:    0,
		resArray: [][]CommonResult{},
	}
	conObj.bossRow, err = generateBossRow(&inDat)
	if err != nil {
		return [][]CommonResult{}, err
	}

	switch conObj.attackerRow == nil {
	case true:
		conObj.startForAll(&inDat)
	default:
		conObj.startWithAttackerRow(&inDat)
	}

	conObj.wg.Wait()

	close(conObj.errChan)
	errStr := conObj.errChan.Flush()
	if errStr != "" {
		return [][]CommonResult{}, fmt.Errorf(errStr)
	}

	sort.Sort(byAvgDamage(conObj.resArray))

	switch len(conObj.resArray) > 300 {
	case true:
		conObj.resArray = conObj.resArray[:300]
	default:
	}

	return conObj.resArray, nil
}

func (co *conStruct) startForAll(inDat *IntialDataPve) {
	co.resArray = make([][]CommonResult, 0, 1000)
	preRunArr := createAllMovesets(inDat)
	co.errChan = make(app.ErrorChan, len(preRunArr)*len(co.bossRow))

	for number, pok := range preRunArr {
		co.resArray = append(co.resArray, make([]CommonResult, 0, len(co.bossRow)))
		for _, boss := range co.bossRow {
			co.wg.Add(1)
			co.Lock()
			co.count++
			co.Unlock()
			for co.count > 20000 {

			}
			go func(currBoss BossInfo, p, q, ch string, i int) {
				defer co.wg.Done()
				singleResult, err := setOfRuns(CommonPvpInData{
					App: inDat.App,
					Pok: PokemonInitialData{
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

func (co *conStruct) startWithAttackerRow(inDat *IntialDataPve) {
	co.resArray = make([][]CommonResult, 0, len(co.attackerRow))
	co.errChan = make(app.ErrorChan, len(co.attackerRow)*len(co.bossRow))

	for number, singlePok := range co.attackerRow {
		co.resArray = append(co.resArray, make([]CommonResult, 0, len(co.bossRow)))
		for _, boss := range co.bossRow {
			//number of concurrent routines
			for co.count > 20000 {
			}
			co.wg.Add(1)
			co.Lock()
			co.count++
			co.Unlock()
			go func(currPok PokemonInitialData, currBoss BossInfo, i int) {
				defer co.wg.Done()
				singleResult, err := setOfRuns(CommonPvpInData{
					App: inDat.App,
					Pok: currPok,

					PartySize:     inDat.PartySize,
					PlayersNumber: inDat.PlayersNumber,

					Boss: currBoss,

					NumberOfRuns:  inDat.NumberOfRuns,
					FriendStage:   inDat.FriendStage,
					Weather:       inDat.Weather,
					DodgeStrategy: inDat.DodgeStrategy,
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

type byAvgDamage [][]CommonResult

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

func createAllMovesets(inDat *IntialDataPve) []preRun {
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

func getMultipliers(attacker, defender *app.PokemonsBaseEntry, move *app.MoveBaseEntry, inDat *IntialDataPve) float32 {
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

func generateBossRow(inDat *IntialDataPve) ([]BossInfo, error) {
	pokVal, _ := inDat.App.PokemonStatsBase[inDat.Boss.Name]

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
	//limit movelist if needed
	if len(quickM) > 10 {
		newQList, err := limitMoves(&pokVal, quickM, inDat, false)
		if err != nil {
			return []BossInfo{}, err
		}
		quickM = newQList
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
	//limit if needed
	if len(chargeM) > 10 {
		newChList, err := limitMoves(&pokVal, chargeM, inDat, true)
		if err != nil {
			return []BossInfo{}, err
		}
		chargeM = newChList
	}
	//create boss list
	bosses := make([]BossInfo, 0, 1)
	for _, valueQ := range quickM {
		for _, valueCH := range chargeM {
			bosses = append(bosses,
				BossInfo{
					Name:       pokVal.Title,
					QuickMove:  valueQ,
					ChargeMove: valueCH,
					Tier:       inDat.Boss.Tier,
				})
		}
	}
	return bosses, nil

}

//limitMoves limits boss moves to 10
func limitMoves(pok *app.PokemonsBaseEntry, moves []string, inDat *IntialDataPve, isCharge bool) ([]string, error) {
	limiter := make([]moveLimiter, 0, len(moves))
	hiddenPower := make([]moveLimiter, 0, 0)
	newList := make([]string, 0, 10)

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
			return []string{}, fmt.Errorf("Boss has zero dps")
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
		for i := 0; len(limiter) < 10; i++ {
			limiter = append(limiter, hiddenPower[i])
		}
	default:
		//sort by dps
		sort.Sort(byDpsMoves(limiter))
		//get top-10
		limiter = limiter[:10]
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
func generateAttackersRow(inDat *IntialDataPve) []PokemonInitialData {
	//get pokemon from vase
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
	pokemons := make([]PokemonInitialData, 0, 1)
	for _, valueQ := range quickM {
		for _, valueCH := range chargeM {
			pokemons = append(pokemons,
				PokemonInitialData{
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
func setOfRuns(inDat CommonPvpInData) (CommonResult, error) {
	result := CommonResult{}
	result.DMin = tierHP[inDat.Boss.Tier]
	result.TMin = tierTimer[inDat.Boss.Tier]
	result.FMin = uint32(inDat.PartySize)

	for i := 0; i < inDat.NumberOfRuns; i++ {
		res, err := simulatorRun(inDat)
		if err != nil {
			return CommonResult{}, err
		}
		result.collect(&res)
	}

	result.DAvg = int32(float64(result.DAvg) / float64(inDat.NumberOfRuns))
	result.TAvg = int32(float64(result.TAvg) / float64(inDat.NumberOfRuns))

	result.AName = inDat.Pok.Name
	result.AQ = inDat.Pok.QuickMove
	result.ACh = inDat.Pok.ChargeMove

	result.BName = inDat.Boss.Name
	result.BQ = inDat.Boss.QuickMove
	result.BCh = inDat.Boss.ChargeMove

	return result, nil
}

type CommonResult struct {
	AName string
	AQ    string
	ACh   string

	BName string
	BQ    string
	BCh   string

	DMin int32
	DMax int32
	DAvg int32

	TMin int32
	TMax int32
	TAvg int32

	FMin uint32
	FMax uint32

	NOfWins uint32
}

//collect collects run
func (cr *CommonResult) collect(run *runResult) {
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
func simulatorRun(inDat CommonPvpInData) (runResult, error) {
	obj := PveObject{}

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
	return runResult{
		isWin:        obj.Boss.hp < 1,
		damageDealt:  tierHP[obj.Tier] - obj.Boss.hp,
		timeRemained: obj.Timer,
		fainted:      uint32(inDat.PartySize - obj.PartySize),
	}, nil
}

type runResult struct {
	isWin        bool
	damageDealt  int32
	timeRemained int32
	fainted      uint32
}

func (obj *PveObject) initializePve(attacker, boss string, i int) error {
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

func (m *move) setMultipliers(attacker, defender string, obj *PveObject, isBoss bool) error {
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

func (obj *PveObject) letsBattle() error {
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

func (p *pokemon) revive() {
	p.hp = p.maxHP
	p.energy = Energy(0)

	p.action = 0
	p.damageRegistered = true
	p.energyRegistered = true

	p.timeToDamage = 0
	p.timeToEnergy = 0
	p.moveCooldown = 0
}

//substructPause substructs oause from raid timer and sets up boss behavior
func (obj *PveObject) substructPause(pause int32) {
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

func (obj *PveObject) nextRound() error {
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
func (pok *pokemon) turn(obj *PveObject, defender *pokemon) error {
	if pok.timeToEnergy < 0 || pok.timeToDamage < 0 || pok.moveCooldown < 0 {
		return fmt.Errorf("Negative timer! Time to energy: %v, time to damamge: %v, cooldown: %v", pok.timeToEnergy, pok.timeToDamage, pok.moveCooldown)
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
		pok.energy.addEnergy(pok.quickMove.energy)
	case 3:
		pok.energyRegistered = true
		pok.energy.addEnergy(pok.chargeMove.energy)
	default:
		return fmt.Errorf("Attempt to get energy with zero action")
	}
	return nil
}

func (pok *pokemon) dealDamage(defender *pokemon, obj *PveObject) error {
	var damage int32
	//calculate damage
	switch pok.action {
	case 2:
		damage = int32(float32(pok.quickMove.damage)*0.5*(pok.effectiveAttack/defender.effectiveDefence)*pok.quickMove.multiplier) + 1
	case 3:
		damage = int32(float32(pok.chargeMove.damage)*0.5*(pok.effectiveAttack/defender.effectiveDefence)*pok.chargeMove.multiplier) + 1
	default:
		return fmt.Errorf("Attempt to deal damage with zero action")
	}
	pok.damageRegistered = true
	defender.hp -= damage

	//if defender is boss give him additinal number energy
	switch defender.isBoss {
	case true:
		defender.energy.addEnergy(int16(math.Round(float64(int32(obj.PlayersNumber)*damage) * 0.5)))
	default:
		defender.energy.addEnergy(int16(math.Round(float64(damage) * 0.5)))
	}
	return nil

}

func (pok *pokemon) whatToDoNextBoss(obj *PveObject) {
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

func (pok *pokemon) whatToDoNext(obj *PveObject) {
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

func (obj *PveObject) decreaseTimer() error {
	if obj.Boss.moveCooldown == 0 {
		return fmt.Errorf("zero boss cooldown")
	}
	if obj.Attacker[obj.ActivePok].moveCooldown == 0 {
		return fmt.Errorf("zero cooldown")
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
func (obj *PveObject) substructTimer(timerDelta int32) {
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
