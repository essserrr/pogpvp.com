package parser

import (
	"Solutions/pvpSimulator/core/errors"
	"Solutions/pvpSimulator/core/sim/app"
	"encoding/json"
	"fmt"
	"net/url"
	"strconv"
	"strings"
	"sync"
)

//ParsePvpRequest parses single PvP get request
func ParsePvpRequest(pok1, pok2 string) (app.InitialData, app.InitialData, error) {
	// create json response from struct
	attackerReq, err := url.PathUnescape(pok1)
	if err != nil {
		return app.InitialData{}, app.InitialData{}, errors.NewHTTPError(err, 400, "Error parsing attacker")
	}
	defenderReq, err := url.PathUnescape(pok2)
	if err != nil {
		return app.InitialData{}, app.InitialData{}, errors.NewHTTPError(err, 400, "Error parsing defender")
	}

	attackerData := make([]string, 0, 15)
	defenderData := make([]string, 0, 15)

	attackerData = strings.Split(attackerReq, "_")
	if len(attackerData) < 15 {
		return app.InitialData{}, app.InitialData{}, errors.NewHTTPError(nil, 400, "Attacker error: not enough intial data")
	}
	defenderData = strings.Split(defenderReq, "_")
	if len(defenderData) < 15 {
		return app.InitialData{}, app.InitialData{}, errors.NewHTTPError(nil, 400, "Defender error: not enough intial data")
	}

	attacker, err := parseSinglePok(attackerData)
	if err != nil {
		return app.InitialData{}, app.InitialData{}, err
	}
	defender, err := parseSinglePok(defenderData)
	if err != nil {
		return app.InitialData{}, app.InitialData{}, err
	}

	return attacker, defender, nil
}

func parseSinglePok(pokData []string) (app.InitialData, error) {
	isGreedy, err := strconv.ParseBool(pokData[10])
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid strategy value")
	}
	isShadow, err := strconv.ParseBool(pokData[11])
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid type value")
	}
	level, err := strconv.ParseFloat(pokData[1], 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid level value")
	}

	shields, err := strconv.ParseUint(pokData[0], 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid shields value")
	}

	attackIV, err := strconv.ParseUint(pokData[2], 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk IV value")
	}

	defenceIV, err := strconv.ParseUint(pokData[3], 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def IV value")
	}

	staminaIV, err := strconv.ParseUint(pokData[4], 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Sta IV value")
	}

	AtkStage, err := strconv.ParseInt(pokData[6], 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk Stage value")
	}

	DefStage, err := strconv.ParseInt(pokData[7], 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def Stage value")
	}

	InitialHP, err := strconv.ParseUint(pokData[8], 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital HP value")
	}

	InitialEnergy, err := strconv.ParseUint(pokData[9], 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital Energy value")
	}

	return app.InitialData{
		Name:      pokData[5],
		Level:     float32(level),
		Shields:   uint8(shields),
		AttackIV:  uint8(attackIV),
		DefenceIV: uint8(defenceIV),
		StaminaIV: uint8(staminaIV),

		InitialAttackStage:  int8(AtkStage),
		InitialDefenceStage: int8(DefStage),
		InitialHp:           int16(InitialHP),
		InitialEnergy:       app.Energy(InitialEnergy),

		IsGreedy: isGreedy,
		IsShadow: isShadow,

		QuickMove:  pokData[12],
		ChargeMove: []string{pokData[13], pokData[14]},
	}, nil
}

//matrix parser

type initialDataString struct {
	Name    string
	Query   string
	Lvl     string
	Atk     string
	Def     string
	Sta     string
	Shields string

	AtkStage      string
	DefStage      string
	InitialHP     string
	InitialEnergy string
	IsGreedy      string
	IsShadow      string

	QuickMove   string
	ChargeMove1 string
	ChargeMove2 string
}

type matrixSet struct {
	Party1 []initialDataString
	Party2 []initialDataString
}

//ParseMatrixRequest parses matrix pvp request
func ParseMatrixRequest(body []byte) ([]app.InitialData, []app.InitialData, error) {
	requstedInDat := matrixSet{}
	err := json.Unmarshal(body, &requstedInDat)
	if err != nil {
		return []app.InitialData{}, []app.InitialData{}, errors.NewHTTPError(err, 400, "Request format error")
	}
	if len(requstedInDat.Party1) <= 0 {
		return []app.InitialData{}, []app.InitialData{}, errors.NewHTTPError(nil, 400, "The first party is empty")
	}
	if len(requstedInDat.Party2) <= 0 {
		return []app.InitialData{}, []app.InitialData{}, errors.NewHTTPError(nil, 400, "The second party is empty")
	}
	var (
		wg     sync.WaitGroup
		partyA []app.InitialData
		partyB []app.InitialData
	)

	wg.Add(1)

	go func() {
		newParty, errI := parseParty(requstedInDat.Party1)
		if errI != nil {
			err = errI
		}
		partyA = newParty
		wg.Done()
	}()
	wg.Add(1)

	go func() {
		newParty, errI := parseParty(requstedInDat.Party2)
		if errI != nil {
			err = errI
		}
		partyB = newParty
		wg.Done()
	}()

	wg.Wait()
	if err != nil {
		return []app.InitialData{}, []app.InitialData{}, err
	}

	return partyA, partyB, nil
}

func parseParty(party []initialDataString) ([]app.InitialData, error) {
	parsedParty := make([]app.InitialData, 0, 10)
	for _, value := range party {
		partyEntry, err := parseSinglePokMatrix(value)
		if err != nil {
			return []app.InitialData{}, err
		}
		parsedParty = append(parsedParty, partyEntry)
	}
	return parsedParty, nil
}

func parseSinglePokMatrix(pokData initialDataString) (app.InitialData, error) {
	isGreedy, err := strconv.ParseBool(pokData.IsGreedy)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid strategy value of "+pokData.Name)
	}
	isShadow, err := strconv.ParseBool(pokData.IsShadow)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid type value of "+pokData.Name)
	}
	level, err := strconv.ParseFloat(pokData.Lvl, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid level value of "+pokData.Name)
	}

	shields, err := strconv.ParseUint(pokData.Shields, 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid shields value of "+pokData.Name)
	}

	attackIV, err := strconv.ParseUint(pokData.Atk, 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk IV value of "+pokData.Name)
	}

	defenceIV, err := strconv.ParseUint(pokData.Def, 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def IV value of "+pokData.Name)
	}

	staminaIV, err := strconv.ParseUint(pokData.Sta, 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Sta IV value of "+pokData.Name)
	}

	AtkStage, err := strconv.ParseInt(pokData.AtkStage, 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk Stage value of "+pokData.Name)
	}

	DefStage, err := strconv.ParseInt(pokData.DefStage, 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def Stage value of "+pokData.Name)
	}

	InitialHP, err := strconv.ParseUint(pokData.InitialHP, 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital HP value of "+pokData.Name)
	}

	InitialEnergy, err := strconv.ParseUint(pokData.InitialEnergy, 10, 64)
	if err != nil {
		return app.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital Energy value of "+pokData.Name)
	}

	return app.InitialData{
		Name:      pokData.Name,
		Query:     pokData.Query,
		Level:     float32(level),
		Shields:   uint8(shields),
		AttackIV:  uint8(attackIV),
		DefenceIV: uint8(defenceIV),
		StaminaIV: uint8(staminaIV),

		InitialAttackStage:  int8(AtkStage),
		InitialDefenceStage: int8(DefStage),
		InitialHp:           int16(InitialHP),
		InitialEnergy:       app.Energy(InitialEnergy),

		IsGreedy: isGreedy,
		IsShadow: isShadow,

		QuickMove:  pokData.QuickMove,
		ChargeMove: []string{pokData.ChargeMove1, pokData.ChargeMove2},
	}, nil
}

type constructorSet struct {
	Attacker    initialDataString
	Defender    initialDataString
	Constructor app.Constructor
}

//ParseConstructorRequest parses constructor request
func ParseConstructorRequest(body []byte) (app.InitialData, app.InitialData, app.Constructor, error) {
	requstedInDat := constructorSet{}
	err := json.Unmarshal(body, &requstedInDat)
	if err != nil {
		return app.InitialData{}, app.InitialData{}, app.Constructor{}, errors.NewHTTPError(err, 400, "Request format error")
	}

	Attacker, err := parseSinglePokMatrix(requstedInDat.Attacker)
	if err != nil {
		return app.InitialData{}, app.InitialData{}, app.Constructor{}, err
	}

	Defender, err := parseSinglePokMatrix(requstedInDat.Defender)
	if err != nil {
		return app.InitialData{}, app.InitialData{}, app.Constructor{}, err
	}

	return Attacker, Defender, requstedInDat.Constructor, nil
}

//ParseRaidRequest parses sommon PvE get request
func ParseRaidRequest(attacker, boss, obj string) (app.IntialDataPve, error) {

	attackerReq, err := url.PathUnescape(attacker)
	if err != nil {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Error parsing attacker")
	}
	bossReq, err := url.PathUnescape(boss)
	if err != nil {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Error parsing boss")
	}
	pveInDatObj, err := url.PathUnescape(obj)
	if err != nil {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Error parsing pve settings")
	}

	attackerData := make([]string, 0, 8)
	bossData := make([]string, 0, 4)
	objData := make([]string, 0, 5)

	attackerData = strings.Split(attackerReq, "_")
	if len(attackerData) != 8 {
		return app.IntialDataPve{}, errors.NewHTTPError(nil, 400, "Attacker error: not enough intial data")
	}
	bossData = strings.Split(bossReq, "_")
	if len(bossData) != 4 {
		return app.IntialDataPve{}, errors.NewHTTPError(nil, 400, "Boss error: not enough intial data")
	}
	objData = strings.Split(pveInDatObj, "_")
	if len(objData) != 6 {
		return app.IntialDataPve{}, errors.NewHTTPError(nil, 400, "PvE settings error: not enough intial data")
	}

	pveObj, err := parsePveInDatObj(objData)
	if err != nil {
		return app.IntialDataPve{}, err
	}
	pveObj.Pok, err = parsePveAttacker(attackerData)
	if err != nil {
		return app.IntialDataPve{}, err
	}
	pveObj.Boss, err = parsePveBoss(bossData)
	if err != nil {
		return app.IntialDataPve{}, err
	}

	return pveObj, nil
}

func parsePveInDatObj(pokData []string) (app.IntialDataPve, error) {
	friendStage, err := strconv.ParseInt(pokData[0], 10, 64)
	if err != nil {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Parsing: Invalid friendship level value")
	}
	if friendStage > 8 || friendStage < 0 {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Unknown friendship level")
	}

	weather, err := strconv.ParseInt(pokData[0], 10, 64)
	if err != nil {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Parsing: Invalid weather value")
	}
	if weather > 7 || weather < 0 {
		return app.IntialDataPve{}, fmt.Errorf("Unknown weather")
	}

	dodgeStrategy, err := strconv.ParseInt(pokData[0], 10, 64)
	if err != nil {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Parsing: Invalid dodge strategy value")
	}
	if dodgeStrategy > 4 || dodgeStrategy < 0 {
		return app.IntialDataPve{}, fmt.Errorf("Unknown dodge strategy")
	}

	partySize, err := strconv.ParseUint(pokData[4], 10, 64)
	if err != nil {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Parsing: Invalid party size value")
	}
	if partySize > 18 || partySize < 1 {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Party size must be in range 1-18")
	}

	playersNumber, err := strconv.ParseUint(pokData[5], 10, 64)
	if err != nil {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Parsing: Invalid players number value")
	}
	if playersNumber > 20 || playersNumber < 1 {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Players number must be in range 1-20")
	}

	isAgressive, err := strconv.ParseBool(pokData[7])
	if err != nil {
		return app.IntialDataPve{}, errors.NewHTTPError(err, 400, "Parsing: Invalid aggression value")
	}

	return app.IntialDataPve{
		FriendStage:   int(friendStage),
		Weather:       int(weather),
		DodgeStrategy: int(dodgeStrategy),

		AggresiveMode: isAgressive,

		PartySize:     uint8(partySize),
		PlayersNumber: uint8(playersNumber),
	}, nil
}

func parsePveAttacker(pokData []string) (app.PokemonInitialData, error) {
	level, err := strconv.ParseFloat(pokData[3], 64)
	if err != nil {
		return app.PokemonInitialData{}, errors.NewHTTPError(err, 400, "Invalid level value")
	}
	if level > 45 || level < 1 {
		return app.PokemonInitialData{}, errors.NewHTTPError(err, 400, "Level must be in range 1-45")
	}

	attackIV, err := strconv.ParseUint(pokData[4], 10, 64)
	if err != nil {
		return app.PokemonInitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk IV value")
	}
	if attackIV < 0 || attackIV > 15 {
		return app.PokemonInitialData{}, errors.NewHTTPError(err, 400, "Atk IV must be in range 0-15")
	}

	defenceIV, err := strconv.ParseUint(pokData[5], 10, 64)
	if err != nil {
		return app.PokemonInitialData{}, errors.NewHTTPError(err, 400, "Invalid Def IV value")
	}
	if defenceIV < 0 || defenceIV > 15 {
		return app.PokemonInitialData{}, errors.NewHTTPError(err, 400, "Def IV must be in range 0-15")
	}

	staminaIV, err := strconv.ParseUint(pokData[6], 10, 64)
	if err != nil {
		return app.PokemonInitialData{}, errors.NewHTTPError(err, 400, "Invalid Sta IV value")
	}
	if staminaIV < 0 || staminaIV > 15 {
		return app.PokemonInitialData{}, errors.NewHTTPError(err, 400, "Sta IV must be in range 0-15")
	}

	isShadow, err := strconv.ParseBool(pokData[7])
	if err != nil {
		return app.PokemonInitialData{}, errors.NewHTTPError(err, 400, "Parsing: Invalid pokemon type value")
	}

	return app.PokemonInitialData{
		Name:       pokData[0],
		QuickMove:  pokData[1],
		ChargeMove: pokData[2],

		Level:     float32(level),
		AttackIV:  uint8(attackIV),
		DefenceIV: uint8(defenceIV),
		StaminaIV: uint8(staminaIV),

		IsShadow: isShadow,
	}, nil
}

func parsePveBoss(bossData []string) (app.BossInfo, error) {
	tier, err := strconv.ParseUint(bossData[3], 10, 64)
	if err != nil {
		return app.BossInfo{}, errors.NewHTTPError(err, 400, "Parsing: Invalid raid tier value")
	}
	if tier > 5 || tier < 0 {
		return app.BossInfo{}, errors.NewHTTPError(err, 400, "Invalid raid tier")
	}

	return app.BossInfo{
		Name:       bossData[0],
		QuickMove:  bossData[1],
		ChargeMove: bossData[2],

		Tier: uint8(tier),
	}, nil
}
