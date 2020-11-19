package pvp

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"math"
)

const maxLevel = 50

type roundResults struct {
	actionCode uint8
	chargeName int8
}

type customError struct {
	What string
}

func (e *customError) Error() string {
	return fmt.Sprintf("%s", e.What)
}

type pokemon struct {
	quickMove move

	maxHP      int16
	whatToSkip int8

	skipShield bool
	fixShield  bool

	isTriggered bool
	fixTrigger  bool

	isAttacker bool
	isFreeHit  bool
	fixMove    bool
	//word
	effectiveAttack stat

	shields uint8

	energySpent     app.Energy
	potentialDamage int16

	//word

	results        roundResults
	roundsToDamage uint8
	energy         app.Energy
	//word

	effectiveDefence  stat
	hp                int16
	isGreedy          bool
	statsRecorded     bool
	inConstructorMode bool
	//word 58

	chargeMove      []move
	moveCooldown    uint8
	levelMultiplier float32
	//word

	//word 17
}

type stat struct {
	value      float32
	stageValue int8
}

type move struct {
	moveType int
	title    string

	pvpDurationSeconds uint8
	totalMultiplier    float32

	probability float32
	pvpDamage   float32

	pvpEnergy     int16
	pvpDuration   uint8
	stageDelta    int8
	subjectExists bool
}

func (pok *pokemon) makeNewCharacter(pokemonData *app.InitialData, obj *PvpObject, customMoves *map[string]app.MoveBaseEntry) ([]int, error) {
	err := pok.setLevel(pokemonData, obj)
	if err != nil {
		return []int{}, err
	}
	pokTypes, err := pok.makeNewBody(pokemonData, obj)
	if err != nil {
		return []int{}, err
	}
	err = pok.setIV(pokemonData)
	if err != nil {
		return []int{}, err
	}

	err = pok.setQuickMove(pokemonData, obj, customMoves)
	if err != nil {
		return []int{}, err
	}
	pok.chargeMove = make([]move, 0, 2)
	for i := 0; i < len(pokemonData.ChargeMove); i++ {
		err = pok.setChargeMove(pokemonData.ChargeMove[i], obj, customMoves)
		if err != nil {
			return []int{}, err
		}
	}
	return pokTypes, nil
}

func (pok *pokemon) makeNewBody(pokemonData *app.InitialData, obj *PvpObject) ([]int, error) { //sets up base stats
	speciesType, ok := obj.app.PokemonStatsBase[pokemonData.Name]
	if !ok {
		return []int{}, &customError{
			"There is no such pokemon",
		}
	}
	var (
		shadowABonus float32 = 1
		shadowDBonus float32 = 1
	)

	if pokemonData.IsShadow {
		shadowABonus = shadowBonusAttack
		shadowDBonus = shadowBonusDefence
	}

	pok.effectiveAttack.value = (float32(pokemonData.AttackIV) + float32(speciesType.Atk)) * shadowABonus * pok.levelMultiplier * stagesData[pok.effectiveAttack.stageValue]

	pok.effectiveDefence.value = (float32(pokemonData.DefenceIV) + float32(speciesType.Def)) * shadowDBonus * pok.levelMultiplier * stagesData[pok.effectiveDefence.stageValue]
	pok.maxHP = int16((float32(pokemonData.StaminaIV) + float32(speciesType.Sta)) * pok.levelMultiplier)

	return speciesType.Type, nil
}

func (pok *pokemon) setIV(pokemonData *app.InitialData) error { //sets up "individual values"
	if pokemonData.AttackIV > 15 || pokemonData.DefenceIV > 15 || pokemonData.StaminaIV > 15 || pokemonData.AttackIV < 0 || pokemonData.DefenceIV < 0 || pokemonData.StaminaIV < 0 {
		return &customError{
			"IV must be in range 0-15",
		}
	}
	return nil
}

func (pok *pokemon) setLevel(pokemonData *app.InitialData, obj *PvpObject) error { //sets up level and level-IV dependent stats
	if pokemonData.Level > maxLevel || pokemonData.Level < 1 {
		return &customError{
			fmt.Sprintf("Level must be in range 1-%v", maxLevel),
		}
	}

	if !isInteger(pokemonData.Level / 0.5) {
		return &customError{
			"Level must be multiple of 0.5",
		}
	}

	pok.levelMultiplier = obj.app.LevelData[int(pokemonData.Level/0.5)]

	return nil
}

func isInteger(floatNumber float32) bool { // sheck if the float is integer
	return math.Mod(float64(floatNumber), 1.0) == 0
}

func (pok *pokemon) setQuickMove(pokemonData *app.InitialData, obj *PvpObject, customMoves *map[string]app.MoveBaseEntry) error { // setst up quick move
	moveEntry, ok := findMove(pokemonData.QuickMove, obj, customMoves)
	if !ok {
		return &customError{
			"Quick move not found in the database",
		}
	}

	pok.quickMove.setMoveBody(moveEntry)
	pok.quickMove.setQuickBody(moveEntry)

	return nil
}

func findMove(move string, obj *PvpObject, customMoves *map[string]app.MoveBaseEntry) (app.MoveBaseEntry, bool) {
	moveEntry, ok := obj.app.PokemonMovesBase[move]
	if !ok {
		moveEntry, ok = (*customMoves)[move]
	}
	return moveEntry, ok
}

func (pok *pokemon) setChargeMove(chargeMove string, obj *PvpObject, customMoves *map[string]app.MoveBaseEntry) error { // setst up charge move
	if chargeMove == "" {
		return nil
	}
	moveEntry, ok := findMove(chargeMove, obj, customMoves)
	if !ok {
		return &customError{
			"Charge move not found in the database",
		}
	}

	var newMove move
	newMove.setMoveBody(moveEntry)
	newMove.setChargeBody(moveEntry)

	pok.chargeMove = append(pok.chargeMove, newMove)
	return nil
}

func (s *move) setMoveBody(moveEntry app.MoveBaseEntry) { // sets up move body (common for both types of moves)
	s.title = moveEntry.Title
	s.pvpDamage = moveEntry.PvpDamage
	s.pvpEnergy = moveEntry.PvpEnergy
	s.moveType = moveEntry.MoveType
}

func (s *move) setChargeBody(moveEntry app.MoveBaseEntry) { // sets up charge move body (individual for that type)
	s.probability = moveEntry.Probability
	s.stageDelta = moveEntry.StageDelta
	if moveEntry.Subject == "" {
		return
	}
	s.subjectExists = true
}

func (s *move) setQuickBody(moveEntry app.MoveBaseEntry) { // sets up quick move body (individual for that type)
	s.pvpDuration = moveEntry.PvpDuration
	s.pvpDurationSeconds = uint8(moveEntry.PvpDurationSeconds / 0.5)
}

func (pok *pokemon) setEffectiveStats(attackStageNumber int8, defenceStageNumber int8) {
	pok.setEffectiveAttack(attackStageNumber)
	pok.setEffectiveDefence(defenceStageNumber)
}

func (pok *pokemon) setEffectiveAttack(stageNumber int8) { //sets up effective attack
	originalValue := pok.effectiveAttack.value / stagesData[pok.effectiveAttack.stageValue]
	pok.effectiveAttack.setStage(stageNumber)
	pok.effectiveAttack.value = originalValue * stagesData[pok.effectiveAttack.stageValue]
}

func (pok *pokemon) setEffectiveDefence(stageNumber int8) { //sets up effective defence
	originalValue := pok.effectiveDefence.value / stagesData[pok.effectiveDefence.stageValue]
	pok.effectiveDefence.setStage(stageNumber)
	pok.effectiveDefence.value = originalValue * stagesData[pok.effectiveDefence.stageValue]
}

func (eS *stat) setStage(number int8) { //sets up stage value
	if number < -4 {
		eS.stageValue = -4
		return
	}
	if number > 4 {
		eS.stageValue = 4
		return
	}
	eS.stageValue = number
	return
}

var stagesData = map[int8]float32{ //map of stages: pvp stats multipliers //move to a single file and read at initialization???
	-4: 0.5,
	-3: 0.57,
	-2: 0.67,
	-1: 0.8,
	0:  1,
	1:  1.25,
	2:  1.5,
	3:  1.75,
	4:  2,
}
