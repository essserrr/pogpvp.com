package pve

import (
	"Solutions/pvpSimulator/core/sim/app"
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

	Timer float32
	app   *app.SimApp
}

type CommonPvpInData struct {
	App *app.SimApp
	Pok InitialData

	PartySize     uint8
	PlayersNumber uint8

	Boss BossInfo

	FriendStage   int
	Weather       int
	DodgeStrategy uint8
}

//SimulatorRun makes a single raid simulator run (battle)
func SimulatorRun(inDat CommonPvpInData) error {
	obj := PveObject{}
	if inDat.Boss.Tier > 5 || inDat.Boss.Tier < 0 {
		return fmt.Errorf("Unknown raid tier")
	}
	obj.Timer = tierTimer[inDat.Boss.Tier]
	obj.Tier = inDat.Boss.Tier

	if inDat.FriendStage > 8 || inDat.FriendStage < 0 {
		return fmt.Errorf("Unknown friendship tier")
	}
	obj.FriendStage = friendship[inDat.FriendStage]

	if inDat.PlayersNumber > 20 || inDat.PlayersNumber < 1 {
		return fmt.Errorf("Wrong players number")
	}
	obj.PlayersNumber = inDat.PlayersNumber

	if inDat.PartySize > 18 || inDat.PartySize < 1 {
		return fmt.Errorf("Wrong party size")
	}
	obj.PartySize = inDat.PartySize

	if inDat.Weather > 7 || inDat.Weather < 0 {
		return fmt.Errorf("Unknown weather")
	}
	obj.Weather = weather[inDat.Weather]

	obj.app = inDat.App

	obj.Attacker = make([]pokemon, 1, 1)
	err := obj.makeNewCharacter(&inDat.Pok, &obj.Attacker[0])
	if err != nil {
		fmt.Println(err)
	}

	err = obj.makeNewBoss(&inDat.Boss, &obj.Boss)
	if err != nil {
		fmt.Println(err)
	}

	err = obj.initializePve(inDat.Pok.Name, inDat.Boss.Name, 0)
	if err != nil {
		fmt.Println(err)
	}

	obj.letsBattle()

	return nil
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

func (obj *PveObject) letsBattle() {
	for obj.PartySize > 0 && obj.Timer > 0 && obj.Boss.hp > 0 {
		obj.nextRound()

		//select next
		if obj.Attacker[0].hp <= 0 {
			obj.PartySize--

			obj.Attacker[0].hp = obj.Attacker[0].maxHP
			obj.Attacker[0].energy = Energy(0)
			obj.Attacker[0].action = 0
			obj.Attacker[0].damageRegistered = true
			obj.Attacker[0].energyRegistered = true

			obj.Attacker[0].timeToDamage = 0
			obj.Attacker[0].timeToEnergy = 0
			obj.Attacker[0].moveCooldown = 0
			obj.substructPauseBetween()
			//switch party
			if obj.PartySize == 12 || obj.PartySize == 6 {
				switch obj.Timer > 14 {
				case true:
					obj.Timer -= 14
				default:
					obj.Timer -= obj.Timer
				}
				obj.Boss.action = 0
				obj.Boss.damageRegistered = true
				obj.Boss.energyRegistered = true

				obj.Boss.timeToDamage = 0
				obj.Boss.timeToEnergy = 0
				obj.Boss.moveCooldown = 0
			}
		}

	}
	fmt.Printf("damage dealt: %v, HP: %v, percents: %v \n", tierHP[obj.Tier]-obj.Boss.hp, obj.Boss.hp, float64(tierHP[obj.Tier]-obj.Boss.hp)/float64(tierHP[obj.Tier])*100.0)
	fmt.Println(tierHP[obj.Tier])
	return
}

func (obj *PveObject) substructPauseBetween() {
	//boss
	if obj.Boss.timeToEnergy > 0 {
		switch obj.Boss.timeToEnergy > 1 {
		case true:
			obj.Boss.timeToEnergy -= 1.0
		default:
			obj.Boss.timeToEnergy -= obj.Boss.timeToEnergy
		}
	}
	if obj.Boss.timeToDamage > 0 {
		switch obj.Boss.timeToDamage > 1 {
		case true:
			obj.Boss.timeToDamage -= 1.0
		default:
			obj.Boss.timeToDamage -= obj.Boss.timeToDamage
		}
	}
	switch obj.Boss.moveCooldown > 1 {
	case true:
		obj.Boss.moveCooldown -= 1.0
	default:
		obj.Boss.moveCooldown -= obj.Boss.moveCooldown
	}

	//object
	switch obj.Timer > 1 {
	case true:
		obj.Timer -= 1.0
	default:
		obj.Timer -= obj.Timer
	}
}

func (obj *PveObject) nextRound() {
	//deal damage, get energy
	obj.Boss.turn(obj, &obj.Attacker[0])
	obj.Attacker[0].turn(obj, &obj.Boss)

	//select action
	if obj.Boss.moveCooldown == 0 {
		obj.Boss.whatToDoNextBoss(obj)
	}
	if obj.Attacker[0].moveCooldown == 0 {
		obj.Attacker[0].whatToDoNext(obj)
	}

	//substruct countdown
	obj.roundDelta()
}

func (pok *pokemon) turn(obj *PveObject, defender *pokemon) error {
	if pok.timeToEnergy < 0 || pok.timeToDamage < 0 || pok.moveCooldown < 0 {
		return fmt.Errorf("Negative timer! Time to energy: %v, time to damamge: %v, cooldown: %v", pok.timeToEnergy, pok.timeToDamage, pok.moveCooldown)
	}
	if pok.moveCooldown == 0 && pok.energyRegistered {
		return nil
	}
	if pok.timeToEnergy > 0 {
		return nil
	}
	if pok.timeToEnergy == 0 && !pok.energyRegistered {
		//get energy
		pok.getEnergy()
	}
	if pok.timeToDamage > 0 {
		return nil
	}
	if pok.timeToDamage == 0 && !pok.damageRegistered {
		pok.dealDamage(defender, obj)
		//deal damage
	}
	return nil
}

func (pok *pokemon) getEnergy() {
	var energy int16
	switch pok.action {
	case 2:
		energy = pok.quickMove.energy
	case 3:
		energy = pok.chargeMove.energy
	default:
		fmt.Println("error")
	}

	pok.energyRegistered = true
	pok.energy.addEnergy(energy)
}

func (pok *pokemon) dealDamage(defender *pokemon, obj *PveObject) {
	var damage int32
	switch pok.action {
	case 2:
		damage = int32(float32(pok.quickMove.damage)*0.5*(pok.effectiveAttack/defender.effectiveDefence)*pok.quickMove.multiplier) + 1
	case 3:
		damage = int32(float32(pok.chargeMove.damage)*0.5*(pok.effectiveAttack/defender.effectiveDefence)*pok.chargeMove.multiplier) + 1
	default:
		fmt.Println("error")
	}

	pok.damageRegistered = true
	defender.hp -= damage
	defender.energy.addEnergy(int16(float64(obj.PlayersNumber) * math.Round(float64(damage)*0.5)))
}

func (pok *pokemon) whatToDoNextBoss(obj *PveObject) {
	pok.energyRegistered = false
	pok.damageRegistered = false
	//check if energy is enogh to make a charge hit
	if int16(pok.energy) < -pok.chargeMove.energy {
		//make a quick hit
		pok.action = 2
		pok.timeToEnergy = 2.0 + pok.quickMove.damageWindow
		pok.timeToDamage = 2.0 + pok.quickMove.damageWindow + pok.quickMove.dodgeWindow
		pok.moveCooldown = 2.0 + pok.quickMove.cooldown
		return
	}
	//flip coin
	coinflip := rand.Intn(10)
	switch coinflip < 5 {
	case true:
		pok.action = 2
		pok.timeToEnergy = 2.0 + pok.quickMove.damageWindow
		pok.timeToDamage = 2.0 + pok.quickMove.damageWindow + pok.quickMove.dodgeWindow
		pok.moveCooldown = 2.0 + pok.quickMove.cooldown
	default:
		pok.action = 3
		pok.timeToEnergy = 2.0 + pok.chargeMove.damageWindow
		pok.timeToDamage = 2.0 + pok.chargeMove.damageWindow + pok.quickMove.dodgeWindow
		pok.moveCooldown = 2.0 + pok.chargeMove.cooldown
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
	pok.timeToDamage = pok.chargeMove.damageWindow + pok.quickMove.dodgeWindow
	pok.moveCooldown = pok.chargeMove.cooldown
	return
}

func (obj *PveObject) roundDelta() error {
	if obj.Boss.moveCooldown == 0 {
		return fmt.Errorf("zero boss cooldown")
	}
	if obj.Attacker[0].moveCooldown == 0 {
		return fmt.Errorf("zero cooldown")
	}

	pokemonTimerDelta := obj.Attacker[0].returnTimer()

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

func (pok *pokemon) returnTimer() float32 {
	switch true {
	case pok.timeToEnergy > 0:
		return pok.timeToEnergy
	case pok.timeToDamage > 0:
		return pok.timeToDamage
	}
	return pok.moveCooldown
}

func (obj *PveObject) substructTimer(timer float32) {
	//attacker
	if obj.Attacker[0].timeToEnergy > 0 {
		obj.Attacker[0].timeToEnergy -= timer
	}
	if obj.Attacker[0].timeToDamage > 0 {
		obj.Attacker[0].timeToDamage -= timer
	}
	obj.Attacker[0].moveCooldown -= timer

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
