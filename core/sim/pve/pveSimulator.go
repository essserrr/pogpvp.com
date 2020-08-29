package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"math"
	"math/rand"
)

type pveObject struct {
	app         *app.SimApp
	CustomMoves *map[string]app.MoveBaseEntry

	DodgeStrategy int
	ActivePok     int

	Booster  []int
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
		Attacker:    make([]pokemon, 0, len(inDat.AttackerPokemon)),
	}

	if inDat.BoostSlotPokemon.Name != "" {
		obj.Booster = inDat.App.PokemonStatsBase[inDat.BoostSlotPokemon.Name].Type
	}

	for _, pok := range inDat.AttackerPokemon {
		if err := obj.addNewCharacter(&pok); err != nil {
			return runResult{}, err
		}
	}
	if err := obj.addBoss(&inDat.Boss); err != nil {
		return runResult{}, err
	}

	//initialization
	for key := range obj.Attacker {
		obj.initializeVsBoss(key)
	}
	obj.initializeVsActivePokemon(0)

	err := obj.letsBattle()
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

func (obj *pveObject) initializeVsBoss(i int) {
	obj.Attacker[i].hp = obj.Attacker[i].maxHP

	obj.Attacker[i].damageRegistered = true
	obj.Attacker[i].energyRegistered = true
	obj.Attacker[i].quickMove.setMultipliers(obj.Attacker[i].name, obj.Boss.name, obj, false)
	obj.Attacker[i].chargeMove.setMultipliers(obj.Attacker[i].name, obj.Boss.name, obj, false)
}

func (obj *pveObject) initializeVsActivePokemon(i int) {
	obj.Boss.damageRegistered = true
	obj.Boss.energyRegistered = true
	obj.Boss.quickMove.setMultipliers(obj.Boss.name, obj.Attacker[i].name, obj, true)
	obj.Boss.chargeMove.setMultipliers(obj.Boss.name, obj.Attacker[i].name, obj, true)
}

func (m *move) setMultipliers(attacker, defender string, obj *pveObject, isBoss bool) {
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
		var megaMult float32 = 1.0
		if canBoost(attacker) {
			megaMult = megaBoost(obj.app.PokemonStatsBase[attacker].Type, m.moveType)
		}
		m.multiplier = stabMultiplier * seMultiplier * weatherMultiplier * megaMult
	default:
		m.multiplier = stabMultiplier * obj.FriendStage * seMultiplier * weatherMultiplier * megaBoost(obj.Booster, m.moveType)
	}
}

func megaBoost(typesBoosted []int, targetType int) float32 {
	if typesBoosted == nil || len(typesBoosted) == 0 {
		return 1.0
	}
	for _, boosterType := range typesBoosted {
		if boosterType == targetType {
			return 1.3
		}
	}
	return 1.0
}

func (obj *pveObject) switchToNext() {
	obj.PartySize--

	switch len(obj.Attacker)-1 > obj.ActivePok {
	case true:
		obj.ActivePok++
		obj.Boss.quickMove.setMultipliers(obj.Boss.name, obj.Attacker[obj.ActivePok].name, obj, true)
		obj.Boss.chargeMove.setMultipliers(obj.Boss.name, obj.Attacker[obj.ActivePok].name, obj, true)
	default:
		obj.Attacker[obj.ActivePok].revive()
	}

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
			obj.switchToNext()
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
