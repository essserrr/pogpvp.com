package pvpsim

import (
	"fmt"
	"sync"
	"testing"
)

type TestErrorTree struct {
	Test     string
	Expected valueOfTree
	Got      valueOfTree
}

func (e *TestErrorTree) Error() string {
	return fmt.Sprintf("For %v Expected: %v, got: %v", e.Test, e.Expected, e.Got)
}

func TestGeneralTree(t *testing.T) {
	var Azumarill = InitialData{
		Name:       "Azumarill",
		Shields:    2,
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = InitialData{
		Name:       "Venusaur",
		Shields:    2,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      21,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Frenzy Plant", "Sludge Bomb"},
	}

	err := checkTrees(Azumarill, Venusaur, "shieldedTree") //general tree
	if err != nil {
		t.Error(err)
	}
}

func checkTrees(atatcker, defender InitialData, checkName string) error {
	var errs error
	var wg sync.WaitGroup
	tree := &Tree{}

	MakeTree(&TreeInitialData{
		AttackerData: atatcker,
		DefenderData: defender,
		WG:           &wg,
		Tree:         tree,
	})
	if errs != nil {
		return errs
	}
	var goldenTree Tree
	errs = goldenTree.ReadTree(linksTree[checkName])
	if errs != nil {
		return errs
	}

	errs = CheckTreesIdent(&goldenTree, tree, checkName)
	if errs != nil {
		return errs
	}
	return nil
}

func CheckTreesIdent(goldenTree, treeB *Tree, checkName string) error {
	if goldenTree == nil && treeB == nil {
		return nil
	}
	if treeB == nil {
		return &TestErrorTree{
			checkName,
			goldenTree.TreeVal,
			valueOfTree{},
		}
	}
	if goldenTree.TreeVal != treeB.TreeVal {
		return &TestErrorTree{
			checkName,
			goldenTree.TreeVal,
			treeB.TreeVal,
		}
	}

	err := CheckTreesIdent(goldenTree.Left, treeB.Left, checkName)
	if err != nil {
		return err
	}
	err = CheckTreesIdent(goldenTree.Right, treeB.Right, checkName)
	if err != nil {
		return err
	}
	return nil
}

func BenchmarkMakeTree(b *testing.B) {
	var Medicham = InitialData{
		Name:       "Medicham",
		InitialHp:  0,
		Shields:    0,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
	}

	var Kingdra = InitialData{
		Name:       "Kingdra",
		InitialHp:  0,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  13,
		Level:      21.5,
		QuickMove:  "Waterfall",
		ChargeMove: []string{"Octazooka", "Outrage"},
	}
	var wg sync.WaitGroup
	tree := &Tree{}

	InDat := TreeInitialData{
		AttackerData: Medicham,
		DefenderData: Kingdra,
		WG:           &wg,
		Tree:         tree,
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		MakeTree(&InDat)
	}
}
