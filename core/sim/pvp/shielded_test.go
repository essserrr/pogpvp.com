package pvp

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"testing"
)

//shielded PvP with q charge move
func TestShielded2CM(t *testing.T) {
	var AlolanMuk = app.InitialData{
		Name:       "Alolan Muk",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      20.5,
		QuickMove:  "Bite",
		ChargeMove: []string{"Dark Pulse", "Acid Spray"},
	}
	var AlolanMarowak = app.InitialData{
		Name:       "Alolan Marowak",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      33.5,
		QuickMove:  "Hex",
		ChargeMove: []string{"Bone Club", "Shadow Ball"},
	}

	var Swampert = app.InitialData{
		Name:       "Swampert",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", "Earthquake"},
	}
	var Altaria = app.InitialData{
		Name:       "Altaria",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}

	var Azumarill = app.InitialData{
		Name:       "Azumarill",
		Shields:    2,
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = app.InitialData{
		Name:       "Venusaur",
		Shields:    2,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      21,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Skarmory = app.InitialData{
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

	var GiratinaAltered = app.InitialData{
		Name:       "Giratina (Altered Forme)",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}
	var Snorlax = app.InitialData{
		Name:       "Snorlax",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	err := checkPVP(AlolanMuk, AlolanMarowak, "shieldedAlolanMukAlolanMarowak", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	Altaria.InitialHp = 63
	Altaria.InitialEnergy = 3
	Altaria.Shields = 1
	Swampert.InitialHp = 107
	Swampert.Shields = 1
	err = checkPVP(Swampert, Altaria, "shieldedSwampertAltaria", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Azumarill, Venusaur, "shieldedAzumarillVenusaur1", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	Venusaur.ChargeMove = []string{"Frenzy Plant", "Sludge Bomb"}
	err = checkPVP(Azumarill, Venusaur, "shieldedAzumarillVenusaur2", app.Constructor{})
	if err != nil {
		t.Error(err)
	}

	Altaria.InitialHp = 56
	Altaria.Shields = 2
	err = checkPVP(Skarmory, Altaria, "shieldedSkarmoryAltaria", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(GiratinaAltered, Snorlax, "shieldedGiratinaAlteredSnorlax1", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	GiratinaAltered.Shields = 1
	err = checkPVP(GiratinaAltered, Snorlax, "shieldedGiratinaAlteredSnorlax2", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
}

//shielded PvP with 1 charge move

func TestShielded1CM(t *testing.T) {
	var Medicham = app.InitialData{
		Name:       "Medicham",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", ""},
	}

	var Swampert = app.InitialData{
		Name:       "Swampert",
		Shields:    2,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", ""},
	}

	err := checkPVP(Medicham, Swampert, "generalShielded", app.Constructor{}) //general shielded PvP 2-2
	if err != nil {
		t.Error(err)
	}

	Medicham.Shields = 1
	Swampert.Shields = 1
	err = checkPVP(Medicham, Swampert, "shielded11", app.Constructor{}) //general shielded PvP 2-2
	if err != nil {
		t.Error(err)
	}

	Medicham.Shields = 1
	Swampert.Shields = 0
	err = checkPVP(Medicham, Swampert, "shielded10", app.Constructor{}) //shielded PvP 1-0
	if err != nil {
		t.Error(err)
	}

}

func TestConstructor(t *testing.T) {
	var GiratinaA = app.InitialData{
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

	var Aerodactyl = app.InitialData{
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

	err := checkPVP(GiratinaA, Aerodactyl, "constr1", app.Constructor{
		Round: 12,
		Attacker: app.Status{
			IsTriggered:    true,
			SkipShield:     false,
			MoveCooldown:   0,
			RoundsToDamage: 0,
			WhatToSkip:     1,
		},
		Defender: app.Status{
			IsTriggered:    false,
			SkipShield:     true,
			MoveCooldown:   2,
			RoundsToDamage: 1,
			WhatToSkip:     0,
		},
	})
	if err != nil {
		t.Error(err)
	}

	Aerodactyl.InitialHp = 12
	Aerodactyl.InitialEnergy = 55

	GiratinaA.InitialHp = 43
	GiratinaA.InitialEnergy = 35
	GiratinaA.InitialAttackStage = 2
	GiratinaA.InitialDefenceStage = 2

	err = checkPVP(GiratinaA, Aerodactyl, "constr2", app.Constructor{
		Round: 21,
		Attacker: app.Status{
			IsTriggered:    false,
			SkipShield:     true,
			MoveCooldown:   2,
			RoundsToDamage: 1,
			WhatToSkip:     0,
		},
		Defender: app.Status{
			IsTriggered:    false,
			SkipShield:     true,
			MoveCooldown:   0,
			RoundsToDamage: 0,
			WhatToSkip:     1,
		},
	})
	if err != nil {
		t.Error(err)
	}
}

func BenchmarkShieldedPVP(b *testing.B) {
	var Medicham = app.InitialData{
		Name:       "Medicham",
		Shields:    2,
		InitialHp:  0,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
	}

	var Kingdra = app.InitialData{
		Name:       "Kingdra",
		Shields:    2,
		InitialHp:  0,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  13,
		Level:      21.5,
		QuickMove:  "Waterfall",
		ChargeMove: []string{"Octazooka", "Outrage"},
	}
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		NewPvpBetween(app.SinglePvpInitialData{Medicham, Kingdra, app.Constructor{}, true, testApp})
	}

}

func BenchmarkShieldedPvpLong(b *testing.B) {
	var GiratinaA = app.InitialData{
		Name:       "Giratina (Altered Forme)",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}

	var Snorlax = app.InitialData{
		Name:       "Snorlax",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		NewPvpBetween(app.SinglePvpInitialData{GiratinaA, Snorlax, app.Constructor{}, true, testApp})
	}
}
