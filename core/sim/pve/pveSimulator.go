package pve

import (
	"Solutions/pvpSimulator/core/sim/app"
	"fmt"
)

//PveObject contains single pve data
type PveObject struct {
	PartySize   uint8
	FriendStage float32
	Weather     map[int]float32

	Attacker []pokemon
	Boss     pokemon

	Timer float32
	app   *app.SimApp
}

func DealDamage(inDat CommonPvpInData) error {
	if inDat.Boss.Tier > 5 || inDat.Boss.Tier < 0 {
		return fmt.Errorf("Unknown raid tier")
	}
	if inDat.Boss.Tier > 8 || inDat.Boss.Tier < 0 {
		return fmt.Errorf("Unknown friendship tier")
	}
	obj := PveObject{}
	obj.app = inDat.App
	obj.Timer = tierTimer[inDat.Boss.Tier]
	obj.FriendStage = friendship[inDat.FriendStage]
	obj.Weather = weather[inDat.Weather]

	pok := pokemon{}
	err := obj.makeNewCharacter(&inDat.Pok, &pok)
	if err != nil {
		fmt.Println(err)
	}
	obj.Attacker = append(obj.Attacker, pok)

	err = obj.makeNewBoss(&inDat.Boss, &obj.Boss)
	if err != nil {
		fmt.Println(err)
	}

	err = obj.initializePve(inDat.Pok.Name, inDat.Boss.Name, 0)
	if err != nil {
		fmt.Println(err)
	}

	damage := int32(float32(obj.Attacker[0].quickMove.damage)*0.5*(obj.Attacker[0].effectiveAttack/obj.Boss.effectiveDefence)*obj.Attacker[0].quickMove.multiplier) + 1

	fmt.Println(damage)

	damageCh := int32(float32(obj.Attacker[0].chargeMove[0].damage)*0.5*(obj.Attacker[0].effectiveAttack/obj.Boss.effectiveDefence)*obj.Attacker[0].chargeMove[0].multiplier) + 1

	fmt.Println(damageCh)

	return nil
}

func (obj *PveObject) initializePve(attacker, boss string, i int) error {
	err := obj.Attacker[i].getQuickMultipliersAgainst(attacker, boss, obj, false)
	if err != nil {
		return err
	}
	err = obj.Boss.getQuickMultipliersAgainst(boss, attacker, obj, true)
	if err != nil {
		return err
	}
	err = obj.Attacker[i].getChargeMultipliersAgainst(attacker, boss, obj, false)
	if err != nil {
		return err
	}
	err = obj.Boss.getChargeMultipliersAgainst(boss, attacker, obj, true)
	if err != nil {
		return err
	}
	return nil
}

func (pok *pokemon) getQuickMultipliersAgainst(attacker, defender string, obj *PveObject, isBoss bool) error {
	moveEfficiency := obj.app.TypesData[pok.quickMove.moveType]

	var stabMultiplier float32 = 1.0
	for _, pokType := range obj.app.PokemonStatsBase[attacker].Type {
		if pokType == pok.quickMove.moveType {
			stabMultiplier = 1.2
			break
		}
	}

	var seMultiplier float32 = 1.0
	for _, trgType := range obj.app.PokemonStatsBase[defender].Type {
		if moveEfficiency[trgType] != 0.0 {
			seMultiplier *= moveEfficiency[trgType]
		}
	}

	weatherMultiplier, ok := obj.Weather[pok.quickMove.moveType]
	if !ok {
		weatherMultiplier = 1.0
	}

	switch isBoss {
	case true:
		pok.quickMove.multiplier = stabMultiplier * seMultiplier * weatherMultiplier
	default:
		pok.quickMove.multiplier = stabMultiplier * obj.FriendStage * seMultiplier * weatherMultiplier
	}

	return nil
}

func (pok *pokemon) getChargeMultipliersAgainst(attacker, defender string, obj *PveObject, isBoss bool) error {
	for move, moveContent := range pok.chargeMove {
		moveEfficiency := obj.app.TypesData[moveContent.moveType]

		var stabMultiplier float32 = 1.0
		for _, pokType := range obj.app.PokemonStatsBase[attacker].Type {
			if pokType == moveContent.moveType {
				stabMultiplier = 1.2
				break
			}
		}

		var seMultiplier float32 = 1.0
		for _, trgType := range obj.app.PokemonStatsBase[defender].Type {
			if moveEfficiency[trgType] != 0.0 {
				seMultiplier *= moveEfficiency[trgType]
			}
		}

		weatherMultiplier, ok := obj.Weather[moveContent.moveType]
		if !ok {
			weatherMultiplier = 1.0
		}

		switch isBoss {
		case true:
			pok.chargeMove[move].multiplier = stabMultiplier * seMultiplier * weatherMultiplier
		default:
			pok.chargeMove[move].multiplier = stabMultiplier * obj.FriendStage * seMultiplier * weatherMultiplier
		}

	}
	return nil
}
