package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"path"
	"testing"
	"time"
)

func TestCustomRaids(t *testing.T) {
	const tier5 uint8 = 3
	rand.Seed(time.Now().UnixNano())
	//test if set of runs for custom pve work correctly
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

type UserFromBase struct {
	Pokemon []app.UserPokemon
	Parties map[string][]app.UserPokemon
}

func TestCustomRaidsWrapper(t *testing.T) {
	bytes, err := ioutil.ReadFile(path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenUsers/goldenUser.json"))
	if err != nil {
		t.Error(err)
	}
	midoriNoKami := UserFromBase{}
	err = json.Unmarshal(bytes, &midoriNoKami)
	if err != nil {
		t.Error(err)
	}
	midoriNoKami.Pokemon = append(midoriNoKami.Pokemon,
		app.UserPokemon{
			Name: "Mega Charizard X", QuickMove: "Dragon Breath", ChargeMove: "Dragon Claw",
			Lvl: 40, Atk: 15, Def: 15, Sta: 15, IsShadow: "false",
		},
		app.UserPokemon{
			Name: "Mega Rayquaza", QuickMove: "Dragon Tail", ChargeMove: "Outrage",
			Lvl: 40, Atk: 15, Def: 15, Sta: 15, IsShadow: "false",
		},
		app.UserPokemon{
			Name: "Mega Camerupt", QuickMove: "Ember", ChargeMove: "Earth Power",
			Lvl: 40, Atk: 15, Def: 15, Sta: 15, IsShadow: "false",
		})

	_, err = ReturnCustomRaid(&app.IntialDataPve{
		App: testApp, CustomMoves: &map[string]app.MoveBaseEntry{},
		UserPokemon: midoriNoKami.Pokemon, Boss: app.BossInfo{Name: "Zekrom", QuickMove: "", ChargeMove: "", Tier: 4},
		NumberOfRuns: 0, FriendStage: 0, Weather: 0, DodgeStrategy: 0,
		AggresiveMode: true, PartySize: 18,
		BoostSlotEnabled: true, FindInCollection: true, SortByDamage: false,
	})
	if err != nil {
		t.Error(err)
	}
}

func TestPartyGenerator(t *testing.T) {
	constructObj := conStruct{
		attackerRow: []preRun{{Name: "1"}, {Name: "2"}, {Name: "3"}, {Name: "4"}, {Name: "5"}, {Name: "6"}, {Name: "7"},
			{Name: "8"}, {Name: "9"}, {Name: "10"}, {Name: "11"}, {Name: "12"}, {Name: "13"}},
	}
	constructObj.makeGroupsFromAttackers()
	if len(constructObj.attackerGroups[0]) != 6 || len(constructObj.attackerGroups[len(constructObj.attackerGroups)-1]) != 1 {
		t.Error(fmt.Errorf("Group creation test failed, first party: %v, expected: 6, last party: %v, expected: 1",
			len(constructObj.attackerGroups[0]), len(constructObj.attackerGroups[len(constructObj.attackerGroups)-1])))

	}

	constructObj.attackerGroups = combineByAndMerge(constructObj.attackerGroups, 3, make([][]preRun, 0, 1), 0)
	if len(constructObj.attackerGroups) != 1 {
		t.Error(fmt.Errorf("Combination by 3 failed: expected: 1, got:  %v", len(constructObj.attackerGroups)))
	}

	constructObj.makeGroupsFromAttackers()
	constructObj.attackerGroups = combineByAndMerge(constructObj.attackerGroups, 2, make([][]preRun, 0, 1), 0)
	if len(constructObj.attackerGroups) != 3 {
		t.Error(fmt.Errorf("Combination by 2 failed: expected: 3, got:  %v", len(constructObj.attackerGroups)))
	}

	constructObj.makeGroupsFromAttackers()
	constructObj.attackerGroups = combineByAndMerge(constructObj.attackerGroups, 1, make([][]preRun, 0, 1), 0)
	if len(constructObj.attackerGroups) != 3 {
		t.Error(fmt.Errorf("Combination by 1 failed: expected: 3, got:  %v", len(constructObj.attackerGroups)))
	}
}
