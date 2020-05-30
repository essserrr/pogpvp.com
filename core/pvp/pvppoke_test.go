package pvpsim

import (
	"testing"
)

func TestPvppoke(t *testing.T) {
	var Dewgong = InitialData{
		Name:       "Dewgong",
		AttackIV:   0,
		DefenceIV:  12,
		StaminaIV:  15,
		Level:      29.5,
		Shields:    2,
		QuickMove:  "Ice Shard",
		ChargeMove: []string{"Icy Wind", "Water Pulse"},
	}

	err := checkPVP(Dewgong, Dewgong, "pvpoke") //carge move priority
	if err != nil {
		t.Error(err)
	}
	err = checkPpvpoke(Dewgong, Dewgong, "pvpoke") //carge move priority
	if err != nil {
		t.Error(err)
	}
}

func checkPpvpoke(atatcker, defender InitialData, checkName string) error {
	currentRes, err := NewPvpBetweenPvppoke(SinglePvpInitialData{atatcker, defender, Constructor{}, true})
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

func BenchmarkMakepPvpokePVP(b *testing.B) {
	var Dewgong = InitialData{
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
		NewPvpBetweenPvppoke(SinglePvpInitialData{Dewgong, Dewgong, Constructor{}, true})
	}
}

func BenchmarkMakepPVPwithSwitch(b *testing.B) {
	var Dewgong = InitialData{
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
		NewPvpBetween(SinglePvpInitialData{Dewgong, Dewgong, Constructor{}, true})
	}
}
