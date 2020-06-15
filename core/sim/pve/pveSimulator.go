package pve

import (
	"Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"math"
	"math/rand"
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

	Timer int32
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

//CommonSimulator start new common pve
func CommonSimulator(inDat CommonPvpInData) {
	rand.Seed(time.Now().UnixNano())

	var (
		minDamage int32 = tierHP[inDat.Boss.Tier]
		timeMin   int32
		maxDamage int32
		timeMax   int32
		sumDamage int32

		timeRemainedMin int32 = tierTimer[inDat.Boss.Tier]
		timeRemainedMax int32
		timeRemainedSum int32

		faintedMin uint32 = uint32(inDat.PartySize)
		faintedMax uint32
		faintedSum uint32
	)

	for i := 0; i < 1000; i++ {
		res, err := simulatorRun(inDat)
		if err != nil {
			fmt.Println(err)
			break
		}
		if res.damageDealt > maxDamage {
			maxDamage = res.damageDealt
			timeMax = res.timeRemained
		}
		if res.damageDealt < minDamage {
			minDamage = res.damageDealt
			timeMin = res.timeRemained
		}
		sumDamage += res.damageDealt

		if res.timeRemained > timeRemainedMax {
			timeRemainedMax = res.timeRemained
		}
		if res.timeRemained < timeRemainedMin {
			timeRemainedMin = res.timeRemained
		}
		timeRemainedSum += res.timeRemained

		if res.fainted > faintedMax {
			faintedMax = res.fainted
		}
		if res.fainted < faintedMin {
			faintedMin = res.fainted
		}
		faintedSum += res.fainted
	}
	dpsMin := float64(minDamage) / float64(tierTimer[inDat.Boss.Tier]-timeMin) * 1000
	dpsMax := float64(maxDamage) / float64(tierTimer[inDat.Boss.Tier]-timeMax) * 1000
	dpsAvg := float64(sumDamage) / 1000.0 / (float64(tierTimer[inDat.Boss.Tier]) - (float64(timeRemainedSum) / 1000.0)) * 1000

	perMin := float64(minDamage) / float64(tierHP[inDat.Boss.Tier]) * 100
	perMax := float64(maxDamage) / float64(tierHP[inDat.Boss.Tier]) * 100
	perAvg := float64(sumDamage) / 1000.0 / float64(tierHP[inDat.Boss.Tier]) * 100

	fmt.Printf("Min damage: %v, max damage: %v, avg. damage: %v \n", minDamage, maxDamage, int32(float64(sumDamage)/1000.0))
	fmt.Printf("Min damage: %v, max damage: %v, avg. damage: %v \n", perMin, perMax, perAvg)
	fmt.Printf("Min Hp remained: %v, max Hp remained: %v, avg. Hp remained: %v \n", tierHP[inDat.Boss.Tier]-minDamage, tierHP[inDat.Boss.Tier]-maxDamage, tierHP[inDat.Boss.Tier]-int32(float64(sumDamage)/1000.0))

	fmt.Printf("Min dps: %v, max dps: %v, avg. dps: %v \n", dpsMin, dpsMax, dpsAvg)
	fmt.Printf("Min time: %v, max time: %v, avg. time: %v \n", timeRemainedMin, timeRemainedMax, float64(timeRemainedSum)/1000.0)
	fmt.Printf("Min fainted: %v, max fainted: %v, avg. fainted: %v \n", faintedMin, faintedMax, float64(faintedSum)/1000.0)
}

type runResult struct {
	damageDealt  int32
	timeRemained int32
	fainted      uint32
}

//SimulatorRun makes a single raid simulator run (battle)
func simulatorRun(inDat CommonPvpInData) (runResult, error) {
	obj := PveObject{}
	if inDat.Boss.Tier > 5 || inDat.Boss.Tier < 0 {
		return runResult{}, fmt.Errorf("Unknown raid tier")
	}
	obj.Timer = tierTimer[inDat.Boss.Tier]
	obj.Tier = inDat.Boss.Tier

	if inDat.FriendStage > 8 || inDat.FriendStage < 0 {
		return runResult{}, fmt.Errorf("Unknown friendship tier")
	}
	obj.FriendStage = friendship[inDat.FriendStage]

	if inDat.PlayersNumber > 20 || inDat.PlayersNumber < 1 {
		return runResult{}, fmt.Errorf("Wrong players number")
	}
	obj.PlayersNumber = inDat.PlayersNumber

	if inDat.PartySize > 18 || inDat.PartySize < 1 {
		return runResult{}, fmt.Errorf("Wrong party size")
	}
	obj.PartySize = inDat.PartySize

	if inDat.Weather > 7 || inDat.Weather < 0 {
		return runResult{}, fmt.Errorf("Unknown weather")
	}
	obj.Weather = weather[inDat.Weather]

	obj.app = inDat.App

	obj.Attacker = make([]pokemon, 1, 1)
	err := obj.makeNewCharacter(&inDat.Pok, &obj.Attacker[0])
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
	for obj.PartySize > 0 && obj.Timer > 0 && obj.Boss.hp > 0 {
		err := obj.nextRound()
		if err != nil {
			return err
		}

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
				switch obj.Timer > 14000 {
				case true:
					obj.Timer -= 14000
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
	return nil
}

func (obj *PveObject) substructPauseBetween() {
	const pause = 1000.0
	//boss
	if obj.Boss.moveCooldown == 0 {
		obj.Boss.whatToDoNextBoss(obj)
	}
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
	err := obj.Boss.turn(obj, &obj.Attacker[0])
	if err != nil {
		return err
	}
	err = obj.Attacker[0].turn(obj, &obj.Boss)
	if err != nil {
		return err
	}

	//select action
	if obj.Boss.moveCooldown == 0 {
		obj.Boss.whatToDoNextBoss(obj)
	}
	if obj.Attacker[0].moveCooldown == 0 {
		obj.Attacker[0].whatToDoNext(obj)
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
	if pok.moveCooldown == 0 && pok.energyRegistered {
		return nil
	}
	if pok.timeToEnergy > 0 {
		return nil
	}
	if pok.timeToEnergy == 0 && !pok.energyRegistered {
		//get energy
		err := pok.getEnergy()
		if err != nil {
			return err
		}
	}
	if pok.timeToDamage > 0 {
		return nil
	}
	if pok.timeToDamage == 0 && !pok.damageRegistered {
		err := pok.dealDamage(defender, obj)
		if err != nil {
			return err
		}
		//deal damage
	}
	return nil
}

func (pok *pokemon) getEnergy() error {
	var energy int16
	switch pok.action {
	case 2:
		energy = pok.quickMove.energy
	case 3:
		energy = pok.chargeMove.energy
	default:
		return fmt.Errorf("Attempt to get energy with zero action")
	}

	pok.energyRegistered = true
	pok.energy.addEnergy(energy)
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
		pok.timeToEnergy = pause + pok.quickMove.damageWindow - 1
		pok.timeToDamage = pause + pok.quickMove.damageWindow + pok.quickMove.dodgeWindow - 1
		pok.moveCooldown = pause + pok.quickMove.cooldown
		return
	}
	//flip coin
	coinflip := rand.Intn(10)
	switch coinflip < 5 {
	case true:
		pok.action = 2
		pok.timeToEnergy = pause + pok.quickMove.damageWindow - 1
		pok.timeToDamage = pause + pok.quickMove.damageWindow + pok.quickMove.dodgeWindow - 1
		pok.moveCooldown = pause + pok.quickMove.cooldown
	default:
		pok.action = 3
		pok.timeToEnergy = pause + pok.chargeMove.damageWindow - 1
		pok.timeToDamage = pause + pok.chargeMove.damageWindow + pok.quickMove.dodgeWindow - 1
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
		pok.timeToEnergy = pok.quickMove.damageWindow - 1
		pok.timeToDamage = pok.quickMove.cooldown - 1
		pok.moveCooldown = pok.quickMove.cooldown
		return
	}
	//make charge hit
	pok.action = 3
	pok.timeToEnergy = pok.chargeMove.damageWindow - 1
	pok.timeToDamage = pok.chargeMove.cooldown - 1
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
