package parser

import (
	"Solutions/pvpSimulator/core/errors"
	sim "Solutions/pvpSimulator/core/sim"
	pvp "Solutions/pvpSimulator/core/sim/pvp"
	"encoding/json"
	"net/url"
	"strconv"
	"strings"
	"sync"
)

//ParsePvpRequest parses single PvP get request
func ParsePvpRequest(pok1, pok2 string) (sim.InitialData, sim.InitialData, error) {
	// create json response from struct
	attackerReq, err := url.PathUnescape(pok1)
	if err != nil {
		return sim.InitialData{}, sim.InitialData{}, errors.NewHTTPError(err, 400, "Error parsing attacker")
	}
	defenderReq, err := url.PathUnescape(pok2)
	if err != nil {
		return sim.InitialData{}, sim.InitialData{}, errors.NewHTTPError(err, 400, "Error parsing defender")
	}

	attackerData := make([]string, 0, 15)
	defenderData := make([]string, 0, 15)

	attackerData = strings.Split(attackerReq, "_")
	if len(attackerData) < 15 {
		return sim.InitialData{}, sim.InitialData{}, errors.NewHTTPError(nil, 400, "Attacker error: not enough intial data")
	}
	defenderData = strings.Split(defenderReq, "_")
	if len(defenderData) < 15 {
		return sim.InitialData{}, sim.InitialData{}, errors.NewHTTPError(nil, 400, "Defender error: not enough intial data")
	}

	attacker, err := parseSinglePok(attackerData)
	if err != nil {
		return sim.InitialData{}, sim.InitialData{}, err
	}
	defender, err := parseSinglePok(defenderData)
	if err != nil {
		return sim.InitialData{}, sim.InitialData{}, err
	}

	return attacker, defender, nil
}

func parseSinglePok(pokData []string) (sim.InitialData, error) {
	isGreedy, err := strconv.ParseBool(pokData[10])
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid strategy value")
	}
	isShadow, err := strconv.ParseBool(pokData[11])
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid type value")
	}
	level, err := strconv.ParseFloat(pokData[1], 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid level value")
	}

	shields, err := strconv.ParseUint(pokData[0], 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid shields value")
	}

	attackIV, err := strconv.ParseUint(pokData[2], 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk IV value")
	}

	defenceIV, err := strconv.ParseUint(pokData[3], 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def IV value")
	}

	staminaIV, err := strconv.ParseUint(pokData[4], 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Sta IV value")
	}

	AtkStage, err := strconv.ParseInt(pokData[6], 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk Stage value")
	}

	DefStage, err := strconv.ParseInt(pokData[7], 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def Stage value")
	}

	InitialHP, err := strconv.ParseUint(pokData[8], 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital HP value")
	}

	InitialEnergy, err := strconv.ParseUint(pokData[9], 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital Energy value")
	}

	return sim.InitialData{
		Name:      pokData[5],
		Level:     float32(level),
		Shields:   uint8(shields),
		AttackIV:  uint8(attackIV),
		DefenceIV: uint8(defenceIV),
		StaminaIV: uint8(staminaIV),

		InitialAttackStage:  int8(AtkStage),
		InitialDefenceStage: int8(DefStage),
		InitialHp:           int16(InitialHP),
		InitialEnergy:       pvp.Energy(InitialEnergy),

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
func ParseMatrixRequest(body []byte) ([]sim.InitialData, []sim.InitialData, error) {
	requstedInDat := matrixSet{}
	err := json.Unmarshal(body, &requstedInDat)
	if err != nil {
		return []sim.InitialData{}, []sim.InitialData{}, errors.NewHTTPError(err, 400, "Request format error")
	}
	if len(requstedInDat.Party1) <= 0 {
		return []sim.InitialData{}, []sim.InitialData{}, errors.NewHTTPError(nil, 400, "The first party is empty")
	}
	if len(requstedInDat.Party2) <= 0 {
		return []sim.InitialData{}, []sim.InitialData{}, errors.NewHTTPError(nil, 400, "The second party is empty")
	}
	var (
		wg     sync.WaitGroup
		partyA []sim.InitialData
		partyB []sim.InitialData
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
		return []sim.InitialData{}, []sim.InitialData{}, err
	}

	return partyA, partyB, nil
}

func parseParty(party []initialDataString) ([]sim.InitialData, error) {
	parsedParty := make([]sim.InitialData, 0, 10)
	for _, value := range party {
		partyEntry, err := parseSinglePokMatrix(value)
		if err != nil {
			return []sim.InitialData{}, err
		}
		parsedParty = append(parsedParty, partyEntry)
	}
	return parsedParty, nil
}

func parseSinglePokMatrix(pokData initialDataString) (sim.InitialData, error) {
	isGreedy, err := strconv.ParseBool(pokData.IsGreedy)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid strategy value of "+pokData.Name)
	}
	isShadow, err := strconv.ParseBool(pokData.IsShadow)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid type value of "+pokData.Name)
	}
	level, err := strconv.ParseFloat(pokData.Lvl, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid level value of "+pokData.Name)
	}

	shields, err := strconv.ParseUint(pokData.Shields, 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid shields value of "+pokData.Name)
	}

	attackIV, err := strconv.ParseUint(pokData.Atk, 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk IV value of "+pokData.Name)
	}

	defenceIV, err := strconv.ParseUint(pokData.Def, 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def IV value of "+pokData.Name)
	}

	staminaIV, err := strconv.ParseUint(pokData.Sta, 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Sta IV value of "+pokData.Name)
	}

	AtkStage, err := strconv.ParseInt(pokData.AtkStage, 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk Stage value of "+pokData.Name)
	}

	DefStage, err := strconv.ParseInt(pokData.DefStage, 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def Stage value of "+pokData.Name)
	}

	InitialHP, err := strconv.ParseUint(pokData.InitialHP, 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital HP value of "+pokData.Name)
	}

	InitialEnergy, err := strconv.ParseUint(pokData.InitialEnergy, 10, 64)
	if err != nil {
		return sim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital Energy value of "+pokData.Name)
	}

	return sim.InitialData{
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
		InitialEnergy:       pvp.Energy(InitialEnergy),

		IsGreedy: isGreedy,
		IsShadow: isShadow,

		QuickMove:  pokData.QuickMove,
		ChargeMove: []string{pokData.ChargeMove1, pokData.ChargeMove2},
	}, nil
}

type constructorSet struct {
	Attacker    initialDataString
	Defender    initialDataString
	Constructor sim.Constructor
}

//ParseConstructorRequest parses constructor request
func ParseConstructorRequest(body []byte) (sim.InitialData, sim.InitialData, sim.Constructor, error) {
	requstedInDat := constructorSet{}
	err := json.Unmarshal(body, &requstedInDat)
	if err != nil {
		return sim.InitialData{}, sim.InitialData{}, sim.Constructor{}, errors.NewHTTPError(err, 400, "Request format error")
	}

	Attacker, err := parseSinglePokMatrix(requstedInDat.Attacker)
	if err != nil {
		return sim.InitialData{}, sim.InitialData{}, sim.Constructor{}, err
	}

	Defender, err := parseSinglePokMatrix(requstedInDat.Defender)
	if err != nil {
		return sim.InitialData{}, sim.InitialData{}, sim.Constructor{}, err
	}

	return Attacker, Defender, requstedInDat.Constructor, nil
}
