package pvp

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"sync"
	"sync/atomic"
)

type concurrentVars struct {
	wg *sync.WaitGroup //64
}

//Tree is Tree type; imported in oder to be written or read outside pvp package
type Tree struct {
	Left   *Tree //w
	Right  *Tree //w
	parent *Tree //w

	battleRaiting rating
	TreeVal       ValueOfTree
}

type rating struct {
	ID uint32

	attacker selection

	defender selection
}

type selection struct {
	potentialDamage int16
	hpRate          uint16
	hpRateEn        uint16
	isTrue          bool
	isGreedy        bool
}

type ValueOfTree struct {
	Action      bool
	Who         bool
	isTriggered bool
}

//WriteTree writes selected tree to a file using json.Marshal
func (pvpT *Tree) WriteTree(fileName string) error {
	file, err := json.MarshalIndent(pvpT, "", " ")
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(fileName, file, 0644)
	if err != nil {
		return err
	}
	return nil
}

//ReadTree reads Tree from a file into a variable using json.Unmarshal
func (pvpT *Tree) ReadTree(fileName string) error {
	file, err := os.Open(fileName)
	if err != nil {
		return err
	}

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}
	file.Close()
	err = json.Unmarshal(byteValue, pvpT)
	if err != nil {
		return err
	}
	return nil
}

//PrintTreeVal prints out TreeVal into a writer interface; "charcter" defines root letter;
//ns - number of spaves between the first row beginning root letter
func PrintTreeVal(writer io.Writer, tree *Tree, ns int, character rune) {
	if tree == nil {
		return
	}
	for i := 0; i < ns; i++ {
		fmt.Fprint(writer, " ")
	}
	fmt.Fprintf(writer, "%c:%v\n", character, tree.TreeVal /*battleRaiting.value*/)
	PrintTreeVal(writer, tree.Left, ns+2, 'L')
	PrintTreeVal(writer, tree.Right, ns+2, 'R')
}

//PrintTreeRate prints out tree batttle ratings into a writer interface; "charcter" defines root letter;
//ns - number of spaves between the first row beginning root letter
func PrintTreeRate(writer io.Writer, tree *Tree, ns int, character rune) {
	if tree == nil {
		return
	}
	for i := 0; i < ns; i++ {
		fmt.Fprint(writer, " ")
	}
	fmt.Fprintf(writer, "%c:%v\n", character, tree.battleRaiting /*battleRaiting.value*/)
	PrintTreeRate(writer, tree.Left, ns+2, 'L')
	PrintTreeRate(writer, tree.Right, ns+2, 'R')
}

//MakeTree takes initial data and returns attacker and defender trees
func MakeTree(inData TreeInitialData) (bool, error) {
	var idCounter uint32
	var nodeNumb uint32
	pvpData := globalPvpObjectPool.Get().(*PvpObject)
	*pvpData = PvpObject{}
	pvpData.logging = false
	pvpData.isTree = true
	pvpData.key = &idCounter
	pvpData.nodeNumb = &nodeNumb
	pvpData.app = inData.App

	pvpData.conStruct = &concurrentVars{
		wg: inData.WG,
	}

	pvpData.branchPointer = inData.Tree

	attackerTypes, err := pvpData.attacker.makeNewCharacter(&inData.AttackerData, pvpData, inData.CustomMoves)
	if err != nil {
		return false, err
	}
	defenderTypes, err := pvpData.defender.makeNewCharacter(&inData.DefenderData, pvpData, inData.CustomMoves)
	if err != nil {
		return false, err
	}
	err = pvpData.initializePvp(&inData.AttackerData, &inData.DefenderData, attackerTypes, defenderTypes)
	if err != nil {
		return false, err
	}

	pvpData.readInitialConditions(&inData.AttackerData, &inData.DefenderData)

	if (inData.Constr != app.Constructor{}) {
		pvpData.readConstructorData(&inData.Constr)
	}

	fillTheTree(pvpData)
	globalPvpObjectPool.Put(pvpData)
	inData.WG.Wait()
	//println(idCounter)

	if nodeNumb >= inData.App.NodeLimit {
		return true, nil
	}
	return false, nil
}

func fillTheTree(obj *PvpObject) {
	letsBattle(obj)
}

func updateData(obj *PvpObject) {
	obj.inDat.attacker.setBranchingData(&obj.attacker)
	obj.inDat.defender.setBranchingData(&obj.defender)
}

func (id *branchingData) setBranchingData(fromTarget *pokemon) {
	id.InitialHp = fromTarget.hp
	id.InitialEnergy = fromTarget.energy
	id.Shields = fromTarget.shields

	id.MoveCooldown = fromTarget.moveCooldown
	id.RoundsToDamage = fromTarget.roundsToDamage
	id.IsFreeHit = fromTarget.isFreeHit
	id.WhatToSkip = fromTarget.whatToSkip
}

func (pok *pokemon) writeBranchingData(targetData *branchingData) {
	pok.hp = targetData.InitialHp
	//nullify energy, the set up initial value
	pok.energy = 0
	pok.energy.AddEnergy(int16(targetData.InitialEnergy))

	pok.shields = targetData.Shields
	pok.moveCooldown = targetData.MoveCooldown
	pok.roundsToDamage = targetData.RoundsToDamage

	if targetData.WhatToSkip != 0 {
		pok.whatToSkip = targetData.WhatToSkip
	}
	pok.isFreeHit = targetData.IsFreeHit
}

//code defines is it tree or charge event, true for charge, false for shield
func (pok *pokemon) makeFork(obj *PvpObject, code bool) {
	if *obj.nodeNumb > obj.app.NodeLimit {
		return
	}
	altChoiseObject := globalPvpObjectPool.Get().(*PvpObject)
	*altChoiseObject = *obj //make a copy of the pvp object
	altChoiseObject.attacker.results = roundResults{}
	altChoiseObject.defender.results = roundResults{}

	obj.branchPointer.makeNewLeftBranch()               //create a new branch in the original tree
	obj.branchPointer.Left.TreeVal.Who = pok.isAttacker //set up action of that branch
	switch code {
	case true:
		obj.branchPointer.Left.TreeVal.Action = true
	case false:
		obj.branchPointer.Left.TreeVal.Action = false
	default:
		//panic("Unknown branch code")
	}

	obj.branchPointer.Left.parent = obj.branchPointer      //set parent of the new branch
	altChoiseObject.branchPointer = obj.branchPointer.Left //pass pointer to that branch to alt pvp object

	altChoiseObject.attacker.writeBranchingData(&obj.inDat.attacker) //redefine initial conditions to conditions from beginning of the round
	altChoiseObject.defender.writeBranchingData(&obj.inDat.defender)

	altChoiseObject.conStruct.wg.Add(1)
	go func() {
		fillTheTree(altChoiseObject)
		altChoiseObject.conStruct.wg.Done()
		globalPvpObjectPool.Put(altChoiseObject)
	}()

	switch code {
	case true:
		pok.whatToSkip = 0 //nullify move to skip
	case false:
		pok.skipShield = false
	default:
		//panic("Unknown branch code")
	}
	obj.makeASingleBranch(pok.isAttacker, code, true) //and continue the execution process
}

func (obj *PvpObject) makeASingleBranch(who bool, actionCode bool, whatBranch bool) {
	atomic.AddUint32(obj.nodeNumb, 1)
	switch whatBranch {
	case true:
		obj.branchPointer.makeNewRightBranch() //create a new node
		if obj.branchPointer.Right == nil {
			print()
		}
		obj.branchPointer.Right.parent = obj.branchPointer //set up parent of the node

		obj.branchPointer = obj.branchPointer.Right //set up its branch pointer

		obj.branchPointer.TreeVal.Who = who //set up its value
		obj.branchPointer.TreeVal.Action = actionCode

	case false:
		obj.branchPointer.makeNewLeftBranch()

		obj.branchPointer.Left.parent = obj.branchPointer
		obj.branchPointer = obj.branchPointer.Left

		obj.branchPointer.TreeVal.Who = who
		obj.branchPointer.TreeVal.Action = actionCode

	}
}

func (pvpT *Tree) makeNewRightBranch() {
	pvpT.Right = &Tree{}
}

func (pvpT *Tree) makeNewLeftBranch() {
	pvpT.Left = &Tree{}

}

func writeClosingStats(obj *PvpObject) {
	obj.calculateBattleRating()
	marshBattleRating(obj.branchPointer, obj)
}

func marshBattleRating(tree *Tree, obj *PvpObject) {
	if tree.parent == nil {
		return
	}
	if (tree.parent.battleRaiting != rating{}) {
		return
	}
	if tree.parent.Left != nil && tree.parent.Right != nil {
		if (tree.parent.Left.battleRaiting == rating{}) || (tree.parent.Right.battleRaiting == rating{} || tree.parent.battleRaiting != rating{}) {
			return
		}
		tree.parent.solveForks()
		marshBattleRating(tree.parent, obj)
		return
	}

	tree.parent.battleRaiting = tree.battleRaiting
	marshBattleRating(tree.parent, obj)
}

func (obj *PvpObject) calculateBattleRating() {
	if (obj.branchPointer.battleRaiting != rating{}) {
		return
	}
	obj.branchPointer.battleRaiting = rating{
		ID: atomic.AddUint32(obj.key, 1),
		attacker: selection{
			potentialDamage: obj.attacker.potentialDamage,
		},
		defender: selection{
			potentialDamage: obj.defender.potentialDamage,
		},
	}

	switch obj.attacker.isGreedy {
	case true:
		obj.branchPointer.battleRaiting.attacker.hpRate = uint16((500*(float32(obj.defender.maxHP)-processHP(obj.defender.hp))/float32(obj.defender.maxHP) + 500*processHP(obj.attacker.hp)/float32(obj.attacker.maxHP)))
		obj.branchPointer.battleRaiting.attacker.hpRateEn = uint16((500*(float32(obj.defender.maxHP)-processHP(obj.defender.hp))/float32(obj.defender.maxHP) + 500*processHP(obj.attacker.hp)/float32(obj.attacker.maxHP) + float32(obj.attacker.energy)*0.5*500/float32(obj.attacker.maxHP)))
	case false:
		obj.branchPointer.battleRaiting.attacker.hpRate = uint16((500*(float32(obj.defender.maxHP)-processHP(obj.defender.hp))/float32(obj.defender.maxHP) + 500*processHP(obj.attacker.hp)/float32(obj.attacker.maxHP)) * shieldsMultiplier[obj.defender.shields][obj.attacker.shields])
		obj.branchPointer.battleRaiting.attacker.hpRateEn = uint16((500*(float32(obj.defender.maxHP)-processHP(obj.defender.hp))/float32(obj.defender.maxHP) + 500*processHP(obj.attacker.hp)/float32(obj.attacker.maxHP) + float32(obj.attacker.energy)*0.5*500/float32(obj.attacker.maxHP)) * shieldsMultiplier[obj.defender.shields][obj.attacker.shields])

	}
	switch obj.defender.isGreedy {
	case true:
		obj.branchPointer.battleRaiting.defender.hpRate = uint16((500*(float32(obj.attacker.maxHP)-processHP(obj.attacker.hp))/float32(obj.attacker.maxHP) + 500*processHP(obj.defender.hp)/float32(obj.defender.maxHP)))
		obj.branchPointer.battleRaiting.defender.hpRateEn = uint16((500*(float32(obj.attacker.maxHP)-processHP(obj.attacker.hp))/float32(obj.attacker.maxHP) + 500*processHP(obj.defender.hp)/float32(obj.defender.maxHP) + float32(obj.defender.energy)*0.5*500/float32(obj.defender.maxHP)))
	case false:
		obj.branchPointer.battleRaiting.defender.hpRate = uint16((500*(float32(obj.attacker.maxHP)-processHP(obj.attacker.hp))/float32(obj.attacker.maxHP) + 500*processHP(obj.defender.hp)/float32(obj.defender.maxHP)) * shieldsMultiplier[obj.attacker.shields][obj.defender.shields])
		obj.branchPointer.battleRaiting.defender.hpRateEn = uint16((500*(float32(obj.attacker.maxHP)-processHP(obj.attacker.hp))/float32(obj.attacker.maxHP) + 500*processHP(obj.defender.hp)/float32(obj.defender.maxHP) + float32(obj.defender.energy)*0.5*500/float32(obj.defender.maxHP)) * shieldsMultiplier[obj.attacker.shields][obj.defender.shields])

	}

	if uint16((500*(float32(obj.defender.maxHP)-processHP(obj.defender.hp))/float32(obj.defender.maxHP) + 500*processHP(obj.attacker.hp)/float32(obj.attacker.maxHP))) > 500 {
		obj.branchPointer.battleRaiting.attacker.isTrue = true
	}
	if uint16((500*(float32(obj.attacker.maxHP)-processHP(obj.attacker.hp))/float32(obj.attacker.maxHP) + 500*processHP(obj.defender.hp)/float32(obj.defender.maxHP))) > 500 {
		obj.branchPointer.battleRaiting.defender.isTrue = true
	}

}

func (pvpT *Tree) solveForks() {
	switch pvpT.Left.TreeVal.Who {
	case true:
		pvpT.solve(&pvpT.Left.battleRaiting.attacker, &pvpT.Right.battleRaiting.attacker, pvpT.Right.TreeVal.Action)
	case false:
		pvpT.solve(&pvpT.Left.battleRaiting.defender, &pvpT.Right.battleRaiting.defender, pvpT.Right.TreeVal.Action)
	}
}

func (pvpT *Tree) solve(left, right *selection, code bool) {
	if right.isTrue && left.isTrue {
		pvpT.selectOneOfTwo(left, right, code)
		return
	}
	if left.isTrue {
		pvpT.selectLeft()
		return

	}
	if right.isTrue {
		pvpT.selectRight()
		return

	}
	pvpT.selectOneOfTwo(left, right, code)
}

func (pvpT *Tree) selectOneOfTwo(left, right *selection, code bool) {
	switch left.isTrue {
	case true:
		pvpT.trueSelector(left, right, code)
	case false:
		pvpT.falseSelector(left, right, code)
	}
}

func (pvpT *Tree) trueSelector(left, right *selection, code bool) {

	if left.hpRateEn == right.hpRateEn {
		pvpT.breakTie(left, right, code)
		return
	}
	if left.hpRateEn > right.hpRateEn {
		pvpT.selectLeft()
		return
	}
	pvpT.selectRight()

}

func (pvpT *Tree) falseSelector(left, right *selection, code bool) {
	if left.hpRate == right.hpRate {
		pvpT.breakTie(left, right, code)
		return
	}
	if left.hpRate > right.hpRate {
		pvpT.selectLeft()
		return
	}
	pvpT.selectRight()

}

func (pvpT *Tree) breakTie(left, right *selection, code bool) {

	switch true {
	case left.potentialDamage > right.potentialDamage:
		pvpT.selectLeft()

	case left.potentialDamage < right.potentialDamage:
		pvpT.selectRight()

	default:
		if code == true {
			pvpT.selectRight()

			return
		}
		pvpT.selectLeft()
		return
	}
}

func (pvpT *Tree) selectLeft() {
	pvpT.battleRaiting = pvpT.Left.battleRaiting
}
func (pvpT *Tree) selectRight() {
	pvpT.battleRaiting = pvpT.Right.battleRaiting
}

func processHP(hp int16) float32 {
	if hp >= 0 {
		return float32(hp)
	}
	return 0
}

var shieldsMultiplier = [][]float32{
	{
		0: 1.1,
		1: 1.6,
		2: 5,
	},
	{
		0: 0.4,
		1: 1.07,
		2: 1.5,
	},
	{
		0: 0,
		1: 0.5,
		2: 1.0,
	},
}
