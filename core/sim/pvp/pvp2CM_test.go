package pvp

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"testing"
)

//tests for unshielded PvP with 2 charge moves

func TestUnshielded2CM(t *testing.T) {
	var Azumarill = app.InitialData{
		Name:       "Azumarill",
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = app.InitialData{
		Name:       "Venusaur",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      21,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Meganium = app.InitialData{
		Name:       "Meganium",
		AttackIV:   0,
		DefenceIV:  10,
		StaminaIV:  15,
		Level:      24,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Frenzy Plant", "Earthquake"},
	}

	var Medicham = app.InitialData{
		Name:       "Medicham",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
	}
	var Registeel = app.InitialData{
		Name:       "Registeel",
		AttackIV:   2,
		DefenceIV:  13,
		StaminaIV:  14,
		Level:      23.5,
		QuickMove:  "Lock-On",
		ChargeMove: []string{"Flash Cannon", "Focus Blast"},
	}
	var Skarmory = app.InitialData{
		Name:       "Skarmory",
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  14,
		Level:      27.5,
		QuickMove:  "Air Slash",
		ChargeMove: []string{"Sky Attack", "Flash Cannon"},
	}
	var Vigoroth = app.InitialData{
		Name:       "Vigoroth",
		AttackIV:   1,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Counter",
		ChargeMove: []string{"Body Slam", "Brick Break"},
	}
	var Altaria = app.InitialData{
		Name:       "Altaria",
		AttackIV:   2,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}
	var GiratinaA = app.InitialData{
		Name:       "Giratina (Altered Forme)",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}

	var Snorlax = app.InitialData{
		Name:       "Snorlax",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	err := checkPVP(Azumarill, Venusaur, "azumarillVenusaur", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Azumarill, Meganium, "azumarillMeganium", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Azumarill, Medicham, "azumarillMedicham", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Azumarill, Registeel, "azumarillRegisteel", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Skarmory, Vigoroth, "skarmoryVigoroth", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Skarmory, Altaria, "skarmoryAltaria", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(GiratinaA, Snorlax, "giratinaASnorlax", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
}
