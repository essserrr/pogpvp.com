package sim

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"path"
	"strconv"
	"sync"

	"github.com/boltdb/bolt"
)

type pokemonsBaseEntry struct {
	Atk uint16
	Def uint16
	Sta uint16

	Title string
	Type  []int

	ChargeMoves []string

	QuickMoves []string
}

type moveBaseEntry struct {
	PvpDurationSeconds float32

	Stat     []string
	Subject  string
	Title    string
	MoveType int

	PvpDamage float32

	PvpEnergy  int16
	StageDelta int8

	PvpDuration uint8

	Probability float32
}

var (
	app pvpApp
)

type pvpApp struct {
	boltDB database

	sync.Mutex
	pokemonStatsBase map[string]pokemonsBaseEntry
	pokemonMovesBase map[string]moveBaseEntry
	typesData        [][]float32
	levelData        []float32
	nodeLimit        uint32
}

type database struct {
	value *bolt.DB
}

func (dbs *database) Close() error {
	dbs.value.Sync()
	err := dbs.value.Close()
	if err != nil {
		return err
	}
	return nil
}
func (dbs *database) createDatabase(pathToDB, envPath string, bucketName []string) error {
	var err error
	dbs.value, err = bolt.Open(path.Join(os.Getenv(envPath)+pathToDB), 0600, nil)
	if err != nil {
		return err
	}
	err = dbs.value.Update(func(tx *bolt.Tx) error {
		for _, value := range bucketName {
			_, err := tx.CreateBucketIfNotExists([]byte(value))
			if err != nil {
				return fmt.Errorf("Can not create bucket %v: %v", bucketName, err)
			}
		}
		return nil
	})
	return err
}

//reads key in the bucket specified
func (dbs *database) readBase(bucket, key string) []byte {
	var base []byte
	dbs.value.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		base = b.Get([]byte(key))
		return nil
	})
	return base
}

//InitApp starts new pvp simulator
func InitApp() {
	err := app.boltDB.createDatabase("./semistatic.db", "BOLTDB", []string{"POKEMONS", "MOVES", "LEVELS", "MULTIPLIERS"})
	if err != nil {
		return
	}

	app.Lock()
	err = app.getData("LEVELS", "value", &app.levelData)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = app.getData("MULTIPLIERS", "value", &app.typesData)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = app.getData("MOVES", "value", &app.pokemonMovesBase)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = app.getData("POKEMONS", "value", &app.pokemonStatsBase)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = app.setLimit()
	if err != nil {
		fmt.Println(err)
		return
	}

	app.Unlock()

	err = app.boltDB.Close()
	if err != nil {
		return
	}
}

func init() {
	InitApp()
}

func (a *pvpApp) setLimit() error {
	limitStr := os.Getenv("NODE_LIMIT")
	if limitStr == "" {
		return fmt.Errorf("Node limit is not set")
	}
	limit, err := strconv.ParseUint(limitStr, 10, 64)
	if err != nil {
		return err
	}
	a.nodeLimit = uint32(limit)
	return nil
}

func (a *pvpApp) getData(bucketName, key string, toTarget interface{}) error {
	jsonString := a.boltDB.readBase(bucketName, key)
	err := json.Unmarshal(jsonString, toTarget)
	if err != nil {
		return err
	}
	return nil
}

type roundResults struct {
	actionCode uint8
	chargeName int8
}

//Energy is pokemon energy type, no more than 100
type Energy int16

func (en *Energy) addEnergy(energyValue Energy) { // energy cap is 100
	*en = *en + Energy(energyValue)
	if *en > 100 {
		*en = 100
	}
}

//InitialData contains initial data for pvp
type InitialData struct {
	Name  string
	Query string

	QuickMove  string
	ChargeMove []string

	Level float32

	InitialHp     int16
	InitialEnergy Energy

	InitialAttackStage  int8
	InitialDefenceStage int8

	AttackIV  uint8
	DefenceIV uint8
	StaminaIV uint8

	Shields uint8

	IsGreedy bool
	IsShadow bool
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

	energySpent     Energy
	potentialDamage int16

	//word

	results        roundResults
	roundsToDamage uint8
	energy         Energy
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

func (pok *pokemon) makeNewCharacter(pokemonData *InitialData) ([]int, error) {
	err := pok.setLevel(pokemonData)
	if err != nil {
		return []int{}, err
	}
	pokTypes, err := pok.makeNewBody(pokemonData)
	if err != nil {
		return []int{}, err
	}
	err = pok.setIV(pokemonData)
	if err != nil {
		return []int{}, err
	}

	err = pok.setQuickMove(pokemonData)
	if err != nil {
		return []int{}, err
	}
	pok.chargeMove = make([]move, 0, 2)
	for i := 0; i < len(pokemonData.ChargeMove); i++ {
		err = pok.setChargeMove(pokemonData.ChargeMove[i])
		if err != nil {
			return []int{}, err
		}
	}
	return pokTypes, nil
}

func (pok *pokemon) makeNewBody(pokemonData *InitialData) ([]int, error) { //sets up base stats
	speciesType, ok := app.pokemonStatsBase[pokemonData.Name]
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
		shadowABonus = 1.2
		shadowDBonus = 0.833
	}

	pok.effectiveAttack.value = (float32(pokemonData.AttackIV) + float32(speciesType.Atk)) * shadowABonus * pok.levelMultiplier * stagesData[pok.effectiveAttack.stageValue]

	pok.effectiveDefence.value = (float32(pokemonData.DefenceIV) + float32(speciesType.Def)) * shadowDBonus * pok.levelMultiplier * stagesData[pok.effectiveDefence.stageValue]
	pok.maxHP = int16((float32(pokemonData.StaminaIV) + float32(speciesType.Sta)) * pok.levelMultiplier)

	return speciesType.Type, nil
}

func (pok *pokemon) setIV(pokemonData *InitialData) error { //sets up "individual values"
	if pokemonData.AttackIV > 15 || pokemonData.DefenceIV > 15 || pokemonData.StaminaIV > 15 || pokemonData.AttackIV < 0 || pokemonData.DefenceIV < 0 || pokemonData.StaminaIV < 0 {
		return &customError{
			"IV must be in range 0-15",
		}
	}
	return nil
}

func (pok *pokemon) setLevel(pokemonData *InitialData) error { //sets up level and level-IV dependent stats
	if pokemonData.Level > 45 || pokemonData.Level < 1 {
		return &customError{
			"Level must be in range 1-45",
		}
	}

	if !isInteger(pokemonData.Level / 0.5) {
		return &customError{
			"Level must be multiple of 0.5",
		}
	}

	pok.levelMultiplier = app.levelData[int(pokemonData.Level/0.5)]

	return nil
}

func isInteger(floatNumber float32) bool { // sheck if the float is integer
	return math.Mod(float64(floatNumber), 1.0) == 0
}

func (pok *pokemon) setQuickMove(pokemonData *InitialData) error { // setst up quick move
	moveEntry, ok := app.pokemonMovesBase[pokemonData.QuickMove]
	if !ok {
		return &customError{
			"Quick move not found in the database",
		}
	}

	pok.quickMove.setMoveBody(moveEntry)
	pok.quickMove.setQuickBody(moveEntry)

	return nil
}

func (pok *pokemon) setChargeMove(chargeMove string) error { // setst up charge move
	if chargeMove == "" {
		return nil
	}
	moveEntry, ok := app.pokemonMovesBase[chargeMove]
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

func (s *move) setMoveBody(moveEntry moveBaseEntry) { // sets up move body (common for both types of moves)
	s.title = moveEntry.Title
	s.pvpDamage = moveEntry.PvpDamage
	s.pvpEnergy = moveEntry.PvpEnergy
	s.moveType = moveEntry.MoveType
}

func (s *move) setChargeBody(moveEntry moveBaseEntry) { // sets up charge move body (individual for that type)
	s.probability = moveEntry.Probability
	s.stageDelta = moveEntry.StageDelta
	if moveEntry.Subject == "" {
		return
	}
	s.subjectExists = true
}

func (s *move) setQuickBody(moveEntry moveBaseEntry) { // sets up quick move body (individual for that type)
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
