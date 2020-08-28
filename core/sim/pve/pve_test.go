package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"math/rand"
	"testing"
	"time"
)

var testApp = app.InitApp()

type TestErrorLog struct {
	Test string

	Bound string

	GotPer      float64
	ExpectedPer float64
}

func (e *TestErrorLog) Error() string {
	return fmt.Sprintf("For %v, %v bound not met. Expected damage: %v, got damage %v",
		e.Test, e.Bound, e.ExpectedPer, e.GotPer)
}

func TestSetOfRuns(t *testing.T) {
	const tier5 uint8 = 3
	const tier4 uint8 = 2
	rand.Seed(time.Now().UnixNano())
	//Zekrom 18-3
	res, err := setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Palkia",

			QuickMove:  "Dragon Tail",
			ChargeMove: "Draco Meteor",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 5,

		Boss: app.BossInfo{
			Name:       "Zekrom",
			QuickMove:  "Charge Beam",
			ChargeMove: "Outrage",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Zekrom18", 4)
	if err != nil {
		t.Error(err)
	}

	//Zekrom 12-3
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Palkia",

			QuickMove:  "Dragon Tail",
			ChargeMove: "Draco Meteor",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 5,

		Boss: app.BossInfo{
			Name:       "Zekrom",
			QuickMove:  "Charge Beam",
			ChargeMove: "Outrage",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     12,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Zekrom12", 4)
	if err != nil {
		t.Error(err)
	}

	//Zekrom 6-3
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Palkia",

			QuickMove:  "Dragon Tail",
			ChargeMove: "Draco Meteor",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 5,

		Boss: app.BossInfo{
			Name:       "Zekrom",
			QuickMove:  "Charge Beam",
			ChargeMove: "Outrage",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     6,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Zekrom6", 4)
	if err != nil {
		t.Error(err)
	}

	//Reshiram 18-3
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Rayquaza",

			QuickMove:  "Dragon Tail",
			ChargeMove: "Outrage",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 0,

		Boss: app.BossInfo{
			Name:       "Reshiram",
			QuickMove:  "Fire Fang",
			ChargeMove: "Draco Meteor",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Reshiram18", 4)
	if err != nil {
		t.Error(err)
	}

	//Reshiram 12-3
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Rayquaza",

			QuickMove:  "Dragon Tail",
			ChargeMove: "Outrage",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 0,

		Boss: app.BossInfo{
			Name:       "Reshiram",
			QuickMove:  "Fire Fang",
			ChargeMove: "Draco Meteor",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     12,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Reshiram12", 4)
	if err != nil {
		t.Error(err)
	}

	//Reshiram 6-3
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Rayquaza",

			QuickMove:  "Dragon Tail",
			ChargeMove: "Outrage",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 0,

		Boss: app.BossInfo{
			Name:       "Reshiram",
			QuickMove:  "Fire Fang",
			ChargeMove: "Draco Meteor",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     6,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Reshiram6", 4)
	if err != nil {
		t.Error(err)
	}

	//Terrakion 12-3
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Mewtwo",

			QuickMove:  "Confusion",
			ChargeMove: "Psystrike",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 0,

		Boss: app.BossInfo{
			Name:       "Terrakion",
			QuickMove:  "Smack Down",
			ChargeMove: "Earthquake",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     12,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Terrakion12", 4)
	if err != nil {
		t.Error(err)
	}

	//Terrakion 6-3
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Mewtwo",

			QuickMove:  "Confusion",
			ChargeMove: "Psystrike",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 0,

		Boss: app.BossInfo{
			Name:       "Terrakion",
			QuickMove:  "Smack Down",
			ChargeMove: "Earthquake",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     6,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Terrakion6", 4)
	if err != nil {
		t.Error(err)
	}

	//Marowak 6-3
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Darkrai",

			QuickMove:  "Snarl",
			ChargeMove: "Shadow Ball",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 5,

		Boss: app.BossInfo{
			Name:       "Alolan Marowak",
			QuickMove:  "Hex",
			ChargeMove: "Shadow Ball",
			Tier:       3,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     6,
		PlayersNumber: tier4,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Marowak6", 3)
	if err != nil {
		t.Error(err)
	}

	//Rayquaza 12-3-0
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Mamoswine",

			QuickMove:  "Powder Snow",
			ChargeMove: "Avalanche",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 5,

		Boss: app.BossInfo{
			Name:       "Rayquaza",
			QuickMove:  "Air Slash",
			ChargeMove: "Aerial Ace",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Rayquaza18", 4)
	if err != nil {
		t.Error(err)
	}

	//Rayquaza 12-3-4
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Mamoswine",

			QuickMove:  "Powder Snow",
			ChargeMove: "Avalanche",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 5,

		Boss: app.BossInfo{
			Name:       "Rayquaza",
			QuickMove:  "Air Slash",
			ChargeMove: "Aerial Ace",
			Tier:       4,
		},

		FriendStage:   4,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Rayquaza18+f", 4)
	if err != nil {
		t.Error(err)
	}

	//Rayquaza 12-3-4-w
	res, err = setOfRuns(commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Mamoswine",

			QuickMove:  "Powder Snow",
			ChargeMove: "Avalanche",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 6,

		Boss: app.BossInfo{
			Name:       "Rayquaza",
			QuickMove:  "Air Slash",
			ChargeMove: "Aerial Ace",
			Tier:       4,
		},

		FriendStage:   4,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: tier5,

		NumberOfRuns: 2000,
		App:          testApp,
	})
	if err != nil {
		t.Error(err)
	}
	err = checkRes(&res, "Rayquaza18+f+w", 4)
	if err != nil {
		t.Error(err)
	}
}

func checkRes(res *app.CommonResult, checkName string, tier int) error {
	golResult := checks[checkName]

	avgPer := float64(res.DAvg) / float64(tierHP[tier]) * 100
	avgPerGol := float64(golResult.DAvg) / float64(tierHP[tier]) * 100

	if avgPerGol-0.6 > avgPer {
		return &TestErrorLog{
			checkName,
			"lower",
			avgPer,
			avgPerGol,
		}
	}
	if avgPerGol+0.6 < avgPer {
		return &TestErrorLog{
			checkName,
			"upper",
			avgPer,
			avgPerGol,
		}
	}

	return nil
}

func TestWrapper(t *testing.T) {
	rand.Seed(time.Now().UnixNano())
	res, err := ReturnCommonRaid(&app.IntialDataPve{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Palkia",

			QuickMove:  "",
			ChargeMove: "Draco Meteor",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 0,

		Boss: app.BossInfo{
			Name:       "Zekrom",
			QuickMove:  "",
			ChargeMove: "",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: 3,

		App: testApp,
	})

	if err != nil {
		t.Error(err)
	}
	err = checkWrapperRes(res, []string{"PalkiaDragon BreathDracoMeteor", "PalkiaDragon TailDracoMeteor"}, 4)
	if err != nil {
		t.Error(err)
	}
}

func TestAggressive(t *testing.T) {
	rand.Seed(time.Now().UnixNano())
	res, err := ReturnCommonRaid(&app.IntialDataPve{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Palkia",

			QuickMove:  "",
			ChargeMove: "Draco Meteor",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 5,

		Boss: app.BossInfo{
			Name:       "Zekrom",
			QuickMove:  "",
			ChargeMove: "",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: 3,

		App:           testApp,
		AggresiveMode: true,
	})

	if err != nil {
		t.Error(err)
	}
	err = checkWrapperRes(res, []string{"PalkiaDragon BreathDracoMeteorAgr", "PalkiaDragon TailDracoMeteorAgr"}, 4)
	if err != nil {
		t.Error(err)
	}
}

func TestDodge(t *testing.T) {
	rand.Seed(time.Now().UnixNano())
	res, err := ReturnCommonRaid(&app.IntialDataPve{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Palkia",

			QuickMove:  "Dragon Tail",
			ChargeMove: "Draco Meteor",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 5,

		Boss: app.BossInfo{
			Name:       "Zekrom",
			QuickMove:  "Charge Beam",
			ChargeMove: "Outrage",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 1,
		PartySize:     18,
		PlayersNumber: 3,

		NumberOfRuns:  1000,
		App:           testApp,
		AggresiveMode: true,
	})

	if err != nil {
		t.Error(err)
	}
	err = checkWrapperRes(res, []string{"PalkiaDragon TailDracoMeteorDodge"}, 4)
	if err != nil {
		t.Error(err)
	}
}

func checkWrapperRes(res [][]app.CommonResult, checkName []string, tier int) error {

	for i, value := range res {
		var sum int32
		for _, singlePvpRes := range value {
			sum += singlePvpRes.DAvg
		}
		golResult := checks[checkName[i]]
		avgDamageGold := float64(golResult.DAvg) / float64(tierHP[tier]) * 100
		avgDamage := float64(sum) / float64(len(value)) / 15000 * 100
		if avgDamageGold-0.6 > avgDamage {
			return &TestErrorLog{
				checkName[i],
				"lower",
				avgDamage,
				avgDamageGold,
			}
		}
		if avgDamageGold+0.6 < avgDamage {
			return &TestErrorLog{
				checkName[i],
				"upper",
				avgDamage,
				avgDamageGold,
			}
		}
	}
	return nil
}

func TestMoveLimit(t *testing.T) {
	mewlist, err := generateBossRow(&app.IntialDataPve{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		App:         testApp,
		Boss: app.BossInfo{
			Name: "Mew",
			Tier: 4,
		},
		Weather: 0,
	})
	if err != nil {
		t.Error(err)
	}
	if len(mewlist) > 100 {
		t.Error("Mew has too large movelist")
	}
	porygon := testApp.PokemonStatsBase["Porygon"]

	limiterObj := limiterObject{pok: porygon, orginalMoveList: porygon.QuickMoves, isCharge: false, n: 10,
		inDat: &app.IntialDataPve{
			CustomMoves: &map[string]app.MoveBaseEntry{},
			App:         testApp,
			Boss:        app.BossInfo{Name: "Porygon", Tier: 4}}}

	porygonList, err := limiterObj.limitMoves()
	if err != nil {
		t.Error(err)
	}
	if len(porygonList) > 10 {
		t.Error("Mew has too large movelist")
	}

}

func TestAllList(t *testing.T) {
	allList := createAllMovesets(&app.IntialDataPve{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		App:         testApp,
		Pok: app.PokemonInitialData{
			AttackIV: 15,
			Level:    40,
		},

		PartySize:     18,
		PlayersNumber: 3,

		Boss: app.BossInfo{
			Name: "Mew",
			Tier: 4,
		},

		NumberOfRuns:  10,
		FriendStage:   0,
		Weather:       0,
		DodgeStrategy: 0,
		AggresiveMode: false,
	})

	if len(allList) > 900 {
		t.Error("All list is too long")
	}

}

var checks = map[string]app.CommonResult{
	"Zekrom18": {
		DAvg: 4889,
	},
	"Zekrom12": {
		DAvg: 3258,
	},
	"Zekrom6": {
		DAvg: 1635,
	},
	"Reshiram18": {
		DAvg: 5688,
	},
	"Reshiram12": {
		DAvg: 3853,
	},
	"Reshiram6": {
		DAvg: 1917,
	},

	"Terrakion12": {
		DAvg: 8407,
	},
	"Terrakion6": {
		DAvg: 4243,
	},
	"Marowak6": {
		DAvg: 4568,
	},
	"Rayquaza18": {
		DAvg: 11550,
	},
	"Rayquaza18+f": {
		DAvg: 12675,
	},
	"Rayquaza18+f+w": {
		DAvg: 15075,
	},
	"PalkiaDragon BreathDracoMeteor": {
		DAvg: 6573,
	},
	"PalkiaDragon TailDracoMeteor": {
		DAvg: 6386,
	},
	"PalkiaDragon BreathDracoMeteorAgr": {
		DAvg: 6951,
	},
	"PalkiaDragon TailDracoMeteorAgr": {
		DAvg: 6831,
	},
	"PalkiaDragon TailDracoMeteorDodge": {
		DAvg: 5198,
	},
}

func BenchmarkSingleRun2000(b *testing.B) {
	rand.Seed(time.Now().UnixNano())
	data := commonPvpInData{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Rayquaza",

			QuickMove:  "Dragon Tail",
			ChargeMove: "Outrage",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 4,

		Boss: app.BossInfo{
			Name:       "Reshiram",
			QuickMove:  "Fire Fang",
			ChargeMove: "Draco Meteor",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: 3,

		NumberOfRuns: 2000,
		App:          testApp,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		setOfRuns(data)
	}
}

func BenchmarkAllMovesetVsAllMoveset(b *testing.B) {
	rand.Seed(time.Now().UnixNano())
	data := app.IntialDataPve{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "Palkia",

			QuickMove:  "",
			ChargeMove: "",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 0,

		Boss: app.BossInfo{
			Name:       "Zekrom",
			QuickMove:  "",
			ChargeMove: "",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: 3,

		App: testApp,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		ReturnCommonRaid(&data)
	}
}

func BenchmarkAllVsAllMoveset(b *testing.B) {
	rand.Seed(time.Now().UnixNano())
	data := app.IntialDataPve{
		CustomMoves: &map[string]app.MoveBaseEntry{},
		Pok: app.PokemonInitialData{
			Name: "",

			QuickMove:  "",
			ChargeMove: "",

			Level: 40,

			AttackIV:  15,
			DefenceIV: 15,
			StaminaIV: 15,

			IsShadow: false,
		},

		Weather: 0,

		Boss: app.BossInfo{
			Name:       "Mew",
			QuickMove:  "",
			ChargeMove: "",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: 3,

		App: testApp,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		ReturnCommonRaid(&data)
	}
}
