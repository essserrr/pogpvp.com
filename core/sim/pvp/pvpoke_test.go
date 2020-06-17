package pvp

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"testing"
)

func TestPvpoke(t *testing.T) {
	var Dewgong = app.InitialData{
		Name:       "Dewgong",
		AttackIV:   0,
		DefenceIV:  12,
		StaminaIV:  15,
		Level:      29.5,
		Shields:    2,
		QuickMove:  "Ice Shard",
		ChargeMove: []string{"Icy Wind", "Water Pulse"},
	}

	var Venusaur = app.InitialData{
		Name:       "Venusaur",
		AttackIV:   1,
		DefenceIV:  15,
		StaminaIV:  14,
		Level:      39,
		Shields:    2,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Frenzy Plant", "Sludge Bomb"},
	}

	var Ampharos = app.InitialData{
		Name:       "Ampharos",
		AttackIV:   0,
		DefenceIV:  13,
		StaminaIV:  15,
		Level:      36,
		Shields:    2,
		QuickMove:  "Volt Switch",
		ChargeMove: []string{"Thunder Punch", "Dragon Pulse"},
	}

	var AMuk = app.InitialData{
		Name:       "Alolan Muk",
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      38.5,
		Shields:    2,
		QuickMove:  "Snarl",
		ChargeMove: []string{"Dark Pulse", "Sludge Wave"},
	}

	var GiratinaA = app.InitialData{
		Name:       "Giratina (Altered Forme)",
		AttackIV:   1,
		DefenceIV:  12,
		StaminaIV:  15,
		Level:      28,
		Shields:    2,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}

	err := checkPVP(Dewgong, Dewgong, "pvpoke", app.Constructor{}) //switch
	if err != nil {
		t.Error(err)
	}
	err = checkPpvpoke(Dewgong, Dewgong, "pvpoke", app.Constructor{}) //without switch
	if err != nil {
		t.Error(err)
	}

	err = checkPpvpoke(Venusaur, Ampharos, "pvpoke24", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPpvpoke(AMuk, Ampharos, "pvpoke34", app.Constructor{})
	if err != nil {
		t.Error(err)
	}
	err = checkPpvpoke(GiratinaA, Ampharos, "pvpoke14", app.Constructor{})
	if err != nil {
		t.Error(err)
	}

}

func checkPpvpoke(atatcker, defender app.InitialData, checkName string, constr app.Constructor) error {
	currentRes, err := NewPvpBetweenPvpoke(app.SinglePvpInitialData{atatcker, defender, constr, true, testApp})
	if err != nil {
		return err
	}
	/*currentLog.PrintLog()*/
	err = checkLog(currentRes.Log, checkName)
	if err != nil {
		return err
	}
	return nil
}

func TestPvpokeConstr(t *testing.T) {
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

	err := checkPpvpoke(GiratinaA, Aerodactyl, "pvpokeConstr1", app.Constructor{
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

	err = checkPpvpoke(GiratinaA, Aerodactyl, "pvpokeConstr2", app.Constructor{
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

func BenchmarkMakepPvpokePVP(b *testing.B) {
	var Dewgong = app.InitialData{
		Name:       "Dewgong",
		AttackIV:   0,
		DefenceIV:  12,
		StaminaIV:  15,
		Level:      29.5,
		Shields:    2,
		QuickMove:  "Ice Shard",
		ChargeMove: []string{"Icy Wind", "Water Pulse"},
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		NewPvpBetweenPvpoke(app.SinglePvpInitialData{Dewgong, Dewgong, app.Constructor{}, true, testApp})
	}
}

func BenchmarkMakepPVPwithSwitch(b *testing.B) {
	var Dewgong = app.InitialData{
		Name:       "Dewgong",
		AttackIV:   0,
		DefenceIV:  12,
		StaminaIV:  15,
		Level:      29.5,
		Shields:    2,
		QuickMove:  "Ice Shard",
		ChargeMove: []string{"Icy Wind", "Water Pulse"},
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		NewPvpBetween(app.SinglePvpInitialData{Dewgong, Dewgong, app.Constructor{}, true, testApp})
	}
}
