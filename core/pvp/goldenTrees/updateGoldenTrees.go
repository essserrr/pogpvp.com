package goldentrees

import (
	sim "Solutions/pvpSimulator/core/pvp"
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
	var Azumarill = sim.InitialData{
		Name:       "Azumarill",
		Shields:    2,
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = sim.InitialData{
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

func writeGoldenTree(atatcker, defender sim.InitialData, treePath string) error {
	var errs error
	var wg sync.WaitGroup
	tree := &sim.Tree{}

	sim.MakeTree(&sim.TreeInitialData{
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
