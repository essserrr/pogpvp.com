package goldenlogs

import (
	sim "Solutions/pvpSimulator/core/sim"
	pvp "Solutions/pvpSimulator/core/sim/pvp"
	"encoding/json"
	"io/ioutil"
	"os"
	"path"
)

var links = map[string]string{
	"knockQuickQuick":    (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/knockQuickQuick.json")),
	"knockChargeQuick":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/knockChargeQuick.json")),
	"simultaneousQuick":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/simultaneousQuick.json")),
	"knockQuickCharge":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/knockQuickCharge.json")),
	"simultaneousCharge": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/simultaneousCharge.json")),
	"generalShielded":    (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/generalShielded.json")),
	"shielded11":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shielded11.json")),
	"shielded10":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shielded10.json")),

	"azumarillVenusaur":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/azumarillVenusaur.json")),
	"azumarillMeganium":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/azumarillMeganium.json")),
	"azumarillMedicham":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/azumarillMedicham.json")),
	"azumarillRegisteel": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/azumarillRegisteel.json")),
	"skarmoryVigoroth":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/skarmoryVigoroth.json")),
	"skarmoryAltaria":    (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/skarmoryAltaria.json")),
	"giratinaASnorlax":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/giratinaASnorlax.json")),

	"shieldedAlolanMukAlolanMarowak":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedAlolanMukAlolanMarowak.json")),
	"shieldedSwampertAltaria":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedSwampertAltaria.json")),
	"shieldedAzumarillVenusaur1":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedAzumarillVenusaur1.json")),
	"shieldedAzumarillVenusaur2":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedAzumarillVenusaur2.json")),
	"shieldedSkarmoryAltaria":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedSkarmoryAltaria.json")),
	"shieldedGiratinaAlteredSnorlax1": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedGiratinaAlteredSnorlax1.json")),
	"shieldedGiratinaAlteredSnorlax2": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedGiratinaAlteredSnorlax2.json")),

	"matrixBattle": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/matrixBattle.json")),

	"pvpoke":        (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpoke.json")),
	"pvpoke14":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpoke14.json")),
	"pvpoke34":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpoke34.json")),
	"pvpoke24":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpoke24.json")),
	"pvpokeConstr1": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpokeConstr1.json")),
	"pvpokeConstr2": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpokeConstr2.json")),

	"constr1": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/constr1.json")),
	"constr2": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/constr2.json")),
}

//Update updates base of golden logs
func Update() error {
	err := updateUnshielded1CM()
	if err != nil {
		return err
	}
	err = updateShielded1CM()
	if err != nil {
		return err
	}
	err = updateUnshielded2CM()
	if err != nil {
		return err
	}
	err = updateShielded2CM()
	if err != nil {
		return err
	}
	err = updateMatrix()
	if err != nil {
		panic(err)
	}
	err = updatePvpoke()
	if err != nil {
		panic(err)
	}
	return nil
}

// tests for unshielded PvP with 1 charge move

func updateUnshielded1CM() error {
	var Magnezone = sim.InitialData{
		Name:       "Magnezone",
		AttackIV:   0,
		DefenceIV:  13,
		StaminaIV:  15,
		Level:      17.5,
		QuickMove:  "Charge Beam",
		ChargeMove: []string{"Wild Charge", ""},
	}
	var Medicham = sim.InitialData{
		Name:       "Medicham",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", ""},
	}
	var Swampert = sim.InitialData{
		Name:       "Swampert",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", ""},
	}

	Magnezone.InitialHp = 37
	Magnezone.InitialEnergy = 0
	Swampert.InitialHp = 13
	Swampert.InitialEnergy = 0
	err := writeGoldenLog(Magnezone, Swampert, links["knockQuickQuick"], sim.Constructor{}) //knock down an opponent by a quick move before his quick move deals damage to you
	if err != nil {
		return nil
	}

	Magnezone.InitialHp = 37
	Magnezone.InitialEnergy = 0
	Swampert.InitialHp = 13
	Swampert.InitialEnergy = 9
	err = writeGoldenLog(Magnezone, Swampert, links["knockChargeQuick"], sim.Constructor{}) //knock down an opponent by a charge move before his quick move deals damage to you
	if err != nil {
		return nil
	}

	Magnezone.InitialHp = 36
	Magnezone.InitialEnergy = 0
	Swampert.InitialHp = 12
	Swampert.InitialEnergy = 0
	err = writeGoldenLog(Magnezone, Swampert, links["simultaneousQuick"], sim.Constructor{}) //simultaneous knock down by a quick move
	if err != nil {
		return nil
	}

	Medicham.InitialHp = 33
	Medicham.InitialEnergy = 4
	Swampert.InitialHp = 51
	Swampert.InitialEnergy = 4
	err = writeGoldenLog(Medicham, Swampert, links["knockQuickCharge"], sim.Constructor{}) //knock down an opponent by a quick move before his charge move deals damage to you
	if err != nil {
		return nil
	}

	Medicham.InitialHp = 33
	Medicham.InitialEnergy = 4
	Swampert.InitialHp = 51
	Swampert.InitialEnergy = 10
	err = writeGoldenLog(Medicham, Swampert, links["simultaneousCharge"], sim.Constructor{}) //simultaneous knock down by a charge move
	if err != nil {
		return nil
	}

	return nil
}

//shielded PvP with 1 charge move

func updateShielded1CM() error {
	var Medicham = sim.InitialData{
		Name:       "Medicham",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", ""},
	}

	var Swampert = sim.InitialData{
		Name:       "Swampert",
		Shields:    2,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", ""},
	}

	err := writeGoldenLog(Medicham, Swampert, links["generalShielded"], sim.Constructor{}) //general shielded PvP 2-2
	if err != nil {
		return err
	}

	Medicham.Shields = 1
	Swampert.Shields = 1
	err = writeGoldenLog(Medicham, Swampert, links["shielded11"], sim.Constructor{}) //general shielded PvP 2-2
	if err != nil {
		return err
	}

	Medicham.Shields = 1
	Swampert.Shields = 0
	err = writeGoldenLog(Medicham, Swampert, links["shielded10"], sim.Constructor{}) //shielded PvP 1-0
	if err != nil {
		return err
	}
	return nil
}

func updateUnshielded2CM() error {

	var Azumarill = sim.InitialData{
		Name:       "Azumarill",
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = sim.InitialData{
		Name:       "Venusaur",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      21,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Meganium = sim.InitialData{
		Name:       "Meganium",
		AttackIV:   0,
		DefenceIV:  10,
		StaminaIV:  15,
		Level:      24,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Frenzy Plant", "Earthquake"},
	}

	var Medicham = sim.InitialData{
		Name:       "Medicham",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
	}
	var Registeel = sim.InitialData{
		Name:       "Registeel",
		AttackIV:   2,
		DefenceIV:  13,
		StaminaIV:  14,
		Level:      23.5,
		QuickMove:  "Lock-On",
		ChargeMove: []string{"Flash Cannon", "Focus Blast"},
	}
	var Skarmory = sim.InitialData{
		Name:       "Skarmory",
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  14,
		Level:      27.5,
		QuickMove:  "Air Slash",
		ChargeMove: []string{"Sky Attack", "Flash Cannon"},
	}
	var Vigoroth = sim.InitialData{
		Name:       "Vigoroth",
		AttackIV:   1,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Counter",
		ChargeMove: []string{"Body Slam", "Brick Break"},
	}
	var Altaria = sim.InitialData{
		Name:       "Altaria",
		AttackIV:   2,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}

	var GiratinaA = sim.InitialData{
		Name:       "Giratina (Altered Forme)",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}

	var Snorlax = sim.InitialData{
		Name:       "Snorlax",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	err := writeGoldenLog(Azumarill, Venusaur, links["azumarillVenusaur"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenLog(Azumarill, Meganium, links["azumarillMeganium"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenLog(Azumarill, Medicham, links["azumarillMedicham"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenLog(Azumarill, Registeel, links["azumarillRegisteel"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenLog(Skarmory, Vigoroth, links["skarmoryVigoroth"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenLog(Skarmory, Altaria, links["skarmoryAltaria"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenLog(GiratinaA, Snorlax, links["giratinaASnorlax"], sim.Constructor{})
	if err != nil {
		return err
	}
	return nil

}

func updateShielded2CM() error {
	var AlolanMuk = sim.InitialData{
		Name:       "Alolan Muk",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      20.5,
		QuickMove:  "Bite",
		ChargeMove: []string{"Dark Pulse", "Acid Spray"},
	}
	var AlolanMarowak = sim.InitialData{
		Name:       "Alolan Marowak",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      33.5,
		QuickMove:  "Hex",
		ChargeMove: []string{"Bone Club", "Shadow Ball"},
	}
	var Swampert = sim.InitialData{
		Name:       "Swampert",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", "Earthquake"},
	}
	var Altaria = sim.InitialData{
		Name:       "Altaria",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}
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
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Skarmory = sim.InitialData{
		Name:      "Skarmory",
		InitialHp: 54,

		Shields:    2,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  14,
		Level:      27.5,
		QuickMove:  "Air Slash",
		ChargeMove: []string{"Sky Attack", "Flash Cannon"},
	}

	var GiratinaAltered = sim.InitialData{
		Name:       "Giratina (Altered Forme)",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}
	var Snorlax = sim.InitialData{
		Name:       "Snorlax",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	err := writeGoldenLog(AlolanMuk, AlolanMarowak, links["shieldedAlolanMukAlolanMarowak"], sim.Constructor{})
	if err != nil {
		return err
	}

	Altaria.InitialHp = 63
	Altaria.InitialEnergy = 3
	Altaria.Shields = 1
	Swampert.InitialHp = 107
	Swampert.Shields = 1
	err = writeGoldenLog(Swampert, Altaria, links["shieldedSwampertAltaria"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenLog(Azumarill, Venusaur, links["shieldedAzumarillVenusaur1"], sim.Constructor{})
	if err != nil {
		return err
	}
	Venusaur.ChargeMove = []string{"Frenzy Plant", "Sludge Bomb"}

	err = writeGoldenLog(Azumarill, Venusaur, links["shieldedAzumarillVenusaur2"], sim.Constructor{})
	if err != nil {
		return err
	}

	Altaria.InitialHp = 56
	Altaria.Shields = 2
	err = writeGoldenLog(Skarmory, Altaria, links["shieldedSkarmoryAltaria"], sim.Constructor{})
	if err != nil {
		return err
	}

	err = writeGoldenLog(GiratinaAltered, Snorlax, links["shieldedGiratinaAlteredSnorlax1"], sim.Constructor{})
	if err != nil {
		return err
	}
	GiratinaAltered.Shields = 1
	err = writeGoldenLog(GiratinaAltered, Snorlax, links["shieldedGiratinaAlteredSnorlax2"], sim.Constructor{})
	if err != nil {
		return err
	}

	//constructor

	var GiratinaA = sim.InitialData{
		Name:      "Giratina (Altered Forme)",
		AttackIV:  1,
		DefenceIV: 10,
		StaminaIV: 8,
		Level:     17,
		Shields:   2,

		InitialHp:     68,
		InitialEnergy: 48,

		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Shadow Sneak", "Ancient Power"},
	}

	var Aerodactyl = sim.InitialData{
		Name:      "Aerodactyl",
		AttackIV:  2,
		DefenceIV: 6,
		StaminaIV: 14,
		Level:     20.5,
		Shields:   2,

		InitialHp:     93,
		InitialEnergy: 30,

		QuickMove:  "Rock Throw",
		ChargeMove: []string{"Rock Slide", "Earth Power"},
	}

	err = writeGoldenLog(GiratinaA, Aerodactyl, links["constr1"], sim.Constructor{
		Round: 12,
		Attacker: pvp.Status{
			IsTriggered:    true,
			SkipShield:     false,
			MoveCooldown:   0,
			RoundsToDamage: 0,
			WhatToSkip:     1,
		},
		Defender: pvp.Status{
			IsTriggered:    false,
			SkipShield:     true,
			MoveCooldown:   2,
			RoundsToDamage: 1,
			WhatToSkip:     0,
		},
	})
	if err != nil {
		return err
	}
	Aerodactyl.InitialHp = 12
	Aerodactyl.InitialEnergy = 55

	GiratinaA.InitialHp = 43
	GiratinaA.InitialEnergy = 35
	GiratinaA.InitialAttackStage = 2
	GiratinaA.InitialDefenceStage = 2

	err = writeGoldenLog(GiratinaA, Aerodactyl, links["constr2"], sim.Constructor{
		Round: 21,
		Attacker: pvp.Status{
			IsTriggered:    false,
			SkipShield:     true,
			MoveCooldown:   2,
			RoundsToDamage: 1,
			WhatToSkip:     0,
		},
		Defender: pvp.Status{
			IsTriggered:    false,
			SkipShield:     true,
			MoveCooldown:   0,
			RoundsToDamage: 0,
			WhatToSkip:     1,
		},
	})
	if err != nil {
		return err
	}

	return nil

}

func writeGoldenLog(atatcker, defender sim.InitialData, logName string, constr sim.Constructor) error {
	result, err := sim.NewPvpBetween(sim.SinglePvpInitialData{AttackerData: atatcker,
		DefenderData: defender,
		Constr:       constr, Logging: true})
	if err != nil {
		return err
	}
	err = result.Log.WriteLog(logName)
	if err != nil {
		return err
	}
	return nil
}

func updateMatrix() error {
	var AlolanMuk = sim.InitialData{
		Name:       "Alolan Muk",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      20.5,
		QuickMove:  "Bite",
		ChargeMove: []string{"Dark Pulse", "Acid Spray"},
	}
	var AlolanMarowak = sim.InitialData{
		Name:       "Alolan Marowak",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      33.5,
		QuickMove:  "Hex",
		ChargeMove: []string{"Bone Club", "Shadow Ball"},
	}
	var Swampert = sim.InitialData{
		Name:       "Swampert",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", "Earthquake"},
	}
	var Altaria = sim.InitialData{
		Name:       "Altaria",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}
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
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Medicham = sim.InitialData{
		Name:       "Medicham",
		Shields:    1,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
	}

	var Skarmory = sim.InitialData{
		Name:      "Skarmory",
		InitialHp: 54,

		Shields:    2,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  14,
		Level:      27.5,
		QuickMove:  "Air Slash",
		ChargeMove: []string{"Sky Attack", "Flash Cannon"},
	}

	var GiratinaAltered = sim.InitialData{
		Name:       "Giratina (Altered Forme)",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}
	var Snorlax = sim.InitialData{
		IsGreedy:   true,
		Name:       "Snorlax",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}
	err := writeGoldenMatrix([]sim.InitialData{
		GiratinaAltered,
	},
		[]sim.InitialData{
			Snorlax,
			AlolanMuk,
			AlolanMarowak,
			Swampert,
			Altaria,
			Azumarill,
			Venusaur,
			Medicham,
			Skarmory,
		}, links["matrixBattle"])
	if len(err) > 0 {
		err.Flush()
		panic("")
	}
	return nil
}

func writeGoldenMatrix(attacker, defender []sim.InitialData, matrixName string) sim.ErrorChan {
	errChan := make(sim.ErrorChan, len(attacker)*len(defender))
	matrixResults := make([]sim.MatrixResult, 0, len(attacker)*len(defender))

	for i, pokA := range attacker {
		for k, pokB := range defender {
			matrixBattleResult := sim.MatrixResult{}
			//otherwise check pvp results in base

			singleBattleResult, err := sim.NewPvpBetween(sim.SinglePvpInitialData{
				AttackerData: pokA,
				DefenderData: pokB,
				Constr:       sim.Constructor{}})

			if err != nil {
				errChan <- err
				continue
			}
			matrixBattleResult.Rate = singleBattleResult.Attacker.Rate

			matrixBattleResult.I = i
			matrixBattleResult.K = k
			matrixResults = append(matrixResults, matrixBattleResult)
		}
	}

	close(errChan)
	errStr := errChan.Flush()
	if errStr != "" {
		panic(errStr)
	}

	file, errR := json.Marshal(matrixResults)
	if errR != nil {
		panic(errR)
	}
	errR = ioutil.WriteFile(matrixName, file, 0644)
	if errR != nil {
		panic(errR)
	}
	return nil
}

func updatePvpoke() error {
	var Dewgong = sim.InitialData{
		Name:       "Dewgong",
		AttackIV:   0,
		DefenceIV:  12,
		StaminaIV:  15,
		Level:      29.5,
		Shields:    2,
		QuickMove:  "Ice Shard",
		ChargeMove: []string{"Icy Wind", "Water Pulse"},
	}

	var Venusaur = sim.InitialData{
		Name:       "Venusaur",
		AttackIV:   1,
		DefenceIV:  15,
		StaminaIV:  14,
		Level:      39,
		Shields:    2,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Frenzy Plant", "Sludge Bomb"},
	}

	var Ampharos = sim.InitialData{
		Name:       "Ampharos",
		AttackIV:   0,
		DefenceIV:  13,
		StaminaIV:  15,
		Level:      36,
		Shields:    2,
		QuickMove:  "Volt Switch",
		ChargeMove: []string{"Thunder Punch", "Dragon Pulse"},
	}

	var AMuk = sim.InitialData{
		Name:       "Alolan Muk",
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      38.5,
		Shields:    2,
		QuickMove:  "Snarl",
		ChargeMove: []string{"Dark Pulse", "Sludge Wave"},
	}

	var GiratinaA = sim.InitialData{
		Name:       "Giratina (Altered Forme)",
		AttackIV:   1,
		DefenceIV:  12,
		StaminaIV:  15,
		Level:      28,
		Shields:    2,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}

	err := writeGoldenLog(Dewgong, Dewgong, links["pvpoke"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenPvpokeLog(GiratinaA, Ampharos, links["pvpoke14"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenPvpokeLog(AMuk, Ampharos, links["pvpoke34"], sim.Constructor{})
	if err != nil {
		return err
	}
	err = writeGoldenPvpokeLog(Venusaur, Ampharos, links["pvpoke24"], sim.Constructor{})
	if err != nil {
		return err
	}

	GiratinaA = sim.InitialData{
		Name:      "Giratina (Altered Forme)",
		AttackIV:  1,
		DefenceIV: 10,
		StaminaIV: 8,
		Level:     17,
		Shields:   2,

		InitialHp:     68,
		InitialEnergy: 48,

		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Shadow Sneak", "Ancient Power"},
	}

	var Aerodactyl = sim.InitialData{
		Name:      "Aerodactyl",
		AttackIV:  2,
		DefenceIV: 6,
		StaminaIV: 14,
		Level:     20.5,
		Shields:   2,

		InitialHp:     93,
		InitialEnergy: 30,

		QuickMove:  "Rock Throw",
		ChargeMove: []string{"Rock Slide", "Earth Power"},
	}

	err = writeGoldenPvpokeLog(GiratinaA, Aerodactyl, links["pvpokeConstr1"], sim.Constructor{
		Round: 12,
		Attacker: pvp.Status{
			IsTriggered:    true,
			SkipShield:     false,
			MoveCooldown:   0,
			RoundsToDamage: 0,
			WhatToSkip:     1,
		},
		Defender: pvp.Status{
			IsTriggered:    false,
			SkipShield:     true,
			MoveCooldown:   2,
			RoundsToDamage: 1,
			WhatToSkip:     0,
		},
	})
	if err != nil {
		return err
	}

	Aerodactyl.InitialHp = 12
	Aerodactyl.InitialEnergy = 55

	GiratinaA.InitialHp = 43
	GiratinaA.InitialEnergy = 35
	GiratinaA.InitialAttackStage = 2
	GiratinaA.InitialDefenceStage = 2

	err = writeGoldenPvpokeLog(GiratinaA, Aerodactyl, links["pvpokeConstr2"], sim.Constructor{
		Round: 21,
		Attacker: pvp.Status{
			IsTriggered:    false,
			SkipShield:     true,
			MoveCooldown:   2,
			RoundsToDamage: 1,
			WhatToSkip:     0,
		},
		Defender: pvp.Status{
			IsTriggered:    false,
			SkipShield:     true,
			MoveCooldown:   0,
			RoundsToDamage: 0,
			WhatToSkip:     1,
		},
	})
	if err != nil {
		return err
	}

	return nil
}

func writeGoldenPvpokeLog(atatcker, defender sim.InitialData, logName string, constr sim.Constructor) error {
	result, err := sim.NewPvpBetweenPvpoke(sim.SinglePvpInitialData{AttackerData: atatcker,
		DefenderData: defender,
		Constr:       constr, Logging: true})
	if err != nil {
		return err
	}
	err = result.Log.WriteLog(logName)
	if err != nil {
		return err
	}
	return nil
}
