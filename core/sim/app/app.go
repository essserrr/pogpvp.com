package app

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"strconv"
	"sync"
	"time"

	"github.com/boltdb/bolt"
)

//SimApp contains databses
type SimApp struct {
	BoltDB database

	sync.Mutex
	PokemonStatsBase map[string]PokemonsBaseEntry
	PokemonMovesBase map[string]MoveBaseEntry
	TypesData        [][]float32
	LevelData        []float32
	NodeLimit        uint32
}

//PokemonsBaseEntry pokemon base entry
type PokemonsBaseEntry struct {
	Atk uint16
	Def uint16
	Sta uint16

	Title string
	Type  []int

	ChargeMoves []string

	QuickMoves []string

	EliteMoves map[string]int
}

//MoveBaseEntry move base entry
type MoveBaseEntry struct {
	PvpDurationSeconds float32

	Stat         []string
	MoveCategory string
	Subject      string
	Title        string
	MoveType     int

	PvpDamage   float32
	Probability float32

	Cooldown     int32
	DamageWindow int32
	DodgeWindow  int32

	Damage int16
	Energy int16

	PvpEnergy  int16
	StageDelta int8

	PvpDuration uint8
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
func InitApp() *SimApp {
	app := SimApp{}

	err := app.BoltDB.createDatabase("./semistatic.db", "BOLTDB", []string{"POKEMONS", "MOVES", "LEVELS", "MULTIPLIERS"})
	if err != nil {
		return nil
	}

	app.Lock()
	err = app.getData("LEVELS", "value", &app.LevelData)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	err = app.getData("MULTIPLIERS", "value", &app.TypesData)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	err = app.getData("MOVES", "value", &app.PokemonMovesBase)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	err = app.getData("POKEMONS", "value", &app.PokemonStatsBase)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	err = app.setLimit()
	if err != nil {
		fmt.Println(err)
		return nil
	}

	app.Unlock()

	err = app.BoltDB.Close()
	if err != nil {
		return nil
	}
	return &app
}

func (a *SimApp) setLimit() error {
	limitStr := os.Getenv("NODE_LIMIT")
	if limitStr == "" {
		return fmt.Errorf("Node limit is not set")
	}
	limit, err := strconv.ParseUint(limitStr, 10, 64)
	if err != nil {
		return err
	}
	a.NodeLimit = uint32(limit)
	return nil
}

func (a *SimApp) getData(bucketName, key string, toTarget interface{}) error {
	jsonString := a.BoltDB.readBase(bucketName, key)
	err := json.Unmarshal(jsonString, toTarget)
	if err != nil {
		return err
	}
	return nil
}

//ErrorChan a set of errors returned by matrix battle
type ErrorChan chan error

//Flush prints all errors got from matrix battle
func (eCh *ErrorChan) Flush() string {
	var errorString string
	for value := range *eCh {
		errorString += value.Error()
		errorString += ", "
	}
	return errorString
}

//Energy is pokemon energy type, no more than 100
type Energy int16

//AddEnergy energy cap is 100
func (en *Energy) AddEnergy(energyValue int16) {
	*en = *en + Energy(energyValue)
	if *en > 100 {
		*en = 100
	}
}

//IntialDataPve contains data to start common raid
type IntialDataPve struct {
	App         *SimApp
	CustomMoves *map[string]MoveBaseEntry

	NumberOfRuns  int
	FriendStage   int
	Weather       int
	DodgeStrategy int

	Pok           PokemonInitialData
	AggresiveMode bool

	Boss          BossInfo
	PartySize     uint8
	PlayersNumber uint8

	BoostSlotPokemon PokemonInitialData
	BoostSlotEnabled bool
}

//PokemonInitialData contains initial data for pvp
type PokemonInitialData struct {
	Name string

	QuickMove  string
	ChargeMove string

	Level float32

	AttackIV  uint8
	DefenceIV uint8
	StaminaIV uint8

	IsShadow bool
}

//BossInfo contains boss initial data
type BossInfo struct {
	Name       string
	QuickMove  string
	ChargeMove string
	Tier       uint8
}

//CommonResult is antry of common pvp result list
type CommonResult struct {
	AName string
	AQ    string
	ACh   string

	BoostName string
	BoostQ    string
	BoostCh   string

	BName string
	BQ    string
	BCh   string

	DMin int32
	DMax int32
	DAvg int32

	TMin int32
	TMax int32
	TAvg int32

	FMin uint32
	FMax uint32

	NOfWins float32
}

//Constructor is an object transformin single PvP into Constructed pvp
type Constructor struct {
	Round    uint16
	Attacker Status
	Defender Status
}

//Status contains ech pokemons status for constructed pvp
type Status struct {
	IsTriggered bool
	SkipShield  bool

	MoveCooldown   uint8
	RoundsToDamage uint8

	WhatToSkip int8
}

//MatrixResult contains result of matrix battle
type MatrixResult struct {
	Rate   uint16
	I      int
	K      int
	QueryA string
	QueryB string
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

//PvpResults contains results of a single pvp: log, combatants and attackers`s hp rate
type PvpResults struct {
	CreatedAt time.Time
	I         int
	K         int
	Log       PvpLog
	Attacker  SingleResult
	Defender  SingleResult
	IsRandom  bool
}

//SingleResult contains result of a single pvp battle
type SingleResult struct {
	Name string
	Rate uint16

	DamageBlocked  int16
	MaxHP          int16
	HP             uint16
	EnergyRemained Energy

	EnergyUsed Energy
}

//RatingResult contains set of rating battle data
type RatingResult struct {
	Attacker RatingBattleResult
	Defender RatingBattleResult
}

//RatingBattleResult contains reting batlle data
type RatingBattleResult struct {
	Rate   uint16
	Name   string
	Quick  string
	Charge []string
}

//PvpLog contains pvp log as slice of rounds.
//Each round contains slice of events, each event is structure of logValue type
type PvpLog []LogValue

//LogValue log event is description of a round
type LogValue struct {
	Round    uint16
	Attacker Event
	Defender Event
}

//Event log value elementary part
type Event struct {
	HP         int16
	Energy     Energy
	ActionName string
	ActionCode uint8
	StageA     int8
	StageD     int8
	IsSelf     bool
	Order      bool

	ShieldIsUsed bool
}

//PrintLog prints log using fmt.Println
func (l *PvpLog) PrintLog() {
	for _, roundValue := range *l {
		fmt.Println(roundValue)
	}
}

//WriteLog writes log to a file
func (l *PvpLog) WriteLog(fileName string) error {
	file, err := json.MarshalIndent(l, "", " ")
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(fileName, file, 0644)
	if err != nil {
		return err
	}
	return nil
}

//ReadLog reads log from a fila using
func (l *PvpLog) ReadLog(fileName string) error {
	file, err := os.Open(fileName)
	if err != nil {
		return err
	}

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}
	file.Close()
	err = json.Unmarshal(byteValue, l)
	if err != nil {
		return err
	}
	return nil
}

//WriteShield writes shield event
func (e *Event) WriteShield(isUsed bool) {
	e.ShieldIsUsed = isUsed
}

//WriteTrigger writes trigger event: stages and target
func (e *Event) WriteTrigger(aStage, dStage int8, isSelf bool) {
	e.IsSelf = isSelf
	e.StageA = aStage
	e.StageD = dStage
}

//MakeNewRound appends new round
func (l *PvpLog) MakeNewRound(round uint16) {
	*l = append(*l, LogValue{Round: round})
}

//WriteMove writes move name and code
func (e *Event) WriteMove(name string, code uint8) {
	if code == 0 {
		return
	}
	e.ActionName = name
	e.ActionCode = code
}

//WriteOrder writes pokemons order
func (e *Event) WriteOrder() {
	e.Order = true
}

//SinglePvpInitialData contains all data is needed to build new singe pvp
type SinglePvpInitialData struct {
	AttackerData InitialData
	DefenderData InitialData

	CustomMoves *map[string]MoveBaseEntry
	Constr      Constructor
	Logging     bool
	App         *SimApp
}
