package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"math"
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
			co.wg.Add(1)
			co.Lock()
			co.count++
			co.Unlock()
			//limit rountines number
			for co.count > 20000 {
			}

			go func(currBoss app.BossInfo, pok preRun, i int) {
				defer co.wg.Done()

				singleResult, err := setOfRuns(pvpeInitialData{
					CustomMoves: co.inDat.CustomMoves,
					App:         co.inDat.App,
					AttackerPokemon: []app.PokemonInitialData{{
						Name: pok.Name,

						QuickMove:  pok.Quick,
						ChargeMove: pok.Charge,

						Level: co.inDat.Pok.Level,

						AttackIV:  co.inDat.Pok.AttackIV,
						DefenceIV: co.inDat.Pok.DefenceIV,
						StaminaIV: co.inDat.Pok.StaminaIV,

						IsShadow: co.inDat.Pok.IsShadow,
					}},

					BoostSlotPokemon: co.selectBoosterFor(pok),

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

	fmt.Println("Finished")
}

func (co *conStruct) selectBoosterFor(pok preRun) app.PokemonInitialData {
	if co.boosterRow == nil || len(co.boosterRow) == 0 {
		return app.PokemonInitialData{}
	}

	pokQuickType := co.inDat.App.PokemonMovesBase[pok.Quick].MoveType
	pokChargeType := co.inDat.App.PokemonMovesBase[pok.Charge].MoveType

	selectedBooster := preRun{}
	for _, booster := range co.boosterRow {
		matches := 0
		for _, boosterType := range co.inDat.App.PokemonStatsBase[booster.Name].Type {
			if pokQuickType == boosterType {
				matches++
			}
			if pokChargeType == boosterType {
				matches++
			}
		}
		if matches == 2 {
			selectedBooster = booster
			break
		}
		if matches == 1 {
			if selectedBooster.Name == "" {
				selectedBooster = booster
			}
		}
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

type pveObject struct {
	app         *app.SimApp
	CustomMoves *map[string]app.MoveBaseEntry

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

func (pveo *pveObject) switchToNext() {

}

//simulatorRun makes a single raid simulator run (battle)
func simulatorRun(inDat *pvpeInitialData) (runResult, error) {
	obj := pveObject{
		CustomMoves: inDat.CustomMoves,
		app:         inDat.App,

		Tier:          inDat.Boss.Tier,
		Timer:         tierTimer[inDat.Boss.Tier],
		AggresiveMode: inDat.AggresiveMode,

		PartySize:     inDat.PartySize,
		PlayersNumber: inDat.PlayersNumber,
		DodgeStrategy: inDat.DodgeStrategy * 25,

		FriendStage: friendship[inDat.FriendStage],
		Weather:     weather[inDat.Weather],
		Attacker:    make([]pokemon, 0, 1),
	}

	if inDat.BoostSlotPokemon.Name != "" {
		if err := obj.addNewCharacter(&inDat.BoostSlotPokemon); err != nil {
			return runResult{}, err
		}
	}

	for _, pok := range inDat.AttackerPokemon {
		if err := obj.addNewCharacter(&pok); err != nil {
			return runResult{}, err
		}
	}

	if err := obj.addBoss(&inDat.Boss); err != nil {
		return runResult{}, err
	}

	err := obj.initializePve(inDat.AttackerPokemon[0].Name, inDat.Boss.Name, 0)
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
