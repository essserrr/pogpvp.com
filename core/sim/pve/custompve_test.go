package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"math/rand"
	"testing"
	"time"
)

func TestCustomRaids(t *testing.T) {
	const tier5 uint8 = 3
	rand.Seed(time.Now().UnixNano())
	//Rayquaza 12-3-4-w
	res, err := setOfRuns(pvpeInitialData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		AttackerPokemon: []app.PokemonInitialData{{
			Name: "Groudon", QuickMove: "Mud Shot", ChargeMove: "Earthquake",
			Level: 35, AttackIV: 14, DefenceIV: 15, StaminaIV: 12, IsShadow: false,
		},
			{
				Name: "Groudon", QuickMove: "Mud Shot", ChargeMove: "Earthquake",
				Level: 35, AttackIV: 14, DefenceIV: 15, StaminaIV: 12, IsShadow: false,
			},
			{
				Name: "Groudon", QuickMove: "Mud Shot", ChargeMove: "Earthquake",
				Level: 35, AttackIV: 14, DefenceIV: 15, StaminaIV: 12, IsShadow: false,
			},
			{
				Name: "Groudon", QuickMove: "Mud Shot", ChargeMove: "Earthquake",
				Level: 35, AttackIV: 14, DefenceIV: 15, StaminaIV: 12, IsShadow: false,
			},
			{
				Name: "Groudon", QuickMove: "Mud Shot", ChargeMove: "Earthquake",
				Level: 35, AttackIV: 14, DefenceIV: 15, StaminaIV: 12, IsShadow: false,
			},
			{
				Name: "Groudon", QuickMove: "Mud Shot", ChargeMove: "Earthquake",
				Level: 35, AttackIV: 14, DefenceIV: 15, StaminaIV: 12, IsShadow: false,
			}},
		Boss:          app.BossInfo{Name: "Heatran", QuickMove: "Bug Bite", ChargeMove: "Fire Blast", Tier: 4},
		Weather:       0,
		AggresiveMode: true, FriendStage: 0, DodgeStrategy: 0,
		PartySize: 6, PlayersNumber: tier5,
		NumberOfRuns: 2000, App: testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "CustomHeatran6", 4)
	if err != nil {
		t.Error(err)
	}
}
