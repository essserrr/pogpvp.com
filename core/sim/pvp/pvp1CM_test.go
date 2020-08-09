package pvp

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"log"
	"os"
	"path"
	"testing"
)

var testApp = app.InitApp()

var linksTree = map[string]string{
	"shieldedTree": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenTrees/shieldedTree.json")),
}

var links = map[string]string{
	"knockQuickQuick":    (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/knockQuickQuick.json")),
	"knockChargeQuick":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/knockChargeQuick.json")),
	"simultaneousQuick":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/simultaneousQuick.json")),
	"knockQuickCharge":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/knockQuickCharge.json")),
	"simultaneousCharge": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/simultaneousCharge.json")),
	"generalShielded":    (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/generalShielded.json")),
	"shielded11":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shielded11.json")),
	"shielded10":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shielded10.json")),

	"azumarillVenusaur":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/azumarillVenusaur.json")),
	"azumarillMeganium":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/azumarillMeganium.json")),
	"azumarillMedicham":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/azumarillMedicham.json")),
	"azumarillRegisteel": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/azumarillRegisteel.json")),
	"skarmoryVigoroth":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/skarmoryVigoroth.json")),
	"skarmoryAltaria":    (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/skarmoryAltaria.json")),
	"giratinaASnorlax":   (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/giratinaASnorlax.json")),

	"shieldedAlolanMukAlolanMarowak":  (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedAlolanMukAlolanMarowak.json")),
	"shieldedSwampertAltaria":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedSwampertAltaria.json")),
	"shieldedAzumarillVenusaur1":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedAzumarillVenusaur1.json")),
	"shieldedAzumarillVenusaur2":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedAzumarillVenusaur2.json")),
	"shieldedSkarmoryAltaria":         (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedSkarmoryAltaria.json")),
	"shieldedGiratinaAlteredSnorlax1": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedGiratinaAlteredSnorlax1.json")),
	"shieldedGiratinaAlteredSnorlax2": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/shieldedGiratinaAlteredSnorlax2.json")),

	"pvpoke":        (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpoke.json")),
	"pvpoke14":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpoke14.json")),
	"pvpoke34":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpoke34.json")),
	"pvpoke24":      (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpoke24.json")),
	"pvpokeConstr1": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpokeConstr1.json")),
	"pvpokeConstr2": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/pvpokeConstr2.json")),

	"constr1": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/constr1.json")),
	"constr2": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/constr2.json")),
}

var linksMatrix = map[string]string{
	"matrixBattle": (path.Join(os.Getenv("PVP_SIMULATOR_ROOT") + "./core/sim/goldenLogs/matrixBattle.json")),
}

var goldenLogs = map[string]app.PvpLog{}

func init() {
	goldenLogs = getGoldenLogs()
}

func getGoldenLogs() map[string]app.PvpLog {
	mapToReturn := make(map[string]app.PvpLog)

	for key, value := range links {
		var entryOfMapToReturn app.PvpLog
		err := entryOfMapToReturn.ReadLog(value)
		if err != nil {
			log.Fatal(err)
		}
		mapToReturn[key] = entryOfMapToReturn
	}
	return mapToReturn
}

type TestErrorLog struct {
	Test     string
	Round    int
	Expected app.LogValue
	Got      app.LogValue
}

func (e *TestErrorLog) Error() string {
	return fmt.Sprintf("For %v round: %v, Expected: %v, got: %v", e.Test, e.Round, e.Expected, e.Got)
}

//tests for unshielded PvP with 1 charge move

func TestUnshielded1CM(t *testing.T) {
	var Magnezone = app.InitialData{
		Name:       "Magnezone",
		AttackIV:   0,
		DefenceIV:  13,
		StaminaIV:  15,
		Level:      17.5,
		QuickMove:  "Charge Beam",
		ChargeMove: []string{"Wild Charge", ""},
	}
	var Medicham = app.InitialData{
		Name:       "Medicham",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", ""},
	}
	var Swampert = app.InitialData{
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
	err := checkPVP(Magnezone, Swampert, "knockQuickQuick", app.Constructor{}) //knock down an opponent by a quick move before his quick move deals damage to you
	if err != nil {
		t.Error(err)
	}

	Magnezone.InitialHp = 37
	Magnezone.InitialEnergy = 0
	Swampert.InitialHp = 13
	Swampert.InitialEnergy = 9
	err = checkPVP(Magnezone, Swampert, "knockChargeQuick", app.Constructor{}) //knock down an opponent by a charge move before his quick move deals damage to you
	if err != nil {
		t.Error(err)
	}

	Magnezone.InitialHp = 36
	Magnezone.InitialEnergy = 0
	Swampert.InitialHp = 12
	Swampert.InitialEnergy = 0
	err = checkPVP(Magnezone, Swampert, "simultaneousQuick", app.Constructor{}) //simultaneous knock down by a quick move
	if err != nil {
		t.Error(err)
	}

	Medicham.InitialHp = 33
	Medicham.InitialEnergy = 4
	Swampert.InitialHp = 51
	Swampert.InitialEnergy = 4
	err = checkPVP(Medicham, Swampert, "knockQuickCharge", app.Constructor{}) //knock down an opponent by a quick move before his charge move deals damage to you
	if err != nil {
		t.Error(err)
	}

	Medicham.InitialHp = 33
	Medicham.InitialEnergy = 4
	Swampert.InitialHp = 51
	Swampert.InitialEnergy = 10
	err = checkPVP(Medicham, Swampert, "simultaneousCharge", app.Constructor{}) //carge move priority
	if err != nil {
		t.Error(err)
	}
}

func checkPVP(atatcker, defender app.InitialData, checkName string, constr app.Constructor) error {
	currentRes, err := NewPvpBetween(app.SinglePvpInitialData{atatcker, defender, &map[string]app.MoveBaseEntry{}, constr, true, testApp})
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

func checkLog(currentLog app.PvpLog, checkName string) error {
	for keyRound, valueRound := range goldenLogs[checkName] {

		if valueRound != currentLog[keyRound] {
			return &TestErrorLog{
				checkName,
				keyRound,
				valueRound,
				currentLog[keyRound],
			}
		}

	}
	return nil
}

func BenchmarkMakePvp(b *testing.B) {
	var Medicham = app.InitialData{
		Name:       "Medicham",
		InitialHp:  0,
		Shields:    0,
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      40,
		QuickMove:  "Counter",
		ChargeMove: []string{"Power-Up Punch", "Dynamic Punch"},
	}

	var Kingdra = app.InitialData{
		Name:       "Kingdra",
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
		NewPvpBetween(app.SinglePvpInitialData{Medicham, Kingdra, &map[string]app.MoveBaseEntry{}, app.Constructor{}, true, testApp})
	}
}

func BenchmarkMakePvpLong(b *testing.B) {
	var GiratinaA = app.InitialData{
		Name:       "Giratina (Altered Forme)",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Shadow Claw",
		ChargeMove: []string{"Dragon Claw", "Shadow Sneak"},
	}

	var Snorlax = app.InitialData{
		Name:       "Snorlax",
		AttackIV:   15,
		DefenceIV:  15,
		StaminaIV:  15,
		Level:      41,
		QuickMove:  "Lick",
		ChargeMove: []string{"Body Slam", "Superpower"},
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		NewPvpBetween(app.SinglePvpInitialData{GiratinaA, Snorlax, &map[string]app.MoveBaseEntry{}, app.Constructor{}, true, testApp})
	}
}
