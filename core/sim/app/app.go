package app

import (
	"encoding/json"
	"fmt"
	"os"
	"path"
	"strconv"
	"sync"

	"github.com/boltdb/bolt"
)

type SimApp struct {
	BoltDB database

	sync.Mutex
	PokemonStatsBase map[string]PokemonsBaseEntry
	PokemonMovesBase map[string]MoveBaseEntry
	TypesData        [][]float32
	LevelData        []float32
	NodeLimit        uint32
}

type PokemonsBaseEntry struct {
	Atk uint16
	Def uint16
	Sta uint16

	Title string
	Type  []int

	ChargeMoves []string

	QuickMoves []string
}

type MoveBaseEntry struct {
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
