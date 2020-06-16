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

	Expected CommonResult
	Got      CommonResult
}

func (e *TestErrorLog) Error() string {
	return fmt.Sprintf("For %v, %v bound not met. Expected damage: %v, got damage %v. Expected obj: %v, got obj: %v",
		e.Test, e.Bound, e.GotPer, e.ExpectedPer, e.Expected, e.Got)
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

		Weather: 4,

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

		Weather: 4,

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

		Weather: 4,

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

		Weather: 4,

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
	err = checkRes(&res, "Rayquaza12", 4)
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
	err = checkRes(&res, "Rayquaza6", 4)
	if err != nil {
		t.Error(err)
	}
}

func checkRes(res *CommonResult, checkName string, tier int) error {
	golResult := checks[checkName]

	avgPer := float64(tierHP[tier]-res.DamageAvg) / float64(tierHP[tier])
	avgPerGol := float64(tierHP[tier]-golResult.DamageAvg) / float64(tierHP[tier])

	if avgPerGol-1 > avgPer {
		return &TestErrorLog{
			checkName,
			"lower",
			avgPer,
			avgPerGol,
			golResult,
			*res,
		}
	}
	if avgPerGol+1 < avgPer {
		return &TestErrorLog{
			checkName,
			"upper",
			avgPer,
			avgPerGol,
			golResult,
			*res,
		}
	}

	return nil
}

var checks = map[string]CommonResult{
	"Zekrom18": {
		DamageMin: 3032,
		DamageMax: 7032,
		DamageAvg: 4889,

		TimeRemainedMin: 600,
		TimeRemainedMax: 94600,
		TimeRemainedAvg: 60983,

		FaintedMin: 18,
		FaintedMax: 18,
	},
	"Zekrom12": {
		DamageMin: 1978,
		DamageMax: 5254,
		DamageAvg: 3258,

		TimeRemainedMin: 84050,
		TimeRemainedMax: 167000,
		TimeRemainedAvg: 142324,

		FaintedMin: 12,
		FaintedMax: 12,
	},
	"Zekrom6": {
		DamageMin: 920,
		DamageMax: 3357,
		DamageAvg: 1635,

		TimeRemainedMin: 170150,
		TimeRemainedMax: 238200,
		TimeRemainedAvg: 223991,

		FaintedMin: 6,
		FaintedMax: 6,
	},
	"Reshiram18": {
		DamageMin: 4800,
		DamageMax: 6340,
		DamageAvg: 5688,

		TimeRemainedMin: 0,
		TimeRemainedMax: 51800,
		TimeRemainedAvg: 9808,

		FaintedMin: 18,
		FaintedMax: 18,
	},
	"Reshiram12": {
		DamageMin: 3120,
		DamageMax: 5540,
		DamageAvg: 3853,

		TimeRemainedMin: 44700,
		TimeRemainedMax: 140400,
		TimeRemainedAvg: 105836,

		FaintedMin: 12,
		FaintedMax: 12,
	},
	"Reshiram6": {
		DamageMin: 1560,
		DamageMax: 3180,
		DamageAvg: 1917,

		TimeRemainedMin: 153600,
		TimeRemainedMax: 223200,
		TimeRemainedAvg: 206281,

		FaintedMin: 18,
		FaintedMax: 18,
	},

	"Terrakion12": {
		DamageMin: 7422,
		DamageMax: 9018,
		DamageAvg: 8407,

		TimeRemainedMin: 0,
		TimeRemainedMax: 41200,
		TimeRemainedAvg: 10033,

		FaintedMin: 10,
		FaintedMax: 12,
	},
	"Terrakion6": {
		DamageMin: 3636,
		DamageMax: 5310,
		DamageAvg: 4243,

		TimeRemainedMin: 120400,
		TimeRemainedMax: 178800,
		TimeRemainedAvg: 156789,

		FaintedMin: 6,
		FaintedMax: 6,
	},
	"Marowak6": {
		DamageMin: 4254,
		DamageMax: 4752,
		DamageAvg: 4568,

		TimeRemainedMin: 0,
		TimeRemainedMax: 0,
		TimeRemainedAvg: 0,

		FaintedMin: 2,
		FaintedMax: 5,
	},
	"Rayquaza18": {
		DamageMin: 10136,
		DamageMax: 12152,
		DamageAvg: 11050,

		TimeRemainedMin: 0,
		TimeRemainedMax: 0,
		TimeRemainedAvg: 0,

		FaintedMin: 12,
		FaintedMax: 16,
	},
	"Rayquaza18+f": {
		DamageMin: 11103,
		DamageMax: 12987,
		DamageAvg: 12122,

		TimeRemainedMin: 0,
		TimeRemainedMax: 0,
		TimeRemainedAvg: 0,

		FaintedMin: 12,
		FaintedMax: 16,
	},
	"Rayquaza6": {
		DamageMin: 13369,
		DamageMax: 15254,
		DamageAvg: 14671,

		TimeRemainedMin: 0,
		TimeRemainedMax: 21000,
		TimeRemainedAvg: 2024,

		FaintedMin: 10,
		FaintedMax: 13,
	},
}

func BenchmarkSingleRun2000(b *testing.B) {
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
