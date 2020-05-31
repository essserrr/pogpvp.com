package pvpsim

import (
	"math/rand"
	"time"
)

//NewPvpBetween starts pvp between two charcters defined by initial data, returns pvp log
func NewPvpBetweenPvppoke(inData SinglePvpInitialData) (PvpResults, error) {
	rand.Seed(time.Now().UnixNano())

	pvpData := globalPvpObjectPool.Get().(*PvpObject)
	*pvpData = PvpObject{}

	pvpData.isTree = false
	pvpData.logging = inData.Logging
	pvpData.log = make([]logValue, 0, 32)

	attackerTypes, err := pvpData.attacker.makeNewCharacter(&inData.AttackerData)
	if err != nil {
		return PvpResults{}, err
	}

	defenderTypes, err := pvpData.defender.makeNewCharacter(&inData.DefenderData)
	if err != nil {
		return PvpResults{}, err
	}

	err = pvpData.initializePvp(&inData.AttackerData, &inData.DefenderData, attackerTypes, defenderTypes)
	if err != nil {
		return PvpResults{}, err
	}

	pvpData.readInitialConditions(&inData.AttackerData, &inData.DefenderData)

	if (inData.Constr != Constructor{}) {
		pvpData.readConstructorData(&inData.Constr)
	}

	pvpData.sortmoves()

	letsBattlePvppoke(pvpData)

	result := PvpResults{
		Log:       pvpData.log,
		CreatedAt: time.Now(),
		IsRandom:  checkResultRandomness(pvpData),
		Attacker: SingleResult{
			Name: inData.AttackerData.Name,
			Rate: uint16((500*(float32(pvpData.defender.maxHP)-processHP(pvpData.defender.hp))/float32(pvpData.defender.maxHP) + 500*processHP(pvpData.attacker.hp)/float32(pvpData.attacker.maxHP))),

			DamageBlocked:  pvpData.attacker.potentialDamage,
			MaxHP:          pvpData.attacker.maxHP,
			HP:             uint16(processHP(pvpData.attacker.hp)),
			EnergyRemained: pvpData.attacker.energy,

			EnergyUsed: -pvpData.attacker.energySpent,
		},
		Defender: SingleResult{
			Name: inData.DefenderData.Name,
			Rate: uint16((500*(float32(pvpData.attacker.maxHP)-processHP(pvpData.attacker.hp))/float32(pvpData.attacker.maxHP) + 500*processHP(pvpData.defender.hp)/float32(pvpData.defender.maxHP))),

			DamageBlocked:  pvpData.defender.potentialDamage,
			MaxHP:          pvpData.defender.maxHP,
			HP:             uint16(processHP(pvpData.defender.hp)),
			EnergyRemained: pvpData.defender.energy,

			EnergyUsed: -pvpData.defender.energySpent,
		},
	}
	return result, nil
}

func (o *PvpObject) sortmoves() {
	o.attacker.sortAgainst(&o.defender)
	o.defender.sortAgainst(&o.attacker)

}

func (pok *pokemon) sortAgainst(defender *pokemon) {
	if len(pok.chargeMove) < 2 {
		return
	}
	selfHarm1st := app.pokemonMovesBase[pok.chargeMove[0].title].Subject == "Self" && app.pokemonMovesBase[pok.chargeMove[0].title].StageDelta < 0
	selfHarm2nd := app.pokemonMovesBase[pok.chargeMove[1].title].Subject == "Self" && app.pokemonMovesBase[pok.chargeMove[1].title].StageDelta < 0

	dpe1 := pok.calculateDPE(defender, 0)
	dpe2 := pok.calculateDPE(defender, 1)
	if dpe1 == dpe2 {
		switch -pok.chargeMove[0].pvpEnergy <= -pok.chargeMove[1].pvpEnergy {
		case true:
			if selfHarm1st {
				pok.swapMoves()
				return
			}
			return
		default:
			// swap
			if selfHarm2nd {
				return
			}
			pok.swapMoves()
		}
	}
	if dpe1 > dpe2 {
		if selfHarm1st {
			pok.swapMoves()
			return
		}
		return
	}
	//swap
	if selfHarm2nd {
		return
	}
	pok.swapMoves()
}

func (pok *pokemon) swapMoves() {
	pok.chargeMove[0], pok.chargeMove[1] = pok.chargeMove[1], pok.chargeMove[0]
	if !pok.inConstructorMode {
		return
	}
	if pok.whatToSkip == 0 {
		return
	}
	switch pok.whatToSkip {
	case 1:
		pok.whatToSkip = 2
	case 2:
		pok.whatToSkip = 1
	}

}

func (pok *pokemon) calculateDPE(defender *pokemon, moveNumb int) float64 {
	damage := int16(0.5*pok.chargeMove[moveNumb].pvpDamage*(pok.effectiveAttack.value/defender.effectiveDefence.value)*pok.chargeMove[moveNumb].totalMultiplier) + 1
	return float64(damage) / float64(-pok.chargeMove[moveNumb].pvpEnergy)
}

func letsBattlePvppoke(obj *PvpObject) {
	obj.log.makeNewRound(obj.round)
	WriteHpEnergy(obj)

	for obj.attacker.hp > 0 && obj.defender.hp > 0 {
		nextRoundPvppoke(obj)
		if obj.attacker.inConstructorMode || obj.defender.inConstructorMode {
			obj.attacker.inConstructorMode = false
			obj.defender.inConstructorMode = false
		}
	}
	writeRoundResults(obj)
}

func nextRoundPvppoke(obj *PvpObject) {
	obj.log.makeNewRound(obj.round + 1)

	switch obj.attacker.effectiveAttack.value >= obj.defender.effectiveAttack.value {
	case true:
		obj.attacker.turnPvppoke(obj)
		obj.defender.turnPvppoke(obj)
	case false:
		obj.defender.turnPvppoke(obj)
		obj.attacker.turnPvppoke(obj)

	}

	//round logics, possible variants of round results

	switch true {
	case obj.attacker.results.chargeName != 0 && obj.defender.results.chargeName == 0:
		// attacker used charge move, defender didn`t

		handleWriteMove(obj, obj.defender.quickMove.title, obj.defender.results.actionCode, false)

		obj.defender.dealDamgeGetEnergy(obj)
		if obj.attacker.hp <= 0 {
			WriteHpEnergy(obj)
			obj.round++
			return
		}

		handleWriteMove(obj, obj.attacker.chargeMove[obj.attacker.results.chargeName-1].title, 11, true)

		obj.attacker.dealDamgeGetEnergy(obj)
		obj.defender.giveOpponentFreeHit()

		obj.attacker.trigger(obj)
		WriteHpEnergy(obj)
		resetSwitchersA(obj)
		obj.round++
	case obj.defender.results.chargeName != 0 && obj.attacker.results.chargeName == 0:
		// defender used charge move, attacker didn`t

		handleWriteMove(obj, obj.attacker.quickMove.title, obj.attacker.results.actionCode, true)

		obj.attacker.dealDamgeGetEnergy(obj)
		if obj.defender.hp <= 0 {
			WriteHpEnergy(obj)
			obj.round++
			return
		}

		handleWriteMove(obj, obj.defender.chargeMove[obj.defender.results.chargeName-1].title, 11, false)

		obj.defender.dealDamgeGetEnergy(obj)
		obj.attacker.giveOpponentFreeHit()

		obj.defender.trigger(obj)
		WriteHpEnergy(obj)
		resetSwitchersD(obj)
		obj.round++
	case obj.defender.results.chargeName != 0 && obj.attacker.results.chargeName != 0:
		//they both used charge move

		if obj.attacker.effectiveAttack.value >= obj.defender.effectiveAttack.value {

			handleWriteMove(obj, obj.attacker.chargeMove[obj.attacker.results.chargeName-1].title, 11, true)

			obj.attacker.dealDamgeGetEnergy(obj)

			if obj.defender.hp <= 0 {
				obj.attacker.trigger(obj)
				WriteHpEnergy(obj)
				obj.round++
				return
			}

			handleWriteMove(obj, obj.defender.chargeMove[obj.defender.results.chargeName-1].title, 11, false)

			obj.attacker.trigger(obj)
			obj.defender.dealDamgeGetEnergy(obj)

			obj.defender.trigger(obj)

			WriteHpEnergy(obj)
			resetSwitchersA(obj)
			resetSwitchersD(obj)
			if obj.logging {
				obj.log[len(obj.log)-1].Attacker.writeOrder()
			}
			obj.round++
			return
		}

		handleWriteMove(obj, obj.defender.chargeMove[obj.defender.results.chargeName-1].title, 11, false)

		obj.defender.dealDamgeGetEnergy(obj)

		if obj.attacker.hp <= 0 {
			obj.defender.trigger(obj)
			WriteHpEnergy(obj)
			obj.round++
			return
		}

		handleWriteMove(obj, obj.attacker.chargeMove[obj.attacker.results.chargeName-1].title, 11, true)

		obj.defender.trigger(obj)
		obj.attacker.dealDamgeGetEnergy(obj)

		obj.attacker.trigger(obj)

		WriteHpEnergy(obj)
		resetSwitchersA(obj)
		resetSwitchersD(obj)
		if obj.logging {
			obj.log[len(obj.log)-1].Defender.writeOrder()
		}

		obj.round++
	default:
		//both used a quick move

		handleWriteMove(obj, obj.attacker.quickMove.title, obj.attacker.results.actionCode, true)
		obj.attacker.dealDamgeGetEnergy(obj)

		handleWriteMove(obj, obj.defender.quickMove.title, obj.defender.results.actionCode, false)
		obj.defender.dealDamgeGetEnergy(obj)

		WriteHpEnergy(obj)
		obj.round++
	}
}

func (pok *pokemon) turnPvppoke(obj *PvpObject) {
	if pok.moveCooldown != 0.0 {
		pok.hit() //if there is a cooldown (we made a hit last time), check if it`s time to deal a damage
		pok.moveCooldown--
		if pok.roundsToDamage != 0.0 {
			pok.roundsToDamage--
		}
		pok.results.chargeName = 0
		return
	}

	pok.whatToDoInNextRoundPvppoke(obj)
	if pok.moveCooldown != 0 { //if we strated a new quick move, decrease cooldowns
		pok.moveCooldown--
		pok.roundsToDamage--
	}
}

func (pok *pokemon) whatToDoInNextRoundPvppoke(obj *PvpObject) {
	if pok.isFreeHit {
		pok.freeHit()
		return
	}
	pok.makeChargedHitPvppoke(obj)
	if pok.results.chargeName == 0 {
		pok.makeQuickHit()
		return
	}
}

func (pok *pokemon) makeChargedHitPvppoke(obj *PvpObject) {
	switch pok.inConstructorMode {
	case true:
		pok.pvppokeConstructor()
	default:
		pok.checkAvalabilityOfChargeMovesPvppoke(obj)
	}

	if pok.results.chargeName == 0 {
		pok.results.actionCode = 0
		return
	}

	pok.useChargeMove()
}

func (pok *pokemon) pvppokeConstructor() {
	for moveNumb, stats := range pok.chargeMove {
		//check if we are able to use any move
		if pok.whatToSkip == int8(moveNumb+1) || int16(pok.energy) < -stats.pvpEnergy {
			continue
		}
		pok.results.chargeName = int8(moveNumb + 1)
		//and check if the other move is ready
		return
	}
	//if no moves available, use nothing
	pok.results.chargeName = 0
}

func (pok *pokemon) checkAvalabilityOfChargeMovesPvppoke(obj *PvpObject) {
	//if there are no charge charge moves - auto skip
	if len(pok.chargeMove) < 1 {
		pok.results.chargeName = 0
		return
	}
	//check if we dead after opponent's quick this turn
	defender := whoIsDfender(pok, obj)
	bonusMove, nextCheck := checkQuickKnock(defender, pok)
	if !nextCheck {
		pok.results.chargeName = 0
		return
	}
	//check if we dead after opponent's charge this turn
	nextCheck = checkChargeKnock(defender, pok)
	if !nextCheck {
		pok.results.chargeName = 0
		return
	}
	var skipped bool
	if defender.shields < 1 {
		skipped = true
	}
	//if there is only move
	if len(pok.chargeMove) == 1 {
		//use it if energy is enough
		if int16(pok.energy) < -pok.chargeMove[0].pvpEnergy {
			pok.results.chargeName = 1
			defender.skipShield = skipped
			pok.isTriggered = pok.chargeMove[0].activateTrigger()
			return
		}
		pok.results.chargeName = 0
		return
	}

	//otherwise try to use primary charge move
	if int16(pok.energy) >= -pok.chargeMove[0].pvpEnergy {
		pok.results.chargeName = 1
		defender.skipShield = skipped
		pok.isTriggered = pok.chargeMove[0].activateTrigger()
		return
	}
	//if attempt failed check secondary move
	if int16(pok.energy) < -pok.chargeMove[1].pvpEnergy {
		pok.results.chargeName = 0
		return
	}
	//bait shields
	if defender.shields > 0 {
		if app.pokemonMovesBase[pok.chargeMove[1].title].Subject == "Self" && app.pokemonMovesBase[pok.chargeMove[1].title].StageDelta < 0 {
			pok.results.chargeName = 0
			return
		}
		pok.results.chargeName = 2
		defender.skipShield = skipped
		pok.isTriggered = pok.chargeMove[1].activateTrigger()
		return
	}
	//don't skip lethal
	aDamage := int16(0.5*pok.chargeMove[1].pvpDamage*(pok.effectiveAttack.value/defender.effectiveDefence.value)*pok.chargeMove[1].totalMultiplier) + 1
	if aDamage > defender.hp {
		pok.results.chargeName = 2
		defender.skipShield = skipped
		pok.isTriggered = pok.chargeMove[1].activateTrigger()
		return
	}
	//mind feint
	waitPrimary := checkFeint(defender, pok, bonusMove)
	if waitPrimary {
		pok.results.chargeName = 0
		return
	}
	pok.results.chargeName = 2
	defender.skipShield = skipped
	pok.isTriggered = pok.chargeMove[1].activateTrigger()
}

//return true if we are save for this round and false if there is need to force quick move
func checkQuickKnock(defender, pok *pokemon) (uint8, bool) {
	switch pok.isAttacker {
	case true:
		var potentialAttacks uint8
		switch true {
		case defender.moveCooldown == 1:
			potentialAttacks++
		case defender.quickMove.pvpDurationSeconds == 1:
			potentialAttacks++
		}
		if potentialAttacks == 0 {
			return 0, true
		}
		dQuickDamage := int16(0.5*defender.quickMove.pvpDamage*(defender.effectiveAttack.value/pok.effectiveDefence.value)*defender.quickMove.totalMultiplier) + 1

		if dQuickDamage >= pok.hp {
			return 0, false
		}
		return 1, true
	default:
		if defender.results.actionCode != 1 {
			return 0, true
		}
		dQuickDamage := int16(0.5*defender.quickMove.pvpDamage*(defender.effectiveAttack.value/pok.effectiveDefence.value)*defender.quickMove.totalMultiplier) + 1
		if dQuickDamage >= pok.hp {
			return 0, false
		}
		return 1, true
	}
}

//return true if we are save for this round and false if there is need to force quick move
func checkChargeKnock(defender, pok *pokemon) bool {
	//if priority is on our side return true
	if pok.effectiveAttack.value > defender.effectiveAttack.value {
		return true
	}
	if pok.effectiveAttack.value == defender.effectiveAttack.value && pok.isAttacker {
		return true
	}
	//else calculate if we can survive opponents hit this round
	switch pok.isAttacker {
	case true:
		for _, value := range defender.chargeMove {
			if int16(defender.energy) < -value.pvpEnergy {
				continue
			}
			dChargeDamage := int16(0.5*value.pvpDamage*(defender.effectiveAttack.value/pok.effectiveDefence.value)*value.totalMultiplier) + 1
			if pok.shields != 0 {
				dChargeDamage = 1
			}

			if dChargeDamage >= pok.hp {
				return false
			}
		}

		return true
	default:
		if defender.results.actionCode != 2 {
			return true
		}
		dChargeDamage := int16(0.5*defender.chargeMove[defender.results.chargeName-1].pvpDamage*(defender.effectiveAttack.value/pok.effectiveDefence.value)*defender.chargeMove[defender.results.chargeName-1].totalMultiplier) + 1
		if pok.shields != 0 {
			dChargeDamage = 1
		}

		if dChargeDamage >= pok.hp {
			return false
		}
		return true
	}
}

//returns true when it ok to wait for primary move and false if we need to use secondary move
func checkFeint(defender, pok *pokemon, bonus uint8) bool {
	switch pok.isAttacker {
	case true:

		var defenderAttackTimes uint8
		switch true {
		case pok.quickMove.pvpDurationSeconds+1 < defender.moveCooldown:
			return true
		case pok.quickMove.pvpDurationSeconds+1 == defender.moveCooldown:
			defenderAttackTimes = 1
			defenderAttackTimes += bonus
		default:
			defenderAttackTimes = (pok.quickMove.pvpDurationSeconds + 1 - defender.moveCooldown) / defender.quickMove.pvpDurationSeconds
			defenderAttackTimes += bonus
		}
		if defenderAttackTimes < 1 {
			return true
		}
		dQuickDamage := int16(0.5*defender.quickMove.pvpDamage*(defender.effectiveAttack.value/pok.effectiveDefence.value)*defender.quickMove.totalMultiplier) + 1
		if (int16(defenderAttackTimes) * dQuickDamage) > pok.hp {
			return false
		}

		energyAfter := int16(defender.energy) + defender.quickMove.pvpEnergy*int16(defenderAttackTimes)
		for _, value := range defender.chargeMove {
			if energyAfter < -value.pvpEnergy {
				continue
			}
			dChargeDamage := int16(0.5*value.pvpDamage*(defender.effectiveAttack.value/pok.effectiveDefence.value)*value.totalMultiplier) + 1
			if pok.shields != 0 {
				dChargeDamage = 1
			}

			if dChargeDamage >= pok.hp {
				return false
			}
		}
		return true
	default:
		var defenderAttackTimes uint8
		switch true {
		case pok.quickMove.pvpDurationSeconds < defender.moveCooldown:
			return true
		case pok.quickMove.pvpDurationSeconds == defender.moveCooldown:
			defenderAttackTimes = 1
			defenderAttackTimes += bonus
		default:
			defenderAttackTimes = (pok.quickMove.pvpDurationSeconds - defender.moveCooldown) / defender.quickMove.pvpDurationSeconds
			defenderAttackTimes += bonus
		}
		if defenderAttackTimes < 1 {
			return true
		}
		dQuickDamage := int16(0.5*defender.quickMove.pvpDamage*(defender.effectiveAttack.value/pok.effectiveDefence.value)*defender.quickMove.totalMultiplier) + 1
		if (int16(defenderAttackTimes) * dQuickDamage) > pok.hp {
			return false
		}

		energyAfter := int16(defender.energy) + defender.quickMove.pvpEnergy*int16(defenderAttackTimes)
		for _, value := range defender.chargeMove {
			if energyAfter < -value.pvpEnergy {
				continue
			}
			dChargeDamage := int16(0.5*value.pvpDamage*(defender.effectiveAttack.value/pok.effectiveDefence.value)*value.totalMultiplier) + 1
			if pok.shields != 0 {
				dChargeDamage = 1
			}

			if dChargeDamage >= pok.hp {
				return false
			}
		}
		return true
	}
}

func (m *move) activateTrigger() bool {
	if m.probability < float32(rand.Intn(101))/100.0 {
		return false
	}
	return true
}
