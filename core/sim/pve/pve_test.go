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

func TestUnshielded1CM(t *testing.T) {
	const tier5 uint8 = 3
	const tier4 uint8 = 2
	rand.Seed(time.Now().UnixNano())
	//Zekrom 18-3
	res, err := CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
	res, err = CommonSimulator(CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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

func checkRes(res *CommonResult, checkName string, tier int) error {
	golResult := checks[checkName]

	avgPer := float64(res.DAvg) / float64(tierHP[tier]) * 100
	avgPerGol := float64(golResult.DAvg) / float64(tierHP[tier]) * 100

	if avgPerGol-0.5 > avgPer {
		return &TestErrorLog{
			checkName,
			"lower",
			avgPer,
			avgPerGol,
		}
	}
	if avgPerGol+0.5 < avgPer {
		return &TestErrorLog{
			checkName,
			"upper",
			avgPer,
			avgPerGol,
		}
	}

	return nil
}

var checks = map[string]CommonResult{
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
}

func BenchmarkSingleRun2000(b *testing.B) {
	rand.Seed(time.Now().UnixNano())
	data := CommonPvpInData{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
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
		CommonSimulator(data)
	}
}

func BenchmarkAllMovesetVsAllMoveset(b *testing.B) {
	rand.Seed(time.Now().UnixNano())
	data := IntialDataPve{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
			Name:       "Zekrom",
			QuickMove:  "",
			ChargeMove: "",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: 3,

		NumberOfRuns: 100,
		App:          testApp,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		CommonSimulatorWrapper(data)
	}
}

func BenchmarkAllVsAllMoveset(b *testing.B) {
	rand.Seed(time.Now().UnixNano())
	data := IntialDataPve{
		Pok: PokemonInitialData{
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

		Boss: BossInfo{
			Name:       "Mew",
			QuickMove:  "",
			ChargeMove: "",
			Tier:       4,
		},

		FriendStage:   0,
		DodgeStrategy: 0,
		PartySize:     18,
		PlayersNumber: 3,

		NumberOfRuns: 10,
		App:          testApp,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		CommonSimulatorWrapper(data)
	}
}

/*
2000
BenchmarkAllVsAllMoveset-8   	       1	1163630600 ns/op	 3053656 B/op	    5478 allocs/op


20000
*/
