package pvpsim

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"testing"
)

type TestErrorMatrix struct {
	Test     string
	PVP      string
	Expected uint16
	Got      uint16
}

func (e *TestErrorMatrix) Error() string {
	return fmt.Sprintf("For %v  %v Expected: %v, got: %v", e.Test, e.PVP, e.Expected, e.Got)
}

func TestMatrixes(t *testing.T) {
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

	var Medicham = InitialData{
		Name:       "Medicham",
		Shields:    1,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
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
		IsGreedy:   true,
		Name:       "Snorlax",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	err := checkMatrixes([]InitialData{
		GiratinaAltered,
	},
		[]InitialData{
			Snorlax,
			AlolanMuk,
			AlolanMarowak,
			Swampert,
			Altaria,
			Azumarill,
			Venusaur,
			Medicham,
			Skarmory,
		}, "matrixBattle")

	if err != nil {
		if err != nil {
			t.Error(err)
		}
	}

}

func checkMatrixes(attacker, defender []InitialData, checkName string) error {
	errChan := make(ErrorChan, len(attacker)*len(defender))
	matrixResults := make([]MatrixResult, 0, len(attacker)*len(defender))

	for i, pokA := range attacker {
		for k, pokB := range defender {
			matrixBattleResult := MatrixResult{}
			//otherwise check pvp results in base

			singleBattleResult, err := NewPvpBetween(SinglePvpInitialData{
				AttackerData: pokA,
				DefenderData: pokB,
				Constr:       Constructor{},
				Logging:      false})

			if err != nil {
				errChan <- err
				continue
			}
			matrixBattleResult.Rate = singleBattleResult.Attacker.Rate

			matrixBattleResult.I = i
			matrixBattleResult.K = k
			matrixResults = append(matrixResults, matrixBattleResult)
		}
	}

	close(errChan)
	errStr := errChan.Flush()
	if errStr != "" {
		return fmt.Errorf(errStr)
	}

	file, err := os.Open(linksMatrix[checkName])
	if err != nil {
		return err
	}

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}

	var goldenMatrix []MatrixResult
	err = json.Unmarshal(byteValue, &goldenMatrix)
	if err != nil {
		return err
	}
	err = CheckMatrixesIdent(&goldenMatrix, &matrixResults, checkName)
	if err != nil {
		return err
	}
	return nil
}

func CheckMatrixesIdent(goldenMatrix, matrix *[]MatrixResult, checkName string) error {
	if goldenMatrix == nil || matrix == nil {
		return &TestErrorMatrix{
			checkName,
			"got nil matrix",
			0,
			0,
		}
	}

	for _, goldenValue := range *goldenMatrix {
		for _, value := range *matrix {
			if goldenValue.I == value.I && goldenValue.K == value.K {
				if goldenValue.Rate != value.Rate {
					return &TestErrorMatrix{
						checkName,
						(strconv.Itoa(goldenValue.I) + " vs " + strconv.Itoa(goldenValue.K)),
						goldenValue.Rate,
						value.Rate,
					}
				}
			}
		}
	}

	return nil
}

func BenchmarkMatrixPvp(b *testing.B) {
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

	var Medicham = InitialData{
		Name:       "Medicham",
		Shields:    1,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
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
		IsGreedy:   true,
		Name:       "Snorlax",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	attacker := []InitialData{
		GiratinaAltered,
	}

	defender := []InitialData{
		Snorlax,
		AlolanMuk,
		AlolanMarowak,
		Swampert,
		Altaria,
		Azumarill,
		Venusaur,
		Medicham,
		Skarmory,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		errChan := make(ErrorChan, len(attacker)*len(defender))
		matrixResults := make([]MatrixResult, 0, len(attacker)*len(defender))

		for i, pokA := range attacker {
			for k, pokB := range defender {
				matrixBattleResult := MatrixResult{}
				//otherwise check pvp results in base

				singleBattleResult, err := NewPvpBetween(SinglePvpInitialData{
					AttackerData: pokA,
					DefenderData: pokB,
					Constr:       Constructor{},
					Logging:      false,
				})

				if err != nil {
					errChan <- err
					continue
				}
				matrixBattleResult.Rate = singleBattleResult.Attacker.Rate

				matrixBattleResult.I = i
				matrixBattleResult.K = k
				matrixResults = append(matrixResults, matrixBattleResult)
			}
		}
	}
}
