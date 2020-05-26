package goldentrees

import (
	pvpsim "Solutions/pvpSimulator/core/pvp"
	"os"
	"path"
	"sync"
)

var links = map[string]string{
	"shieldedTree": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenTrees/shieldedTree.json")),
}

//Update updates golden resulta for tree
func Update() error {
	err := updateGeneralTree()
	if err != nil {
		return err
	}
	return nil
}

// tests for unshielded PvP with 1 charge move

func updateGeneralTree() error {
	var Azumarill = pvpsim.InitialData{
		Name:       "Azumarill",
		Shields:    2,
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = pvpsim.InitialData{
		Name:       "Venusaur",
		Shields:    2,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      21,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Frenzy Plant", "Sludge Bomb"},
	}
	err := writeGoldenTree(Azumarill, Venusaur, links["shieldedTree"]) //general tree
	if err != nil {
		return err
	}
	return nil
}

func writeGoldenTree(atatcker, defender pvpsim.InitialData, treePath string) error {
	var errs error
	var wg sync.WaitGroup
	tree := &pvpsim.Tree{}

	pvpsim.MakeTree(&pvpsim.TreeInitialData{
		AttackerData: atatcker,
		DefenderData: defender,
		WG:           &wg,
		Tree:         tree,
	})
	if errs != nil {
		return errs
	}
	errs = tree.WriteTree(treePath)
	if errs != nil {
		return errs
	}
	return nil
}
