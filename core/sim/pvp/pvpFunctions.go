package pvp

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"log"
	"math/rand"
	"runtime"
	"sync"
	"time"
)

const pvpBaseMultiplier = 1.3
const shadowBonusAttack = 1.2
const shadowBonusDefence = 0.833
const stabBonusMultiplier = 1.2

var globalPvpObjectPool = sync.Pool{
	New: func() interface{} {
		return &PvpObject{}
	},
}

type branchingData struct {
	IsFreeHit  bool
	WhatToSkip int8
	Shields    uint8

	RoundsToDamage uint8

	MoveCooldown  uint8
	InitialHp     int16
	InitialEnergy app.Energy
}

//PvpObject contains all data related to  pvp process
type PvpObject struct {
	log app.PvpLog

	conStruct     *concurrentVars
	branchPointer *Tree

	attacker pokemon

	inDat setOfInDat

	defender pokemon

	logging  bool
	isTree   bool
	isPvpoke bool

	round uint16

	key      *uint32
	nodeNumb *uint32
	app      *app.SimApp
}

type setOfInDat struct {
	attacker branchingData
	defender branchingData
}

//TreeInitialData contains all data is needed to build new pvp tree
type TreeInitialData struct {
	AttackerData app.InitialData
	DefenderData app.InitialData
	WG           *sync.WaitGroup
	CustomMoves  *map[string]app.MoveBaseEntry

	Tree   *Tree
	Constr app.Constructor
	App    *app.SimApp
}

//NewPvpBetween starts pvp between two charcters defined by initial data, returns pvp log
func NewPvpBetween(inData app.SinglePvpInitialData) (app.PvpResults, error) {
	rand.Seed(time.Now().UnixNano())

	var wg sync.WaitGroup
	tree := &Tree{}

	switchTo, err := MakeTree(TreeInitialData{
		CustomMoves:  inData.CustomMoves,
		AttackerData: inData.AttackerData,
		DefenderData: inData.DefenderData,
		WG:           &wg,
		Tree:         tree,
		Constr:       inData.Constr,
		App:          inData.App,
	})
	if err != nil {
		return app.PvpResults{}, err
	}
	if switchTo {
		log.Println("Switched to PvPoke")
		runtime.GC()
		res, err := NewPvpBetweenPvpoke(inData)
		if err != nil {
			return app.PvpResults{}, err
		}
		return res, err
	}

	pvpData := globalPvpObjectPool.Get().(*PvpObject)
	*pvpData = PvpObject{}
	if tree == nil {
		return app.PvpResults{}, &customError{
			"Nil tree",
		}
	}
	pvpData.branchPointer = tree
	pvpData.app = inData.App

	var key uint32
	pvpData.key = &key
	*pvpData.key = pvpData.branchPointer.battleRaiting.ID

	pvpData.isTree = false
	pvpData.logging = inData.Logging
	pvpData.log = make([]app.LogValue, 0, 32)

	//PrintTreeVal(os.Stdout, tree, 0, 'M')
	//PrintTreeRate(os.Stdout, tree, 0, 'M')

	attackerTypes, err := pvpData.attacker.makeNewCharacter(&inData.AttackerData, pvpData, inData.CustomMoves)
	if err != nil {
		return app.PvpResults{}, err
	}

	defenderTypes, err := pvpData.defender.makeNewCharacter(&inData.DefenderData, pvpData, inData.CustomMoves)
	if err != nil {
		return app.PvpResults{}, err
	}

	err = pvpData.initializePvp(&inData.AttackerData, &inData.DefenderData, attackerTypes, defenderTypes)
	if err != nil {
		return app.PvpResults{}, err
	}

	pvpData.readInitialConditions(&inData.AttackerData, &inData.DefenderData)

	if (inData.Constr != app.Constructor{}) {
		pvpData.readConstructorData(&inData.Constr)
	}

	letsBattle(pvpData)

	result := app.PvpResults{
		Log:       pvpData.log,
		CreatedAt: time.Now(),
		IsRandom:  notToSaveResult(pvpData, inData.CustomMoves),
		Attacker: app.SingleResult{
			Name: inData.AttackerData.Name,
			Rate: uint16((500*(float32(pvpData.defender.maxHP)-processHP(pvpData.defender.hp))/float32(pvpData.defender.maxHP) + 500*processHP(pvpData.attacker.hp)/float32(pvpData.attacker.maxHP))),

			DamageBlocked:  pvpData.branchPointer.battleRaiting.attacker.potentialDamage,
			MaxHP:          pvpData.attacker.maxHP,
			HP:             uint16(processHP(pvpData.attacker.hp)),
			EnergyRemained: pvpData.attacker.energy,

			EnergyUsed: -pvpData.attacker.energySpent,
		},
		Defender: app.SingleResult{
			Name: inData.DefenderData.Name,
			Rate: uint16((500*(float32(pvpData.attacker.maxHP)-processHP(pvpData.attacker.hp))/float32(pvpData.attacker.maxHP) + 500*processHP(pvpData.defender.hp)/float32(pvpData.defender.maxHP))),

			DamageBlocked:  pvpData.branchPointer.battleRaiting.defender.potentialDamage,
			MaxHP:          pvpData.defender.maxHP,
			HP:             uint16(processHP(pvpData.defender.hp)),
			EnergyRemained: pvpData.defender.energy,

			EnergyUsed: -pvpData.defender.energySpent,
		},
	}
	return result, nil
}

func notToSaveResult(obj *PvpObject, customMoves *map[string]app.MoveBaseEntry) bool {
	for _, value := range obj.attacker.chargeMove {
		if notOk := value.checkMove(customMoves); notOk {
			return notOk
		}
	}
	if notOk := obj.attacker.quickMove.checkMove(customMoves); notOk {
		return notOk
	}
	for _, value := range obj.defender.chargeMove {
		if notOk := value.checkMove(customMoves); notOk {
			return notOk
		}
	}
	if notOk := obj.defender.quickMove.checkMove(customMoves); notOk {
		return notOk
	}
	return false
}

func (m *move) checkMove(customMoves *map[string]app.MoveBaseEntry) bool {
	if m.probability != 0 && m.probability != 1 {
		return true
	}
	if _, ok := (*customMoves)[m.title]; ok {
		return ok
	}
	return false
}

func (obj *PvpObject) initializePvp(attackerData, defenderData *app.InitialData, attackerTypes, defenderTypes []int) error {

	obj.attacker.setEffectiveStats(attackerData.InitialAttackStage, attackerData.InitialDefenceStage)
	obj.attacker.isAttacker = true
	obj.attacker.isGreedy = attackerData.IsGreedy

	obj.defender.setEffectiveStats(defenderData.InitialAttackStage, defenderData.InitialDefenceStage)
	obj.defender.isGreedy = defenderData.IsGreedy

	err := obj.attacker.getQuickMultipliersAgainst(attackerTypes, defenderTypes, obj)
	if err != nil {
		return err
	}
	err = obj.defender.getQuickMultipliersAgainst(defenderTypes, attackerTypes, obj)
	if err != nil {
		return err
	}
	err = obj.attacker.getChargeMultipliersAgainst(attackerTypes, defenderTypes, obj)
	if err != nil {
		return err
	}
	err = obj.defender.getChargeMultipliersAgainst(defenderTypes, attackerTypes, obj)
	if err != nil {
		return err
	}
	return nil
}

func (pok *pokemon) getQuickMultipliersAgainst(attackerTypes, defenderTypes []int, obj *PvpObject) error {
	if len(obj.app.TypesData) < pok.quickMove.moveType {
		return &customError{
			"Move type not found in the database",
		}
	}
	moveEfficiency := obj.app.TypesData[pok.quickMove.moveType]

	var stabMultiplier float32 = 1.0
	for _, pokType := range attackerTypes {
		if pokType == pok.quickMove.moveType {
			stabMultiplier = stabBonusMultiplier
			break
		}
	}

	var seMultiplier float32 = 1.0
	for _, trgType := range defenderTypes {
		if len(obj.app.TypesData) < trgType {
			return &customError{
				"Pokemon's type not found in the database",
			}
		}

		if moveEfficiency[trgType] != 0.0 {
			seMultiplier *= moveEfficiency[trgType]
		}

	}

	pok.quickMove.totalMultiplier = stabMultiplier * pvpBaseMultiplier * seMultiplier
	return nil
}

func (pok *pokemon) getChargeMultipliersAgainst(attackerTypes, defenderTypes []int, obj *PvpObject) error {
	for move, moveContent := range pok.chargeMove {
		if len(obj.app.TypesData) < moveContent.moveType {
			return &customError{
				"Move type not found in the database",
			}
		}
		moveEfficiency := obj.app.TypesData[moveContent.moveType]

		var stabMultiplier float32 = 1.0
		for _, pokType := range attackerTypes {
			if pokType == moveContent.moveType {
				stabMultiplier = stabBonusMultiplier
				break
			}
		}

		var seMultiplier float32 = 1.0
		for _, trgType := range defenderTypes {
			if len(obj.app.TypesData) < trgType {
				return &customError{
					"Pokemon's type not found in the database",
				}
			}

			if moveEfficiency[trgType] != 0.0 {
				seMultiplier *= moveEfficiency[trgType]
			}
		}

		pok.chargeMove[move].totalMultiplier = stabMultiplier * pvpBaseMultiplier * seMultiplier
	}
	return nil
}

func (obj *PvpObject) readInitialConditions(attackerData, defenderData *app.InitialData) {
	obj.attacker.setInitialConditions(attackerData)

	obj.defender.setInitialConditions(defenderData)
}

func (pok *pokemon) setInitialConditions(targetData *app.InitialData) {
	switch true {
	case targetData.InitialHp <= 0: //zero indicates that this paramenter shouldn`t be redeclared
		pok.hp = pok.maxHP
	case targetData.InitialHp > pok.maxHP:
		pok.hp = pok.maxHP
	default:
		pok.hp = targetData.InitialHp
	}
	//nullify energy, the set up initial value
	pok.energy = 0
	pok.energy.AddEnergy(int16(targetData.InitialEnergy))

	pok.shields = targetData.Shields
}

func letsBattle(obj *PvpObject) {
	if obj.logging {
		obj.log.MakeNewRound(obj.round)
		WriteHpEnergy(obj)
	}

	for obj.attacker.hp > 0 && obj.defender.hp > 0 {
		if obj.isTree && *obj.nodeNumb > obj.app.NodeLimit {
			return
		}
		nextRound(obj)
	}
	writeRoundResults(obj)
}

func writeRoundResults(obj *PvpObject) {
	if obj.logging {
		obj.round++
		obj.log.MakeNewRound(obj.round)
		WriteHpEnergy(obj)
	}
	if obj.isTree {
		writeClosingStats(obj)
	}
}

func geQuickCode(damage int16) uint8 {
	if damage == 0 {
		return 0
	}
	return 1
}

func handleWriteMove(obj *PvpObject, name string, code uint8, isAttacker bool) {
	if !obj.logging {
		return
	}
	if isAttacker {
		obj.log[len(obj.log)-1].Attacker.WriteMove(name, code)
		return
	}
	obj.log[len(obj.log)-1].Defender.WriteMove(name, code)
}

func handleWriteShield(obj *PvpObject, isUsed bool, isAttacker bool) {
	if !obj.logging {
		return
	}
	if isAttacker {
		obj.log[len(obj.log)-1].Attacker.WriteShield(isUsed)
		return
	}
	obj.log[len(obj.log)-1].Defender.WriteShield(isUsed)
}

func handleTrigger(obj *PvpObject, aStage, dStage int8, isAttacker, isSelf bool) {
	if !obj.logging {
		return
	}
	if isAttacker {
		obj.log[len(obj.log)-1].Attacker.WriteTrigger(aStage, dStage, isSelf)
		return
	}
	obj.log[len(obj.log)-1].Defender.WriteTrigger(aStage, dStage, isSelf)
}

//WriteHpEnergy writes hp and energy to pvp log
func WriteHpEnergy(obj *PvpObject) {
	if !obj.logging {
		return
	}
	obj.log[len(obj.log)-1].Attacker.HP = obj.attacker.hp
	obj.log[len(obj.log)-1].Attacker.Energy = obj.attacker.energy
	obj.log[len(obj.log)-1].Defender.HP = obj.defender.hp
	obj.log[len(obj.log)-1].Defender.Energy = obj.defender.energy
}

func nextRound(obj *PvpObject) {
	if obj.isTree {
		//every round update initial data of the branches
		updateData(obj)
	}
	if obj.logging {
		obj.log.MakeNewRound(obj.round + 1)
	}

	switch obj.attacker.effectiveAttack.value >= obj.defender.effectiveAttack.value {
	case true:
		obj.attacker.turn(obj)
		obj.defender.turn(obj)
	case false:
		obj.defender.turn(obj)
		obj.attacker.turn(obj)

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

		obj.attacker.treeMakeChargeEvent(obj)
		obj.attacker.makeTriggerEvent(obj)
		obj.defender.treeMakeShieldEvent(obj)

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

		obj.defender.treeMakeChargeEvent(obj)
		obj.defender.makeTriggerEvent(obj)
		obj.attacker.treeMakeShieldEvent(obj)

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
			obj.attacker.treeMakeChargeEvent(obj)
			obj.attacker.makeTriggerEvent(obj)
			obj.defender.treeMakeShieldEvent(obj)

			handleWriteMove(obj, obj.attacker.chargeMove[obj.attacker.results.chargeName-1].title, 11, true)

			obj.attacker.dealDamgeGetEnergy(obj)

			if obj.defender.hp <= 0 {
				obj.attacker.trigger(obj)
				WriteHpEnergy(obj)
				obj.round++
				return
			}

			obj.defender.treeMakeChargeEvent(obj)
			obj.defender.makeTriggerEvent(obj)
			obj.attacker.treeMakeShieldEvent(obj)

			handleWriteMove(obj, obj.defender.chargeMove[obj.defender.results.chargeName-1].title, 11, false)

			obj.attacker.trigger(obj)
			obj.defender.dealDamgeGetEnergy(obj)

			obj.defender.trigger(obj)

			WriteHpEnergy(obj)
			resetSwitchersA(obj)
			resetSwitchersD(obj)
			if obj.logging {
				obj.log[len(obj.log)-1].Attacker.WriteOrder()
			}
			obj.round++
			return
		}

		obj.defender.treeMakeChargeEvent(obj)
		obj.defender.makeTriggerEvent(obj)
		obj.attacker.treeMakeShieldEvent(obj)

		handleWriteMove(obj, obj.defender.chargeMove[obj.defender.results.chargeName-1].title, 11, false)

		obj.defender.dealDamgeGetEnergy(obj)

		if obj.attacker.hp <= 0 {
			obj.defender.trigger(obj)
			WriteHpEnergy(obj)
			obj.round++
			return
		}

		obj.attacker.treeMakeChargeEvent(obj)
		obj.attacker.makeTriggerEvent(obj)
		obj.defender.treeMakeShieldEvent(obj)

		handleWriteMove(obj, obj.attacker.chargeMove[obj.attacker.results.chargeName-1].title, 11, true)

		obj.defender.trigger(obj)
		obj.attacker.dealDamgeGetEnergy(obj)

		obj.attacker.trigger(obj)

		WriteHpEnergy(obj)
		resetSwitchersA(obj)
		resetSwitchersD(obj)
		if obj.logging {
			obj.log[len(obj.log)-1].Defender.WriteOrder()
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

func resetSwitchersA(obj *PvpObject) {
	if obj.isTree {
		obj.attacker.fixMove = false
		obj.attacker.fixTrigger = false
		obj.defender.fixShield = false
	}
	obj.attacker.whatToSkip = 0
	obj.defender.skipShield = false
	obj.attacker.isTriggered = false
	obj.attacker.statsRecorded = false
}
func resetSwitchersD(obj *PvpObject) {
	if obj.isTree {
		obj.defender.fixMove = false
		obj.defender.fixTrigger = false
		obj.attacker.fixShield = false
	}
	obj.defender.whatToSkip = 0 //and nullify move to skip
	obj.attacker.skipShield = false
	obj.defender.isTriggered = false
	obj.defender.statsRecorded = false
}

func (pok *pokemon) treeMakeShieldEvent(obj *PvpObject) {
	if !obj.isTree {
		return
	}
	// if we have no shields, do nothing
	if pok.shields == 0 {
		return
	}
	if pok.inConstructorMode {
		switch pok.skipShield {
		case true:
			obj.makeASingleBranch(pok.isAttacker, false, false)
		case false:
			obj.makeASingleBranch(pok.isAttacker, false, true)
		}
		return
	}
	//if we skipped once, there os no need to evaluate again
	//if we decided somthing, there is no need to reevaluate until the end of the round
	if pok.fixShield {
		return
	}
	// if we have shields, create a fork:
	//in the first timeline the guy will use shield and in the other he will skip shielding
	pok.skipShield = true
	pok.fixShield = true

	pok.makeFork(obj, false)
	return
}

func (pok *pokemon) treeMakeChargeEvent(obj *PvpObject) {
	if !obj.isTree {
		return
	}

	if pok.inConstructorMode {
		return
	}

	// if we`ve skipped once, use selected move

	//if we selected skip once, there is no need to think about it again
	if pok.fixMove {
		return
	}

	// if we haven`t skipped yet, create moves fork:
	//in the first timeline the guy will use current charge move and in the other he will skip this move
	pok.fixMove = true
	if len(pok.chargeMove) > 1 {
		pok.whatToSkip = pok.results.chargeName //set up move to skip

		pok.makeFork(obj, true)
		return
	}
	// if there is the only move we have no choice
	if len(pok.chargeMove) == 1 {
		obj.makeASingleBranch(pok.isAttacker, true, true)
	}
}

func (pok *pokemon) dealDamgeGetEnergy(obj *PvpObject) {
	if pok.results.actionCode == 0 { // if action == 0 pokemon is waiting
		return
	}
	defender := whoIsDfender(pok, obj) //check if pok and dat.attacker are the same guy
	var (
		damage int16
		energy app.Energy
	)
	switch pok.results.actionCode {
	case 1:
		damage = int16(0.5*pok.quickMove.pvpDamage*(pok.effectiveAttack.value/defender.effectiveDefence.value)*pok.quickMove.totalMultiplier) + 1
		energy = app.Energy(pok.quickMove.pvpEnergy)

		//unlock opponent's shield if pokemon is in constructor mode
		if pok.inConstructorMode {
			defender.fixShield = false
		}
	case 2:
		isUsed := defender.useShield()
		handleWriteShield(obj, isUsed, defender.isAttacker)
		damage = int16(0.5*pok.chargeMove[pok.results.chargeName-1].pvpDamage*(pok.effectiveAttack.value/defender.effectiveDefence.value)*pok.chargeMove[pok.results.chargeName-1].totalMultiplier) + 1
		energy = app.Energy(pok.chargeMove[pok.results.chargeName-1].pvpEnergy)
		switch isUsed {
		case true:
			if !pok.statsRecorded {
				pok.writeUtilizationStats(damage, energy)
			}
			damage = 1
		case false:
			pok.writeUtilizationStats(1, energy)
		}
	}

	//unlockpokemon variables if it is in contructor mode
	if pok.inConstructorMode {
		pok.whatToSkip = 0
		pok.fixMove = false
		pok.fixTrigger = false
		pok.inConstructorMode = false
	}

	defender.hp = defender.hp - damage //then deal damage to the other guy
	pok.energy.AddEnergy(int16(energy))
}

func (pok *pokemon) writeUtilizationStats(damage int16, energy app.Energy) {
	pok.statsRecorded = true
	switch true {
	case damage != 1:
		pok.potentialDamage += damage
		pok.energySpent += energy
	case pok.results.chargeName != 0:
		pok.energySpent += energy
	}
}

func whoIsDfender(pok *pokemon, obj *PvpObject) *pokemon { //checks who is the other pok in the obj
	switch pok.isAttacker {
	case true:
		return &obj.defender
	default:
		return &obj.attacker
	}
}

func (pok *pokemon) useShield() bool {
	//if pok has no shields, do nothing
	if pok.shields == 0 {
		return false
	}
	//if we decided to skip this time, skip
	if pok.skipShield {
		return false
	}
	//if we decided not to skip this time, use shield
	pok.shields--
	return true
}

func (pok *pokemon) giveOpponentFreeHit() {
	if pok.moveCooldown == 0 {
		return
	}
	pok.moveCooldown = 0
	pok.roundsToDamage = 0
	pok.isFreeHit = true
}

func (pok *pokemon) trigger(obj *PvpObject) {
	if !pok.chargeMove[pok.results.chargeName-1].subjectExists {
		return
	}
	if !pok.isTriggered {
		return
	}
	switch obj.app.PokemonMovesBase[pok.chargeMove[pok.results.chargeName-1].title].Subject {
	case "Opponent":
		defender := whoIsDfender(pok, obj)
		aStage, dStage := pok.statsChange(defender, pok.chargeMove[pok.results.chargeName-1].title, obj)

		handleTrigger(obj, aStage, dStage, pok.isAttacker, false)

	case "Self":
		aStage, dStage := pok.statsChange(pok, pok.chargeMove[pok.results.chargeName-1].title, obj)
		handleTrigger(obj, aStage, dStage, pok.isAttacker, true)
	}
}

func (pok *pokemon) makeTriggerEvent(obj *PvpObject) {
	if !obj.isTree {
		return
	}
	if pok.inConstructorMode {
		if obj.app.PokemonMovesBase[pok.chargeMove[pok.results.chargeName-1].title].Subject == "" {
			return
		}
		obj.makeASingleBranch(pok.isAttacker, true, true)
		obj.branchPointer.TreeVal.isTriggered = pok.isTriggered
		return
	}
	if pok.fixTrigger {
		return
	}

	if obj.app.PokemonMovesBase[pok.chargeMove[pok.results.chargeName-1].title].Subject == "" {
		return
	}

	obj.makeASingleBranch(pok.isAttacker, true, true)
	if pok.chargeMove[pok.results.chargeName-1].probability < float32(rand.Intn(101))/100.0 {
		pok.isTriggered = false
		pok.fixTrigger = true
		return
	}
	pok.isTriggered = true
	obj.branchPointer.TreeVal.isTriggered = true
	pok.fixTrigger = true
	return

}

func (pok *pokemon) statsChange(target *pokemon, chargeMove string, obj *PvpObject) (int8, int8) {
	var (
		aStage int8
		dStage int8
	)
	for _, value := range obj.app.PokemonMovesBase[chargeMove].Stat {
		if value == "Atk" {
			aStage = obj.app.PokemonMovesBase[chargeMove].StageDelta
			target.setEffectiveAttack((target.effectiveAttack.stageValue + aStage))
		}
		if value == "Def" {
			dStage = obj.app.PokemonMovesBase[chargeMove].StageDelta
			target.setEffectiveDefence((target.effectiveDefence.stageValue + dStage))
		}
	}
	return aStage, dStage
}

func (pok *pokemon) turn(obj *PvpObject) {
	if pok.moveCooldown != 0.0 {
		pok.hit() //if there is a cooldown (we made a hit last time), check if it`s time to deal a damage
		pok.moveCooldown--
		if pok.roundsToDamage != 0.0 {
			pok.roundsToDamage--
		}
		pok.results.chargeName = 0
		return
	}

	pok.whatToDoInNextRound(obj)
	if pok.moveCooldown != 0 { //if we strated a new quick move, decrease cooldowns
		pok.moveCooldown--
		pok.roundsToDamage--
	}
}

func (pok *pokemon) whatToDoInNextRound(obj *PvpObject) {
	if pok.isFreeHit {
		pok.freeHit()
		return
	}
	pok.makeChargedHit(obj)
	if pok.results.chargeName == 0 {
		pok.makeQuickHit()
		return
	}
}

func (pok *pokemon) makeChargedHit(obj *PvpObject) {
	switch obj.isTree {
	case true:
		pok.checkAvalabilityOfChargeMovesTree()
	case false:
		pok.checkAvalabilityOfChargeMoves(obj)
	}

	if pok.results.chargeName == 0 {
		pok.results.actionCode = 0
		return
	}

	pok.useChargeMove()
}

func (pok *pokemon) checkAvalabilityOfChargeMoves(obj *PvpObject) {
	defender := whoIsDfender(pok, obj)
	for moveNumb, stats := range pok.chargeMove {
		//check if we are able to use any move
		if pok.whatToSkip == int8(moveNumb+1) || int16(pok.energy) < -stats.pvpEnergy {
			continue
		}
		var skipped bool
		//if we have not skipped anything yet and there are two moves, look in the tree if we need to skip this one
		if pok.whatToSkip == 0 {
			skipped = findAndSolve(obj)
		}

		//if there is no need to skip - use it now
		if !skipped {
			if stats.subjectExists {
				findAndSolve(obj)
			}
			pok.results.chargeName = int8(moveNumb + 1)
			pok.isTriggered = obj.branchPointer.TreeVal.isTriggered
			if defender.shields != 0 {
				defender.skipShield = findAndSolve(obj)
			}
			return
		}
		//if there is such a need, skip this move
		pok.whatToSkip = int8(moveNumb + 1)
		//and check if the other move is ready
		continue
	}
	//if no moves available, use nothing
	pok.results.chargeName = 0
}

func findAndSolve(obj *PvpObject) bool {
	if obj.branchPointer.Left == nil && obj.branchPointer.Right == nil {
		return false
	}
	if obj.branchPointer.Left != nil && obj.branchPointer.Right != nil {
		return solveFork(obj)
	}
	if obj.branchPointer.Left != nil && obj.branchPointer.Left.battleRaiting.ID == *obj.key {
		return selectLeft(obj)
	}
	if obj.branchPointer.Right != nil && obj.branchPointer.Right.battleRaiting.ID == *obj.key {
		return selectRight(obj)
	}
	println("We've lost")
	return false
}

func solveFork(obj *PvpObject) bool {
	if obj.branchPointer.Left.battleRaiting.ID == *obj.key {
		return selectLeft(obj)
	}

	return selectRight(obj)
}

func selectLeft(obj *PvpObject) bool {
	obj.branchPointer = obj.branchPointer.Left
	return true
}
func selectRight(obj *PvpObject) bool {
	obj.branchPointer = obj.branchPointer.Right
	return false
}

func (pok *pokemon) checkAvalabilityOfChargeMovesTree() {
	for moveNumb, stats := range pok.chargeMove {
		if pok.whatToSkip == int8(moveNumb+1) || int16(pok.energy) < -stats.pvpEnergy {
			continue
		}
		pok.results.chargeName = int8(moveNumb + 1)
		return
	}
	pok.results.chargeName = 0
}

func (pok *pokemon) useChargeMove() {
	pok.results.actionCode = 2
}

func (pok *pokemon) makeQuickHit() {
	if pok.isFreeHit {
		pok.freeHit()
		return
	}
	pok.hit()
}

func (pok *pokemon) freeHit() {
	pok.moveCooldown = pok.quickMove.pvpDurationSeconds //start new attack
	pok.results.actionCode = 1
	pok.roundsToDamage = pok.quickMove.pvpDuration //set duration for hit to deal a damge
	pok.isFreeHit = false                          //disable free hits
}

func (pok *pokemon) hit() {
	if pok.moveCooldown == 0 { //if pokemon doesn`t do anything start doing quick attack
		pok.moveCooldown = pok.quickMove.pvpDurationSeconds
		pok.roundsToDamage = pok.quickMove.pvpDuration
	}
	if pok.roundsToDamage == 0 { //if it`s already damage round - deal it
		pok.results.actionCode = 1
		return
	}
	pok.results.actionCode = 0
}

//RatingPvp starts single pvp for rating module
func RatingPvp(attackerData, defenderData *app.InitialData, application *app.SimApp) (app.RatingResult, error) {
	rand.Seed(time.Now().UnixNano())
	var wg sync.WaitGroup

	tree := &Tree{}

	switchTo, err := MakeTree(TreeInitialData{
		CustomMoves:  &map[string]app.MoveBaseEntry{},
		AttackerData: *attackerData,
		DefenderData: *defenderData,
		WG:           &wg,
		Tree:         tree,
		App:          application,
	})
	if err != nil {
		return app.RatingResult{}, err
	}

	if switchTo {
		log.Println("Switched to PvPoke")
		res, err := NewPvpBetweenPvpoke(app.SinglePvpInitialData{
			CustomMoves:  &map[string]app.MoveBaseEntry{},
			AttackerData: *attackerData,
			DefenderData: *defenderData,
			Constr:       app.Constructor{},
			App:          application,
			Logging:      false,
		})

		if err != nil {
			return app.RatingResult{}, err
		}
		//generate shaodw names
		aName := attackerData.Name
		if attackerData.IsShadow {
			aName += " (Shadow)"
		}
		dName := defenderData.Name
		if defenderData.IsShadow {
			dName += " (Shadow)"
		}

		result := app.RatingResult{
			Attacker: app.RatingBattleResult{
				Rate:   res.Attacker.Rate,
				Name:   aName,
				Quick:  attackerData.QuickMove,
				Charge: attackerData.ChargeMove,
			},
			Defender: app.RatingBattleResult{
				Rate:   res.Defender.Rate,
				Name:   dName,
				Quick:  defenderData.QuickMove,
				Charge: defenderData.ChargeMove,
			},
		}
		runtime.GC()
		return result, nil
	}

	pvpData := globalPvpObjectPool.Get().(*PvpObject)
	*pvpData = PvpObject{}
	if tree == nil {
		return app.RatingResult{}, &customError{
			"Nil tree",
		}
	}
	pvpData.branchPointer = tree
	pvpData.app = application

	var key uint32
	pvpData.key = &key
	*pvpData.key = pvpData.branchPointer.battleRaiting.ID

	pvpData.isTree = false
	pvpData.logging = false

	attackerTypes, err := pvpData.attacker.makeNewCharacter(attackerData, pvpData, &map[string]app.MoveBaseEntry{})
	if err != nil {
		return app.RatingResult{}, err
	}

	defenderTypes, err := pvpData.defender.makeNewCharacter(defenderData, pvpData, &map[string]app.MoveBaseEntry{})
	if err != nil {
		return app.RatingResult{}, err
	}

	err = pvpData.initializePvp(attackerData, defenderData, attackerTypes, defenderTypes)
	if err != nil {
		return app.RatingResult{}, err
	}

	pvpData.readInitialConditions(attackerData, defenderData)

	letsBattle(pvpData)

	//generate shaodw names
	aName := attackerData.Name
	if attackerData.IsShadow {
		aName += " (Shadow)"
	}
	dName := defenderData.Name
	if defenderData.IsShadow {
		dName += " (Shadow)"
	}

	result := app.RatingResult{
		Attacker: app.RatingBattleResult{
			Rate:   uint16((500*(float32(pvpData.defender.maxHP)-processHP(pvpData.defender.hp))/float32(pvpData.defender.maxHP) + 500*processHP(pvpData.attacker.hp)/float32(pvpData.attacker.maxHP))),
			Name:   aName,
			Quick:  attackerData.QuickMove,
			Charge: attackerData.ChargeMove,
		},
		Defender: app.RatingBattleResult{
			Rate:   uint16((500*(float32(pvpData.attacker.maxHP)-processHP(pvpData.attacker.hp))/float32(pvpData.attacker.maxHP) + 500*processHP(pvpData.defender.hp)/float32(pvpData.defender.maxHP))),
			Name:   dName,
			Quick:  defenderData.QuickMove,
			Charge: defenderData.ChargeMove,
		},
	}
	return result, nil
}

func (obj *PvpObject) readConstructorData(constr *app.Constructor) {
	obj.round = constr.Round

	obj.attacker.setStatusData(&constr.Attacker, obj)
	obj.defender.setStatusData(&constr.Defender, obj)
}

func (pok *pokemon) setStatusData(status *app.Status, obj *PvpObject) {
	pok.isTriggered = status.IsTriggered
	pok.fixTrigger = true

	pok.skipShield = status.SkipShield
	pok.fixShield = true

	switch status.WhatToSkip != 0 {
	case true:
		pok.whatToSkip = status.WhatToSkip
		pok.roundsToDamage = 0
		pok.moveCooldown = 0
		pok.fixMove = true
	case false:
		pok.whatToSkip = 0
		pok.roundsToDamage = status.RoundsToDamage
		pok.moveCooldown = status.MoveCooldown
		pok.fixMove = true
	}

	pok.inConstructorMode = true
}
