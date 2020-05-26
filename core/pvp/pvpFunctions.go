package pvpsim

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"os"
	"runtime"
	"sync"
	"time"
)

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
	InitialEnergy Energy
}

//PvpObject contains all data related to  pvp process
type PvpObject struct {
	log PvpLog

	conStruct     *concurrentVars
	branchPointer *Tree

	attacker pokemon

	inDat setOfInDat

	defender pokemon

	logging   bool
	isTree    bool
	isPvppoke bool

	round uint16

	key      *uint32
	nodeNumb *uint32
}

type setOfInDat struct {
	attacker branchingData
	defender branchingData
}

//PvpLog contains pvp log as slice of rounds.
//Each round contains slice of events, each event is structure of logValue type
type PvpLog []logValue

type logValue struct {
	Round    uint16
	Attacker event
	Defender event
}

type event struct {
	HP         int16
	Energy     Energy
	ActionName string
	ActionCode uint8
	StageA     int8
	StageD     int8
	IsSelf     bool
	Order      bool

	ShieldIsUsed bool
}

func (l *PvpLog) makeNewRound(round uint16) {
	*l = append(*l, logValue{Round: round})
}

//PrintLog prints log using fmt.Println
func (l *PvpLog) PrintLog() {
	for _, roundValue := range *l {
		fmt.Println(roundValue)
	}
}

//WriteLog writes log to a file
func (l *PvpLog) WriteLog(fileName string) error {
	file, err := json.MarshalIndent(l, "", " ")
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(fileName, file, 0644)
	if err != nil {
		return err
	}
	return nil
}

//ReadLog reads log from a fila using
func (l *PvpLog) ReadLog(fileName string) error {
	file, err := os.Open(fileName)
	if err != nil {
		return err
	}

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}
	file.Close()
	err = json.Unmarshal(byteValue, l)
	if err != nil {
		return err
	}
	return nil
}

//TreeInitialData contains all data is needed to build new pvp tree
type TreeInitialData struct {
	AttackerData InitialData
	DefenderData InitialData
	WG           *sync.WaitGroup

	Tree   *Tree
	Constr Constructor
}

//SinglePvpInitialData contains all data is needed to build new singe pvp
type SinglePvpInitialData struct {
	AttackerData InitialData
	DefenderData InitialData

	Constr Constructor
}

//NewPvpBetween starts pvp between two charcters defined by initial data, returns pvp log
func NewPvpBetween(inData SinglePvpInitialData) (PvpResults, error) {
	rand.Seed(time.Now().UnixNano())

	var wg sync.WaitGroup
	tree := &Tree{}

	switchTo, err := MakeTree(&TreeInitialData{
		AttackerData: inData.AttackerData,
		DefenderData: inData.DefenderData,
		WG:           &wg,
		Tree:         tree,
		Constr:       inData.Constr,
	})
	if err != nil {
		return PvpResults{}, err
	}
	if switchTo {
		log.Println("Switched to PvPoke")
		runtime.GC()
		res, err := NewPvpBetweenPvppoke(inData)
		if err != nil {
			return PvpResults{}, err
		}
		return res, err
	}

	pvpData := globalPvpObjectPool.Get().(*PvpObject)
	*pvpData = PvpObject{}
	if tree == nil {
		return PvpResults{}, &customError{
			"Nil tree",
		}
	}
	pvpData.branchPointer = tree

	var key uint32
	pvpData.key = &key
	*pvpData.key = pvpData.branchPointer.battleRaiting.ID

	pvpData.isTree = false
	pvpData.logging = true
	pvpData.log = make([]logValue, 0, 32)

	//PrintTreeVal(os.Stdout, tree, 0, 'M')
	//PrintTreeRate(os.Stdout, tree, 0, 'M')

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

	letsBattle(pvpData)

	result := PvpResults{
		Log:       pvpData.log,
		CreatedAt: time.Now(),
		IsRandom:  checkResultRandomness(pvpData),
		Attacker: SingleResult{
			Name: inData.AttackerData.Name,
			Rate: uint16((500*(float32(pvpData.defender.maxHP)-processHP(pvpData.defender.hp))/float32(pvpData.defender.maxHP) + 500*processHP(pvpData.attacker.hp)/float32(pvpData.attacker.maxHP))),

			DamageBlocked:  pvpData.branchPointer.battleRaiting.attacker.potentialDamage,
			MaxHP:          pvpData.attacker.maxHP,
			HP:             uint16(processHP(pvpData.attacker.hp)),
			EnergyRemained: pvpData.attacker.energy,

			EnergyUsed: -pvpData.attacker.energySpent,
		},
		Defender: SingleResult{
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

func checkResultRandomness(obj *PvpObject) bool {
	for _, value := range obj.attacker.chargeMove {
		if value.probability != 0 && value.probability != 1 {
			return true
		}
	}
	for _, value := range obj.defender.chargeMove {
		if value.probability != 0 && value.probability != 1 {
			return true
		}

	}
	return false
}

//PvpResults contains results of a single pvp: log, combatants and attackers`s hp rate
type PvpResults struct {
	CreatedAt time.Time
	I         int
	K         int
	Log       PvpLog
	Attacker  SingleResult
	Defender  SingleResult
	IsRandom  bool
}

type SingleResult struct {
	Name string
	Rate uint16

	DamageBlocked  int16
	MaxHP          int16
	HP             uint16
	EnergyRemained Energy

	EnergyUsed Energy
}

func (obj *PvpObject) initializePvp(attackerData, defenderData *InitialData, attackerTypes, defenderTypes []int) error {

	obj.attacker.setEffectiveStats(attackerData.InitialAttackStage, attackerData.InitialDefenceStage)
	obj.attacker.isAttacker = true
	obj.attacker.isGreedy = attackerData.IsGreedy

	obj.defender.setEffectiveStats(defenderData.InitialAttackStage, defenderData.InitialDefenceStage)
	obj.defender.isGreedy = defenderData.IsGreedy

	err := obj.attacker.getQuickMultipliersAgainst(attackerTypes, defenderTypes)
	if err != nil {
		return err
	}
	err = obj.defender.getQuickMultipliersAgainst(defenderTypes, attackerTypes)
	if err != nil {
		return err
	}
	err = obj.attacker.getChargeMultipliersAgainst(attackerTypes, defenderTypes)
	if err != nil {
		return err
	}
	err = obj.defender.getChargeMultipliersAgainst(defenderTypes, attackerTypes)
	if err != nil {
		return err
	}
	return nil
}

func (pok *pokemon) getQuickMultipliersAgainst(attackerTypes, defenderTypes []int) error {
	if len(app.typesData) < pok.quickMove.moveType {
		return &customError{
			"Move type not found in the database",
		}
	}
	moveEfficiency := app.typesData[pok.quickMove.moveType]

	const pvpBaseMultiplier = 1.3

	var stabMultiplier float32 = 1.0
	for _, pokType := range attackerTypes {
		if pokType == pok.quickMove.moveType {
			stabMultiplier = 1.2
			break
		}
	}

	var seMultiplier float32 = 1.0
	for _, trgType := range defenderTypes {
		if len(app.typesData) < trgType {
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

func (pok *pokemon) getChargeMultipliersAgainst(attackerTypes, defenderTypes []int) error {
	for move, moveContent := range pok.chargeMove {
		if len(app.typesData) < moveContent.moveType {
			return &customError{
				"Move type not found in the database",
			}
		}
		moveEfficiency := app.typesData[moveContent.moveType]

		const pvpBaseMultiplier = 1.3

		var stabMultiplier float32 = 1.0
		for _, pokType := range attackerTypes {
			if pokType == moveContent.moveType {
				stabMultiplier = 1.2
				break
			}
		}

		var seMultiplier float32 = 1.0
		for _, trgType := range defenderTypes {
			if len(app.typesData) < trgType {
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

func (obj *PvpObject) readInitialConditions(attackerData, defenderData *InitialData) {
	obj.attacker.setInitialConditions(attackerData)

	obj.defender.setInitialConditions(defenderData)
}

func (pok *pokemon) setInitialConditions(targetData *InitialData) {
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
	pok.energy.addEnergy(targetData.InitialEnergy)

	pok.shields = targetData.Shields
}

func letsBattle(obj *PvpObject) {
	if obj.logging {
		obj.log.makeNewRound(obj.round)
		WriteHpEnergy(obj)
	}

	for obj.attacker.hp > 0 && obj.defender.hp > 0 {
		if obj.isTree && *obj.nodeNumb > app.nodeLimit {
			return
		}

		nextRound(obj)

		if obj.attacker.inConstructorMode || obj.defender.inConstructorMode {
			obj.attacker.inConstructorMode = false
			obj.defender.inConstructorMode = false
		}
	}
	writeRoundResults(obj)
}

func writeRoundResults(obj *PvpObject) {
	if obj.logging {
		obj.round++
		obj.log.makeNewRound(obj.round)
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

func (e *event) WriteMove(name string, code uint8) {
	if code == 0 {
		return
	}
	e.ActionName = name
	e.ActionCode = code
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
func (e *event) WriteShield(isUsed bool) {
	e.ShieldIsUsed = isUsed
}

func handleTrigger(obj *PvpObject, aStage, dStage int8, isAttacker, isSelf bool) {
	if !obj.logging {
		return
	}
	if isAttacker {
		obj.log[len(obj.log)-1].Attacker.writeTrigger(aStage, dStage, isSelf)
		return
	}
	obj.log[len(obj.log)-1].Defender.writeTrigger(aStage, dStage, isSelf)
}

func WriteHpEnergy(obj *PvpObject) {
	if !obj.logging {
		return
	}
	obj.log[len(obj.log)-1].Attacker.HP = obj.attacker.hp
	obj.log[len(obj.log)-1].Attacker.Energy = obj.attacker.energy
	obj.log[len(obj.log)-1].Defender.HP = obj.defender.hp
	obj.log[len(obj.log)-1].Defender.Energy = obj.defender.energy
}

func (e *event) writeTrigger(aStage, dStage int8, isSelf bool) {
	e.IsSelf = isSelf
	e.StageA = aStage
	e.StageD = dStage
}

func nextRound(obj *PvpObject) {
	if obj.isTree {
		//every round update initial data of the branches
		updateData(obj)
	}
	if obj.logging {
		obj.log.makeNewRound(obj.round + 1)
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
				obj.log[len(obj.log)-1].Attacker.writeOrder()
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

func (e *event) writeOrder() {
	e.Order = true
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
		energy Energy
	)
	switch pok.results.actionCode {
	case 1:
		damage = int16(0.5*pok.quickMove.pvpDamage*(pok.effectiveAttack.value/defender.effectiveDefence.value)*pok.quickMove.totalMultiplier) + 1
		energy = Energy(pok.quickMove.pvpEnergy)
	case 2:
		isUsed := defender.useShield()
		handleWriteShield(obj, isUsed, defender.isAttacker)
		damage = int16(0.5*pok.chargeMove[pok.results.chargeName-1].pvpDamage*(pok.effectiveAttack.value/defender.effectiveDefence.value)*pok.chargeMove[pok.results.chargeName-1].totalMultiplier) + 1
		energy = Energy(pok.chargeMove[pok.results.chargeName-1].pvpEnergy)
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
	defender.hp = defender.hp - damage //then deal damage to the other guy
	pok.energy.addEnergy(energy)
}

func (pok *pokemon) writeUtilizationStats(damage int16, energy Energy) {
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
	switch app.pokemonMovesBase[pok.chargeMove[pok.results.chargeName-1].title].Subject {
	case "Opponent":
		defender := whoIsDfender(pok, obj)
		aStage, dStage := pok.statsChange(defender, pok.chargeMove[pok.results.chargeName-1].title)

		handleTrigger(obj, aStage, dStage, pok.isAttacker, false)

	case "Self":
		aStage, dStage := pok.statsChange(pok, pok.chargeMove[pok.results.chargeName-1].title)
		handleTrigger(obj, aStage, dStage, pok.isAttacker, true)
	}
}

func (pok *pokemon) makeTriggerEvent(obj *PvpObject) {
	if !obj.isTree {
		return
	}
	if pok.inConstructorMode {
		if app.pokemonMovesBase[pok.chargeMove[pok.results.chargeName-1].title].Subject == "" {
			return
		}
		obj.makeASingleBranch(pok.isAttacker, true, true)
		obj.branchPointer.TreeVal.isTriggered = pok.isTriggered
		return
	}
	if pok.fixTrigger {
		return
	}

	if app.pokemonMovesBase[pok.chargeMove[pok.results.chargeName-1].title].Subject == "" {
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

func (pok *pokemon) statsChange(target *pokemon, chargeMove string) (int8, int8) {
	var (
		aStage int8
		dStage int8
	)
	for _, value := range app.pokemonMovesBase[chargeMove].Stat {
		if value == "Atk" {
			aStage = app.pokemonMovesBase[chargeMove].StageDelta
			target.setEffectiveAttack((target.effectiveAttack.stageValue + aStage))
		}
		if value == "Def" {
			dStage = app.pokemonMovesBase[chargeMove].StageDelta
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

//ErrorChan a set of errors returned by matrix battle
type ErrorChan chan error

//Flush prints all errors got from matrix battle
func (eCh *ErrorChan) Flush() string {
	var errorString string
	for value := range *eCh {
		errorString += value.Error()
		errorString += ", "
	}
	return errorString
}

type MatrixResult struct {
	I        int
	K        int
	Attacker SingleMatrixResult
	Defender SingleMatrixResult
}

type SingleMatrixResult struct {
	Rate uint16
}

type RatingResult struct {
	Attacker RatingBattleResult
	Defender RatingBattleResult
}

type RatingBattleResult struct {
	Rate   uint16
	Name   string
	Quick  string
	Charge []string
}

func RatingPvp(attackerData, defenderData *InitialData) (RatingResult, error) {
	rand.Seed(time.Now().UnixNano())
	var wg sync.WaitGroup

	tree := &Tree{}

	switchTo, err := MakeTree(&TreeInitialData{
		AttackerData: *attackerData,
		DefenderData: *defenderData,
		WG:           &wg,
		Tree:         tree,
	})
	if err != nil {
		return RatingResult{}, err
	}

	if switchTo {
		log.Println("Switched to PvPoke")
		res, err := NewPvpBetweenPvppoke(SinglePvpInitialData{
			AttackerData: *attackerData,
			DefenderData: *defenderData,
			Constr:       Constructor{},
		})

		if err != nil {
			return RatingResult{}, err
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

		result := RatingResult{
			Attacker: RatingBattleResult{
				Rate:   res.Attacker.Rate,
				Name:   aName,
				Quick:  attackerData.QuickMove,
				Charge: attackerData.ChargeMove,
			},
			Defender: RatingBattleResult{
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
		return RatingResult{}, &customError{
			"Nil tree",
		}
	}
	pvpData.branchPointer = tree

	var key uint32
	pvpData.key = &key
	*pvpData.key = pvpData.branchPointer.battleRaiting.ID

	pvpData.isTree = false
	pvpData.logging = false

	attackerTypes, err := pvpData.attacker.makeNewCharacter(attackerData)
	if err != nil {
		return RatingResult{}, err
	}

	defenderTypes, err := pvpData.defender.makeNewCharacter(defenderData)
	if err != nil {
		return RatingResult{}, err
	}

	err = pvpData.initializePvp(attackerData, defenderData, attackerTypes, defenderTypes)
	if err != nil {
		return RatingResult{}, err
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

	result := RatingResult{
		Attacker: RatingBattleResult{
			Rate:   uint16((500*(float32(pvpData.defender.maxHP)-processHP(pvpData.defender.hp))/float32(pvpData.defender.maxHP) + 500*processHP(pvpData.attacker.hp)/float32(pvpData.attacker.maxHP))),
			Name:   aName,
			Quick:  attackerData.QuickMove,
			Charge: attackerData.ChargeMove,
		},
		Defender: RatingBattleResult{
			Rate:   uint16((500*(float32(pvpData.attacker.maxHP)-processHP(pvpData.attacker.hp))/float32(pvpData.attacker.maxHP) + 500*processHP(pvpData.defender.hp)/float32(pvpData.defender.maxHP))),
			Name:   dName,
			Quick:  defenderData.QuickMove,
			Charge: defenderData.ChargeMove,
		},
	}
	return result, nil
}

//Constructor is an object transformin single PvP into Constructed pvp
type Constructor struct {
	Round    uint16
	Attacker Status
	Defender Status
}

//Status contains ech pokemons status for constructed pvp
type Status struct {
	IsTriggered bool
	SkipShield  bool

	MoveCooldown   uint8
	RoundsToDamage uint8

	WhatToSkip int8
}

func (obj *PvpObject) readConstructorData(constr *Constructor) {
	obj.round = constr.Round

	obj.attacker.setStatusData(&constr.Attacker, obj)
	obj.defender.setStatusData(&constr.Defender, obj)
}

func (pok *pokemon) setStatusData(status *Status, obj *PvpObject) {
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
