package pvpsim

import (
	"testing"
)

//tests for unshielded PvP with 2 charge moves

func TestUnshielded2CM(t *testing.T) {
	var Azumarill = InitialData{
		Name:       "Azumarill",
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = InitialData{
		Name:       "Venusaur",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      21,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Meganium = InitialData{
		Name:       "Meganium",
		AttackIV:   0,
		DefenceIV:  10,
		StaminaIV:  15,
		Level:      24,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Frenzy Plant", "Earthquake"},
	}

	var Medicham = InitialData{
		Name:       "Medicham",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
	}
	var Registeel = InitialData{
		Name:       "Registeel",
		AttackIV:   2,
		DefenceIV:  13,
		StaminaIV:  14,
		Level:      23.5,
		QuickMove:  "Lock-On",
		ChargeMove: []string{"Flash Cannon", "Focus Blast"},
	}
	var Skarmory = InitialData{
		Name:       "Skarmory",
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  14,
		Level:      27.5,
		QuickMove:  "Air Slash",
		ChargeMove: []string{"Sky Attack", "Flash Cannon"},
	}
	var Vigoroth = InitialData{
		Name:       "Vigoroth",
		AttackIV:   1,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Counter",
		ChargeMove: []string{"Body Slam", "Brick Break"},
	}
	var Altaria = InitialData{
		Name:       "Altaria",
		AttackIV:   2,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}
	var GiratinaA = InitialData{
		Name:       "Giratina (Altered Forme)",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}

	var Snorlax = InitialData{
		Name:       "Snorlax",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	err := checkPVP(Azumarill, Venusaur, "azumarillVenusaur")
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Azumarill, Meganium, "azumarillMeganium")
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Azumarill, Medicham, "azumarillMedicham")
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Azumarill, Registeel, "azumarillRegisteel")
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Skarmory, Vigoroth, "skarmoryVigoroth")
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Skarmory, Altaria, "skarmoryAltaria")
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(GiratinaA, Snorlax, "giratinaASnorlax")
	if err != nil {
		t.Error(err)
	}
}
