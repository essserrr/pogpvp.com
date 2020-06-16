package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"math"
	"math/rand"
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

	return nil
}

func generateAttackersRow(inDat *IntialDataPve) []PokemonInitialData {
	pokVal, ok := inDat.App.PokemonStatsBase[inDat.Pok.Name]
	if ok {
		return []PokemonInitialData{}
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
	result.DamageMin = tierHP[inDat.Boss.Tier]
	result.TimeRemainedMin = tierTimer[inDat.Boss.Tier]
	result.FaintedMin = uint32(inDat.PartySize)

	for i := 0; i < inDat.NumberOfRuns; i++ {
		res, err := simulatorRun(inDat)
		if err != nil {
			return CommonResult{}, err
		}
		result.collect(&res)
	}

	result.DamageAvg = int32(float64(result.DamageAvg) / float64(inDat.NumberOfRuns))
	result.TimeRemainedAvg = int32(float64(result.TimeRemainedAvg) / float64(inDat.NumberOfRuns))

	return result, nil
}

type CommonResult struct {
	DamageMin int32
	DamageMax int32
	DamageAvg int32

	TimeRemainedMin int32
	TimeRemainedMax int32
	TimeRemainedAvg int32

	FaintedMin uint32
	FaintedMax uint32

	NumberOfWins uint32
}

func (cr *CommonResult) collect(run *runResult) {
	if run.damageDealt > cr.DamageMax {
		cr.DamageMax = run.damageDealt
	}
	if run.damageDealt < cr.DamageMin {
		cr.DamageMin = run.damageDealt
	}
	cr.DamageAvg += run.damageDealt

	if run.timeRemained > cr.TimeRemainedMax {
		cr.TimeRemainedMax = run.timeRemained
	}
	if run.timeRemained < cr.TimeRemainedMin {
		cr.TimeRemainedMin = run.timeRemained
	}
	cr.TimeRemainedAvg += run.timeRemained

	if run.fainted > cr.FaintedMax {
		cr.FaintedMax = run.fainted
	}
	if run.fainted < cr.FaintedMin {
		cr.FaintedMin = run.fainted
	}
	if run.isWin {
		cr.NumberOfWins++
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
				obj.substructPauseBetween(9000)
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
		pok.timeToEnergy = 0
		pok.timeToDamage = pok.quickMove.damageWindow + pok.quickMove.dodgeWindow
		pok.moveCooldown = pok.quickMove.cooldown
		return
	}
	//make charge hit
	pok.action = 3
	pok.timeToEnergy = 0
	pok.timeToDamage = pok.chargeMove.cooldown
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
