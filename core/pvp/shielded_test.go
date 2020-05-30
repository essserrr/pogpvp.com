package pvpsim

import (
	"testing"
)

//shielded PvP with q charge move
func TestShielded2CM(t *testing.T) {
	var AlolanMuk = InitialData{
		Name:       "Alolan Muk",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      20.5,
		QuickMove:  "Bite",
		ChargeMove: []string{"Dark Pulse", "Acid Spray"},
	}
	var AlolanMarowak = InitialData{
		Name:       "Alolan Marowak",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      33.5,
		QuickMove:  "Hex",
		ChargeMove: []string{"Bone Club", "Shadow Ball"},
	}

	var Swampert = InitialData{
		Name:       "Swampert",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", "Earthquake"},
	}
	var Altaria = InitialData{
		Name:       "Altaria",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}

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
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Skarmory = InitialData{
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

	var GiratinaAltered = InitialData{
		Name:       "Giratina (Altered Forme)",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}
	var Snorlax = InitialData{
		Name:       "Snorlax",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	err := checkPVP(AlolanMuk, AlolanMarowak, "shieldedAlolanMukAlolanMarowak")
	if err != nil {
		t.Error(err)
	}
	Altaria.InitialHp = 63
	Altaria.InitialEnergy = 3
	Altaria.Shields = 1
	Swampert.InitialHp = 107
	Swampert.Shields = 1
	err = checkPVP(Swampert, Altaria, "shieldedSwampertAltaria")
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(Azumarill, Venusaur, "shieldedAzumarillVenusaur1")
	if err != nil {
		t.Error(err)
	}
	Venusaur.ChargeMove = []string{"Frenzy Plant", "Sludge Bomb"}
	err = checkPVP(Azumarill, Venusaur, "shieldedAzumarillVenusaur2")
	if err != nil {
		t.Error(err)
	}

	Altaria.InitialHp = 56
	Altaria.Shields = 2
	err = checkPVP(Skarmory, Altaria, "shieldedSkarmoryAltaria")
	if err != nil {
		t.Error(err)
	}
	err = checkPVP(GiratinaAltered, Snorlax, "shieldedGiratinaAlteredSnorlax1")
	if err != nil {
		t.Error(err)
	}
	GiratinaAltered.Shields = 1
	err = checkPVP(GiratinaAltered, Snorlax, "shieldedGiratinaAlteredSnorlax2")
	if err != nil {
		t.Error(err)
	}
}

//shielded PvP with 1 charge move

func TestShielded1CM(t *testing.T) {
	var Medicham = InitialData{
		Name:       "Medicham",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", ""},
	}

	var Swampert = InitialData{
		Name:       "Swampert",
		Shields:    2,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", ""},
	}

	err := checkPVP(Medicham, Swampert, "generalShielded") //general shielded PvP 2-2
	if err != nil {
		t.Error(err)
	}

	Medicham.Shields = 1
	Swampert.Shields = 1
	err = checkPVP(Medicham, Swampert, "shielded11") //general shielded PvP 2-2
	if err != nil {
		t.Error(err)
	}

	Medicham.Shields = 1
	Swampert.Shields = 0
	err = checkPVP(Medicham, Swampert, "shielded10") //shielded PvP 1-0
	if err != nil {
		t.Error(err)
	}

}

func BenchmarkShieldedPVP(b *testing.B) {
	var Medicham = InitialData{
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

	var Kingdra = InitialData{
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
		NewPvpBetween(SinglePvpInitialData{Medicham, Kingdra, Constructor{}, true})
	}

}

func BenchmarkShieldedPvpLong(b *testing.B) {
	var GiratinaA = InitialData{
		Name:       "Giratina (Altered Forme)",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}

	var Snorlax = InitialData{
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
		NewPvpBetween(SinglePvpInitialData{GiratinaA, Snorlax, Constructor{}, true})
	}
}
