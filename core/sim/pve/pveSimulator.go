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
}

func CommonSimulatorWrapper(inDat IntialDataPve) error {
	rand.Seed(time.Now().UnixNano())
	_, ok := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	if !ok {
		return fmt.Errorf("Unknown boss")
	}
	if inDat.Boss.Tier > 5 || inDat.Boss.Tier < 0 {
		return fmt.Errorf("Unknown raid tier")
	}
	if inDat.FriendStage > 8 || inDat.FriendStage < 0 {
		return fmt.Errorf("Unknown friendship tier")
	}
	if inDat.PlayersNumber > 20 || inDat.PlayersNumber < 1 {
		return fmt.Errorf("Wrong players number")
	}
	if inDat.PartySize > 18 || inDat.PartySize < 1 {
		return fmt.Errorf("Wrong party size")
	}
	if inDat.Weather > 7 || inDat.Weather < 0 {
		return fmt.Errorf("Unknown weather")
	}
	attackerRow := generateAttackersRow(&inDat)
	bossRow := generateBossRow(&inDat)
	if attackerRow == nil {

	}

	wg := sync.WaitGroup{}
	count := 0
	mu := sync.RWMutex{}
	resArray := [][]CommonResult{}

	switch attackerRow == nil {
	case true:
		resArray = make([][]CommonResult, 0, 1000)
		for number, pok := range createAllMovesets(&inDat) {
			resArray = append(resArray, make([]CommonResult, 0, len(bossRow)))
			for _, boss := range bossRow {
				wg.Add(1)
				mu.Lock()
				count++
				mu.Unlock()
				for count > 20000 {

				}
				go func(currBoss BossInfo, p, q, ch string, i int) {
					defer wg.Done()
					singleResult, err := CommonSimulator(CommonPvpInData{
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
						fmt.Println(err)
					}
					mu.Lock()
					count--
					resArray[i] = append(resArray[i], singleResult)
					mu.Unlock()
				}(boss, pok.Name, pok.Quick, pok.Charge, number)
			}
		}
	default:
		resArray = make([][]CommonResult, 0, len(attackerRow))
		for number, singlePok := range attackerRow {
			resArray = append(resArray, make([]CommonResult, 0, len(bossRow)))
			for _, boss := range bossRow {
				wg.Add(1)
				mu.Lock()
				count++
				mu.Unlock()
				for count > 20000 {

				}
				go func(currPok PokemonInitialData, currBoss BossInfo, i int) {
					defer wg.Done()
					singleResult, err := CommonSimulator(CommonPvpInData{
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
						fmt.Println(err)
					}
					mu.Lock()
					resArray[i] = append(resArray[i], singleResult)
					count--
					mu.Unlock()
				}(singlePok, boss, number)
			}
		}
	}
	wg.Wait()

	sort.Sort(byAvgDamage(resArray))

	return nil
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

	bossStat := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	bossLvl := tierMult[inDat.Boss.Tier]
	bossEffDef := (float32(15.0) + float32(bossStat.Def)) * bossLvl

	quickMBody := app.MoveBaseEntry{}
	chargeMBody := app.MoveBaseEntry{}

	for _, pok := range inDat.App.PokemonStatsBase {
		if (pok.Atk + pok.Def + pok.Sta) < 400 {
			continue
		}
		for _, qm := range pok.QuickMoves {
			if qm == "" {
				continue
			}
			for _, chm := range pok.ChargeMoves {
				if chm == "" {
					continue
				}
				effAtk := (float32(inDat.Pok.AttackIV) + float32(pok.Atk)) * inDat.App.LevelData[int(inDat.Pok.Level/0.5)]
				quickMBody = inDat.App.PokemonMovesBase[qm]
				chargeMBody = inDat.App.PokemonMovesBase[chm]

				damageCharge := (float32(chargeMBody.Damage)*0.5*(effAtk/bossEffDef)*
					getMultipliers(&pok, &bossStat, &chargeMBody, inDat) + 1)
				damageCharge = damageCharge * damageCharge / float32(-chargeMBody.Energy)

				damageQuick := (float32(quickMBody.Damage)*0.5*(effAtk/bossEffDef)*
					getMultipliers(&pok, &bossStat, &quickMBody, inDat) + 1)

				pokemonsAll = append(pokemonsAll, preRun{
					Name:   pok.Title,
					Quick:  qm,
					Charge: chm,
					Dps:    damageCharge + damageQuick,
				})
			}
		}
	}
	sort.Sort(byDps(pokemonsAll))
	return pokemonsAll[0:899]
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

func generateBossRow(inDat *IntialDataPve) []BossInfo {
	pokVal, _ := inDat.App.PokemonStatsBase[inDat.Boss.Name]

	quickM := make([]string, 0, 1)
	moveVal, ok := inDat.App.PokemonMovesBase[inDat.Boss.QuickMove]
	switch ok {
	case true:
		quickM = append(quickM, moveVal.Title)
	default:
		for _, value := range pokVal.QuickMoves {
			//append not elite moves
			_, ok := pokVal.EliteMoves[value]
			if !ok {
				quickM = append(quickM, value)
			}
		}
	}

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
			_, ok := pokVal.EliteMoves[value]
			if !ok {
				chargeM = append(chargeM, value)
			}
		}
	}

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
	return bosses

}

func generateAttackersRow(inDat *IntialDataPve) []PokemonInitialData {
	pokVal, ok := inDat.App.PokemonStatsBase[inDat.Pok.Name]
	if !ok {
		return nil
	}

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

//CommonSimulator start new common pve
func CommonSimulator(inDat CommonPvpInData) (CommonResult, error) {
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

type runResult struct {
	isWin        bool
	damageDealt  int32
	timeRemained int32
	fainted      uint32
}

//SimulatorRun makes a single raid simulator run (battle)
func simulatorRun(inDat CommonPvpInData) (runResult, error) {
	obj := PveObject{}
	obj.Timer = tierTimer[inDat.Boss.Tier]
	obj.Tier = inDat.Boss.Tier
	obj.FriendStage = friendship[inDat.FriendStage]
	obj.PlayersNumber = inDat.PlayersNumber
	obj.PartySize = inDat.PartySize
	obj.Weather = weather[inDat.Weather]
	obj.app = inDat.App
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

func (obj *PveObject) initializePve(attacker, boss string, i int) error {
	obj.Attacker[i].hp = obj.Attacker[i].maxHP

	obj.Attacker[i].damageRegistered = true
	obj.Attacker[i].energyRegistered = true

	obj.Boss.damageRegistered = true
	obj.Boss.energyRegistered = true

	err := obj.Attacker[i].quickMove.getMultipliersAgainst(attacker, boss, obj, false)
	if err != nil {
		return err
	}
	err = obj.Attacker[i].chargeMove.getMultipliersAgainst(attacker, boss, obj, false)
	if err != nil {
		return err
	}

	err = obj.Boss.quickMove.getMultipliersAgainst(boss, attacker, obj, true)
	if err != nil {
		return err
	}
	err = obj.Boss.chargeMove.getMultipliersAgainst(boss, attacker, obj, true)
	if err != nil {
		return err
	}
	return nil
}

func (m *move) getMultipliersAgainst(attacker, defender string, obj *PveObject, isBoss bool) error {
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

			obj.Attacker[obj.ActivePok].hp = obj.Attacker[obj.ActivePok].maxHP
			obj.Attacker[obj.ActivePok].energy = Energy(0)
			obj.Attacker[obj.ActivePok].action = 0
			obj.Attacker[obj.ActivePok].damageRegistered = true
			obj.Attacker[obj.ActivePok].energyRegistered = true
			obj.Attacker[obj.ActivePok].timeToDamage = 0
			obj.Attacker[obj.ActivePok].timeToEnergy = 0
			obj.Attacker[obj.ActivePok].moveCooldown = 0

			obj.substructPauseBetween(1000)
			//switch party
			if obj.PartySize == 12 || obj.PartySize == 6 {
				obj.substructPauseBetween(10000)
				continue
			}

		}

	}
	return nil
}

func (obj *PveObject) substructPauseBetween(pause int32) {
	/*var tail int32
	if obj.Boss.timeToEnergy == 0 && obj.Boss.timeToDamage == 0 {
		tail = obj.Boss.moveCooldown
		obj.Boss.moveCooldown -= obj.Boss.moveCooldown
	}
	//boss
	if obj.Boss.moveCooldown == 0 {
		obj.Boss.whatToDoNextBoss(obj)
	}

	obj.Boss.timeToEnergy += tail
	obj.Boss.timeToDamage += tail
	obj.Boss.moveCooldown += tail

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
	}*/

	obj.Boss.timeToEnergy = 0
	obj.Boss.timeToDamage = 0
	obj.Boss.moveCooldown = 0
	obj.Boss.action = 0
	obj.Boss.damageRegistered = true
	obj.Boss.energyRegistered = true

	//object
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
	if obj.Attacker[obj.ActivePok].hp < 1 {
		return nil
	}
	if obj.Boss.hp < 1 {
		return nil
	}

	//select action
	if obj.Boss.moveCooldown == 0 {
		obj.Boss.whatToDoNextBoss(obj)
	}
	if obj.Attacker[obj.ActivePok].moveCooldown == 0 {
		obj.Attacker[obj.ActivePok].whatToDoNext(obj)
	}

	//substruct countdown
	err = obj.roundDelta()
	if err != nil {
		return err
	}
	return nil
}

func (pok *pokemon) turn(obj *PveObject, defender *pokemon) error {
	if pok.timeToEnergy < 0 || pok.timeToDamage < 0 || pok.moveCooldown < 0 {
		return fmt.Errorf("Negative timer! Time to energy: %v, time to damamge: %v, cooldown: %v", pok.timeToEnergy, pok.timeToDamage, pok.moveCooldown)
	}
	if pok.timeToEnergy > 0 {
		return nil
	}
	if !pok.energyRegistered {
		//get energy
		err := pok.getEnergy()
		if err != nil {
			return err
		}
	}
	if pok.timeToDamage > 0 {
		return nil
	}
	if !pok.damageRegistered {
		err := pok.dealDamage(defender, obj)
		if err != nil {
			return err
		}
		//deal damage
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
		pok.action = 2
		pok.timeToEnergy = pause + pok.quickMove.damageWindow
		pok.timeToDamage = pause + pok.quickMove.damageWindow + pok.quickMove.dodgeWindow
		pok.moveCooldown = pause + pok.quickMove.cooldown
	default:
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
	//make charge hit
	pok.action = 3
	pok.timeToEnergy = pok.chargeMove.damageWindow
	pok.timeToDamage = pok.chargeMove.damageWindow + pok.chargeMove.dodgeWindow
	pok.moveCooldown = pok.chargeMove.cooldown
	return
}

func (obj *PveObject) roundDelta() error {
	if obj.Boss.moveCooldown == 0 {
		return fmt.Errorf("zero boss cooldown")
	}
	if obj.Attacker[obj.ActivePok].moveCooldown == 0 {
		return fmt.Errorf("zero cooldown")
	}

	pokemonTimerDelta := obj.Attacker[obj.ActivePok].returnTimer()

	bossTimerDelta := obj.Boss.returnTimer()

	switch pokemonTimerDelta > bossTimerDelta {
	case true:
		if bossTimerDelta > obj.Timer {
			bossTimerDelta = obj.Timer
		}
		obj.substructTimer(bossTimerDelta)
	default:
		if pokemonTimerDelta > obj.Timer {
			pokemonTimerDelta = obj.Timer
		}
		obj.substructTimer(pokemonTimerDelta)
	}
	return nil
}

func (pok *pokemon) returnTimer() int32 {
	switch true {
	case pok.timeToEnergy > 0:
		return pok.timeToEnergy
	case pok.timeToDamage > 0:
		return pok.timeToDamage
	}
	return pok.moveCooldown
}

func (obj *PveObject) substructTimer(timer int32) {
	//attacker
	if obj.Attacker[obj.ActivePok].timeToEnergy > 0 {
		obj.Attacker[obj.ActivePok].timeToEnergy -= timer
	}
	if obj.Attacker[obj.ActivePok].timeToDamage > 0 {
		obj.Attacker[obj.ActivePok].timeToDamage -= timer
	}
	obj.Attacker[obj.ActivePok].moveCooldown -= timer

	//boss
	if obj.Boss.timeToEnergy > 0 {
		obj.Boss.timeToEnergy -= timer
	}
	if obj.Boss.timeToDamage > 0 {
		obj.Boss.timeToDamage -= timer
	}
	obj.Boss.moveCooldown -= timer

	//object
	obj.Timer -= timer
}
