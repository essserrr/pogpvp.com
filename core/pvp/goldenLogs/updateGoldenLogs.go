package goldenlogs

import (
	pvpsim "Solutions/pvpSimulator/core/pvp"
	"encoding/json"
	"io/ioutil"
	"os"
	"path"
)

var links = map[string]string{
	"knockQuickQuick":    (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/knockQuickQuick.json")),
	"knockChargeQuick":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/knockChargeQuick.json")),
	"simultaneousQuick":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/simultaneousQuick.json")),
	"knockQuickCharge":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/knockQuickCharge.json")),
	"simultaneousCharge": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/simultaneousCharge.json")),
	"generalShielded":    (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/generalShielded.json")),
	"shielded11":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/shielded11.json")),
	"shielded10":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/shielded10.json")),

	"azumarillVenusaur":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/azumarillVenusaur.json")),
	"azumarillMeganium":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/azumarillMeganium.json")),
	"azumarillMedicham":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/azumarillMedicham.json")),
	"azumarillRegisteel": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/azumarillRegisteel.json")),
	"skarmoryVigoroth":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/skarmoryVigoroth.json")),
	"skarmoryAltaria":    (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/skarmoryAltaria.json")),
	"giratinaASnorlax":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/giratinaASnorlax.json")),

	"shieldedAlolanMukAlolanMarowak":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/shieldedAlolanMukAlolanMarowak.json")),
	"shieldedSwampertAltaria":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/shieldedSwampertAltaria.json")),
	"shieldedAzumarillVenusaur1":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/shieldedAzumarillVenusaur1.json")),
	"shieldedAzumarillVenusaur2":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/shieldedAzumarillVenusaur2.json")),
	"shieldedSkarmoryAltaria":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/shieldedSkarmoryAltaria.json")),
	"shieldedGiratinaAlteredSnorlax1": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/shieldedGiratinaAlteredSnorlax1.json")),
	"shieldedGiratinaAlteredSnorlax2": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/shieldedGiratinaAlteredSnorlax2.json")),

	"matrixBattle": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/matrixBattle.json")),

	"pvppoke": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/pvp/goldenLogs/pvppoke.json")),
}

//Update updates base of golden logs
func Update() error {
	err := updateUnshielded1CM()
	if err != nil {
		return err
	}
	err = updateShielded1CM()
	if err != nil {
		return err
	}
	err = updateUnshielded2CM()
	if err != nil {
		return err
	}
	err = updateShielded2CM()
	if err != nil {
		return err
	}
	err = updateMatrix()
	if err != nil {
		panic(err)
	}
	err = updatePvppoke()
	if err != nil {
		panic(err)
	}
	return nil
}

// tests for unshielded PvP with 1 charge move

func updateUnshielded1CM() error {
	var Magnezone = pvpsim.InitialData{
		Name:       "Magnezone",
		AttackIV:   0,
		DefenceIV:  13,
		StaminaIV:  15,
		Level:      17.5,
		QuickMove:  "Charge Beam",
		ChargeMove: []string{"Wild Charge", ""},
	}
	var Medicham = pvpsim.InitialData{
		Name:       "Medicham",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", ""},
	}
	var Swampert = pvpsim.InitialData{
		Name:       "Swampert",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", ""},
	}

	Magnezone.InitialHp = 37
	Magnezone.InitialEnergy = 0
	Swampert.InitialHp = 13
	Swampert.InitialEnergy = 0
	err := writeGoldenLog(Magnezone, Swampert, links["knockQuickQuick"]) //knock down an opponent by a quick move before his quick move deals damage to you
	if err != nil {
		return nil
	}

	Magnezone.InitialHp = 37
	Magnezone.InitialEnergy = 0
	Swampert.InitialHp = 13
	Swampert.InitialEnergy = 9
	err = writeGoldenLog(Magnezone, Swampert, links["knockChargeQuick"]) //knock down an opponent by a charge move before his quick move deals damage to you
	if err != nil {
		return nil
	}

	Magnezone.InitialHp = 36
	Magnezone.InitialEnergy = 0
	Swampert.InitialHp = 12
	Swampert.InitialEnergy = 0
	err = writeGoldenLog(Magnezone, Swampert, links["simultaneousQuick"]) //simultaneous knock down by a quick move
	if err != nil {
		return nil
	}

	Medicham.InitialHp = 33
	Medicham.InitialEnergy = 4
	Swampert.InitialHp = 51
	Swampert.InitialEnergy = 4
	err = writeGoldenLog(Medicham, Swampert, links["knockQuickCharge"]) //knock down an opponent by a quick move before his charge move deals damage to you
	if err != nil {
		return nil
	}

	Medicham.InitialHp = 33
	Medicham.InitialEnergy = 4
	Swampert.InitialHp = 51
	Swampert.InitialEnergy = 10
	err = writeGoldenLog(Medicham, Swampert, links["simultaneousCharge"]) //simultaneous knock down by a charge move
	if err != nil {
		return nil
	}

	return nil
}

//shielded PvP with 1 charge move

func updateShielded1CM() error {
	var Medicham = pvpsim.InitialData{
		Name:       "Medicham",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", ""},
	}

	var Swampert = pvpsim.InitialData{
		Name:       "Swampert",
		Shields:    2,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", ""},
	}

	err := writeGoldenLog(Medicham, Swampert, links["generalShielded"]) //general shielded PvP 2-2
	if err != nil {
		return err
	}

	Medicham.Shields = 1
	Swampert.Shields = 1
	err = writeGoldenLog(Medicham, Swampert, links["shielded11"]) //general shielded PvP 2-2
	if err != nil {
		return err
	}

	Medicham.Shields = 1
	Swampert.Shields = 0
	err = writeGoldenLog(Medicham, Swampert, links["shielded10"]) //shielded PvP 1-0
	if err != nil {
		return err
	}
	return nil
}

func updateUnshielded2CM() error {

	var Azumarill = pvpsim.InitialData{
		Name:       "Azumarill",
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = pvpsim.InitialData{
		Name:       "Venusaur",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      21,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Meganium = pvpsim.InitialData{
		Name:       "Meganium",
		AttackIV:   0,
		DefenceIV:  10,
		StaminaIV:  15,
		Level:      24,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Frenzy Plant", "Earthquake"},
	}

	var Medicham = pvpsim.InitialData{
		Name:       "Medicham",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
	}
	var Registeel = pvpsim.InitialData{
		Name:       "Registeel",
		AttackIV:   2,
		DefenceIV:  13,
		StaminaIV:  14,
		Level:      23.5,
		QuickMove:  "Lock-On",
		ChargeMove: []string{"Flash Cannon", "Focus Blast"},
	}
	var Skarmory = pvpsim.InitialData{
		Name:       "Skarmory",
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  14,
		Level:      27.5,
		QuickMove:  "Air Slash",
		ChargeMove: []string{"Sky Attack", "Flash Cannon"},
	}
	var Vigoroth = pvpsim.InitialData{
		Name:       "Vigoroth",
		AttackIV:   1,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Counter",
		ChargeMove: []string{"Body Slam", "Brick Break"},
	}
	var Altaria = pvpsim.InitialData{
		Name:       "Altaria",
		AttackIV:   2,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}

	var GiratinaA = pvpsim.InitialData{
		Name:       "Giratina (Altered Forme)",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}

	var Snorlax = pvpsim.InitialData{
		Name:       "Snorlax",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	err := writeGoldenLog(Azumarill, Venusaur, links["azumarillVenusaur"])
	if err != nil {
		return err
	}
	err = writeGoldenLog(Azumarill, Meganium, links["azumarillMeganium"])
	if err != nil {
		return err
	}
	err = writeGoldenLog(Azumarill, Medicham, links["azumarillMedicham"])
	if err != nil {
		return err
	}
	err = writeGoldenLog(Azumarill, Registeel, links["azumarillRegisteel"])
	if err != nil {
		return err
	}
	err = writeGoldenLog(Skarmory, Vigoroth, links["skarmoryVigoroth"])
	if err != nil {
		return err
	}
	err = writeGoldenLog(Skarmory, Altaria, links["skarmoryAltaria"])
	if err != nil {
		return err
	}
	err = writeGoldenLog(GiratinaA, Snorlax, links["giratinaASnorlax"])
	if err != nil {
		return err
	}
	return nil

}

func updateShielded2CM() error {
	var AlolanMuk = pvpsim.InitialData{
		Name:       "Alolan Muk",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      20.5,
		QuickMove:  "Bite",
		ChargeMove: []string{"Dark Pulse", "Acid Spray"},
	}
	var AlolanMarowak = pvpsim.InitialData{
		Name:       "Alolan Marowak",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      33.5,
		QuickMove:  "Hex",
		ChargeMove: []string{"Bone Club", "Shadow Ball"},
	}
	var Swampert = pvpsim.InitialData{
		Name:       "Swampert",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", "Earthquake"},
	}
	var Altaria = pvpsim.InitialData{
		Name:       "Altaria",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}
	var Azumarill = pvpsim.InitialData{
		Name:       "Azumarill",
		Shields:    2,
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = pvpsim.InitialData{
		Name:       "Venusaur",
		Shields:    2,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      21,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Skarmory = pvpsim.InitialData{
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

	var GiratinaAltered = pvpsim.InitialData{
		Name:       "Giratina (Altered Forme)",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}
	var Snorlax = pvpsim.InitialData{
		Name:       "Snorlax",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}

	err := writeGoldenLog(AlolanMuk, AlolanMarowak, links["shieldedAlolanMukAlolanMarowak"])
	if err != nil {
		return err
	}

	Altaria.InitialHp = 63
	Altaria.InitialEnergy = 3
	Altaria.Shields = 1
	Swampert.InitialHp = 107
	Swampert.Shields = 1
	err = writeGoldenLog(Swampert, Altaria, links["shieldedSwampertAltaria"])
	if err != nil {
		return err
	}
	err = writeGoldenLog(Azumarill, Venusaur, links["shieldedAzumarillVenusaur1"])
	if err != nil {
		return err
	}
	Venusaur.ChargeMove = []string{"Frenzy Plant", "Sludge Bomb"}

	err = writeGoldenLog(Azumarill, Venusaur, links["shieldedAzumarillVenusaur2"])
	if err != nil {
		return err
	}

	Altaria.InitialHp = 56
	Altaria.Shields = 2
	err = writeGoldenLog(Skarmory, Altaria, links["shieldedSkarmoryAltaria"])
	if err != nil {
		return err
	}

	err = writeGoldenLog(GiratinaAltered, Snorlax, links["shieldedGiratinaAlteredSnorlax1"])
	if err != nil {
		return err
	}
	GiratinaAltered.Shields = 1
	err = writeGoldenLog(GiratinaAltered, Snorlax, links["shieldedGiratinaAlteredSnorlax2"])
	if err != nil {
		return err
	}

	return nil

}

func writeGoldenLog(atatcker, defender pvpsim.InitialData, logName string) error {
	result, err := pvpsim.NewPvpBetween(pvpsim.SinglePvpInitialData{AttackerData: atatcker,
		DefenderData: defender,
		Constr:       pvpsim.Constructor{}})
	if err != nil {
		return err
	}
	err = result.Log.WriteLog(logName)
	if err != nil {
		return err
	}
	return nil
}

func updateMatrix() error {
	var AlolanMuk = pvpsim.InitialData{
		Name:       "Alolan Muk",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      20.5,
		QuickMove:  "Bite",
		ChargeMove: []string{"Dark Pulse", "Acid Spray"},
	}
	var AlolanMarowak = pvpsim.InitialData{
		Name:       "Alolan Marowak",
		Shields:    1,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      33.5,
		QuickMove:  "Hex",
		ChargeMove: []string{"Bone Club", "Shadow Ball"},
	}
	var Swampert = pvpsim.InitialData{
		Name:       "Swampert",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  14,
		Level:      19,
		QuickMove:  "Water Gun",
		ChargeMove: []string{"Hydro Cannon", "Earthquake"},
	}
	var Altaria = pvpsim.InitialData{
		Name:       "Altaria",
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  15,
		Level:      29,
		QuickMove:  "Dragon Breath",
		ChargeMove: []string{"Sky Attack", "Dragon Pulse"},
	}
	var Azumarill = pvpsim.InitialData{
		Name:       "Azumarill",
		Shields:    2,
		AttackIV:   8,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Bubble",
		ChargeMove: []string{"Ice Beam", "Play Rough"},
	}
	var Venusaur = pvpsim.InitialData{
		Name:       "Venusaur",
		Shields:    2,
		AttackIV:   0,
		DefenceIV:  14,
		StaminaIV:  11,
		Level:      21,
		QuickMove:  "Vine Whip",
		ChargeMove: []string{"Solar Beam", "Sludge Bomb"},
	}

	var Medicham = pvpsim.InitialData{
		Name:       "Medicham",
		Shields:    1,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
	}

	var Skarmory = pvpsim.InitialData{
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

	var GiratinaAltered = pvpsim.InitialData{
		Name:       "Giratina (Altered Forme)",
		Shields:    2,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}
	var Snorlax = pvpsim.InitialData{
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
	err := writeGoldenMatrix([]pvpsim.InitialData{
		GiratinaAltered,
	},
		[]pvpsim.InitialData{
			Snorlax,
			AlolanMuk,
			AlolanMarowak,
			Swampert,
			Altaria,
			Azumarill,
			Venusaur,
			Medicham,
			Skarmory,
		}, links["matrixBattle"])
	if len(err) > 0 {
		err.Flush()
		panic("")
	}
	return nil
}

func writeGoldenMatrix(attacker, defender []pvpsim.InitialData, matrixName string) pvpsim.ErrorChan {
	errChan := make(pvpsim.ErrorChan, len(attacker)*len(defender))
	matrixResults := make([]pvpsim.MatrixResult, 0, len(attacker)*len(defender))

	for i, pokA := range attacker {
		for k, pokB := range defender {
			matrixBattleResult := pvpsim.MatrixResult{}
			//otherwise check pvp results in base

			singleBattleResult, err := pvpsim.NewPvpBetween(pvpsim.SinglePvpInitialData{
				AttackerData: pokA,
				DefenderData: pokB,
				Constr:       pvpsim.Constructor{}})

			if err != nil {
				errChan <- err
				continue
			}
			matrixBattleResult.Attacker.Rate = singleBattleResult.Attacker.Rate
			matrixBattleResult.Defender.Rate = singleBattleResult.Defender.Rate

			matrixBattleResult.I = i
			matrixBattleResult.K = k
			matrixResults = append(matrixResults, matrixBattleResult)
		}
	}

	close(errChan)
	errStr := errChan.Flush()
	if errStr != "" {
		panic(errStr)
	}

	file, errR := json.Marshal(matrixResults)
	if errR != nil {
		panic(errR)
	}
	errR = ioutil.WriteFile(matrixName, file, 0644)
	if errR != nil {
		panic(errR)
	}
	return nil
}

func updatePvppoke() error {
	var Dewgong = pvpsim.InitialData{
		Name:       "Dewgong",
		AttackIV:   0,
		DefenceIV:  12,
		StaminaIV:  15,
		Level:      29.5,
		Shields:    2,
		QuickMove:  "Ice Shard",
		ChargeMove: []string{"Icy Wind", "Water Pulse"},
	}

	err := writeGoldenLog(Dewgong, Dewgong, links["pvppoke"])
	if err != nil {
		return err
	}

	return nil
}
