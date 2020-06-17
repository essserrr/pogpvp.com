package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"math"
)

//Energy is pokemon energy type, no more than 100
type Energy int16

//addEnergy energy cap is 100
func (en *Energy) addEnergy(energyValue int16) {
	*en = *en + Energy(energyValue)
	if *en > 100 {
		*en = 100
	}
}

type pokemon struct {
	quickMove move
	maxHP     int32

	chargeMove move
	hp         int32

	effectiveAttack  float32
	effectiveDefence float32

	timeToDamage    int32
	timeToEnergy    int32
	moveCooldown    int32
	levelMultiplier float32

	energy Energy
	action uint8

	damageRegistered bool
	energyRegistered bool
	isBoss           bool
}

type move struct {
	title    string
	moveType int

	cooldown     int32
	damageWindow int32
	dodgeWindow  int32
	multiplier   float32

	damage int16
	energy int16
}

func (obj *pveObject) makeNewCharacter(pokemonData *PokemonInitialData, pok *pokemon) error {
	err := pok.setLevel(pokemonData, obj)
	if err != nil {
		return err
	}
	err = pok.makeNewBody(pokemonData, obj)
	if err != nil {
		return err
	}
	err = pok.setQuickMove(pokemonData.QuickMove, obj)
	if err != nil {
		return err
	}
	err = pok.setChargeMove(pokemonData.ChargeMove, obj)
	if err != nil {
		return err
	}
	return nil
}

func (pok *pokemon) setLevel(pokemonData *PokemonInitialData, obj *pveObject) error { //sets up level and level-IV dependent stats
	if pokemonData.Level > 45 || pokemonData.Level < 1 {
		return fmt.Errorf("Level must be in range 1-45")
	}
	if !isInteger(pokemonData.Level / 0.5) {
		return fmt.Errorf("Level must be multiple of 0.5")
	}
	pok.levelMultiplier = obj.app.LevelData[int(pokemonData.Level/0.5)]
	return nil
}

func isInteger(floatNumber float32) bool { // sheck if the float is integer
	return math.Mod(float64(floatNumber), 1.0) == 0
}

func (pok *pokemon) makeNewBody(pokemonData *PokemonInitialData, obj *pveObject) error { //sets up base stats
	if pokemonData.AttackIV > 15 || pokemonData.DefenceIV > 15 || pokemonData.StaminaIV > 15 || pokemonData.AttackIV < 0 || pokemonData.DefenceIV < 0 || pokemonData.StaminaIV < 0 {
		return fmt.Errorf("IV must be in range 0-15")
	}
	speciesType, ok := obj.app.PokemonStatsBase[pokemonData.Name]
	if !ok {
		return fmt.Errorf("There is no such pokemon")
	}
	var (
		shadowABonus float32 = 1
		shadowDBonus float32 = 1
	)

	if pokemonData.IsShadow {
		shadowABonus = 1.2
		shadowDBonus = 0.833
	}

	pok.effectiveAttack = (float32(pokemonData.AttackIV) + float32(speciesType.Atk)) * shadowABonus * pok.levelMultiplier
	pok.effectiveDefence = (float32(pokemonData.DefenceIV) + float32(speciesType.Def)) * shadowDBonus * pok.levelMultiplier
	pok.maxHP = int32((float32(pokemonData.StaminaIV) + float32(speciesType.Sta)) * pok.levelMultiplier)
	return nil
}

func (pok *pokemon) setQuickMove(quickMove string, obj *pveObject) error { // setst up quick move
	moveEntry, ok := obj.app.PokemonMovesBase[quickMove]
	if !ok {
		return fmt.Errorf("Quick move not found in the database")
	}
	pok.quickMove = setMoveBody(moveEntry)
	return nil
}

func (pok *pokemon) setChargeMove(chargeMove string, obj *pveObject) error { // setst up charge move
	if chargeMove == "" {
		return nil
	}
	moveEntry, ok := obj.app.PokemonMovesBase[chargeMove]
	if !ok {
		return fmt.Errorf("Charge move not found in the database")
	}

	pok.chargeMove = setMoveBody(moveEntry)
	return nil
}

func setMoveBody(moveEntry app.MoveBaseEntry) move { // sets up move body (common for both types of moves)
	newMove := move{}
	newMove.title = moveEntry.Title
	newMove.cooldown = moveEntry.Cooldown
	newMove.damage = moveEntry.Damage
	newMove.damageWindow = moveEntry.DamageWindow
	newMove.dodgeWindow = moveEntry.DodgeWindow
	newMove.energy = moveEntry.Energy
	newMove.moveType = moveEntry.MoveType
	return newMove
}

func (obj *pveObject) makeNewBoss(bossInDat *BossInfo, boss *pokemon) error {
	boss.levelMultiplier = tierMult[bossInDat.Tier]
	err := boss.makeBossBody(bossInDat, obj)
	if err != nil {
		return err
	}
	err = boss.setQuickMove(bossInDat.QuickMove, obj)
	if err != nil {
		return err
	}
	err = boss.setChargeMove(bossInDat.ChargeMove, obj)
	if err != nil {
		return err
	}
	return nil
}

func (pok *pokemon) makeBossBody(bossInDat *BossInfo, obj *pveObject) error { //sets up base stats
	speciesType, ok := obj.app.PokemonStatsBase[bossInDat.Name]
	if !ok {
		return fmt.Errorf("Raid boss error: There is no such pokemon")
	}
	pok.effectiveAttack = (float32(15.0) + float32(speciesType.Atk)) * pok.levelMultiplier
	pok.effectiveDefence = (float32(15.0) + float32(speciesType.Def)) * pok.levelMultiplier
	pok.hp = tierHP[bossInDat.Tier]
	pok.isBoss = true
	return nil
}

/*
0 - extreme
1 - sunny
2 - rainy
3 - partly
4 - cloudy
5 - windy
6 - snowy
7 - foggy
*/

var weather = []map[int]float32{
	0: {},
	1: {
		10: 1.2,
		9:  1.2,
		6:  1.2,
	},
	2: {
		0:  1.2,
		3:  1.2,
		17: 1.2,
	},
	3: {
		15: 1.2,
		12: 1.2,
	},
	4: {
		13: 1.2,
		4:  1.2,
		5:  1.2,
	},
	5: {
		14: 1.2,
		7:  1.2,
		2:  1.2,
	},
	6: {
		16: 1.2,
		11: 1.2,
	},
	7: {
		8: 1.2,
		1: 1.2,
	},
}

var friendship = []float32{
	0: 1.0,
	1: 1.03,
	2: 1.05,
	3: 1.07,
	4: 1.1,
	5: 1.06,
	6: 1.12,
	7: 1.18,
	8: 1.25,
}

var tierHP = []int32{
	0: 600,
	1: 1800,
	2: 3600,
	3: 9000,
	4: 15000,
	5: 22500,
}

var tierTimer = []int32{
	0: 180000,
	1: 180000,
	2: 180000,
	3: 180000,
	4: 300000,
	5: 300000,
}

var tierMult = []float32{
	0: 0.5974,
	1: 0.67,
	2: 0.73,
	3: 0.79,
	4: 0.79,
	5: 0.79,
}
