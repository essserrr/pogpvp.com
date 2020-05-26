package parser

import (
	"Solutions/pvpSimulator/core/errors"
	pvpsim "Solutions/pvpSimulator/core/pvp"
	"encoding/json"
	"net/url"
	"strconv"
	"strings"
	"sync"
)

//ParsePvpRequest parses single PvP get request
func ParsePvpRequest(pok1, pok2 string) (pvpsim.InitialData, pvpsim.InitialData, error) {
	// create json response from struct
	attackerReq, err := url.PathUnescape(pok1)
	if err != nil {
		return pvpsim.InitialData{}, pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Error parsing attacker")
	}
	defenderReq, err := url.PathUnescape(pok2)
	if err != nil {
		return pvpsim.InitialData{}, pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Error parsing defender")
	}

	attackerData := make([]string, 0, 15)
	defenderData := make([]string, 0, 15)

	attackerData = strings.Split(attackerReq, "_")
	if len(attackerData) < 15 {
		return pvpsim.InitialData{}, pvpsim.InitialData{}, errors.NewHTTPError(nil, 400, "Attacker error: not enough intial data")
	}
	defenderData = strings.Split(defenderReq, "_")
	if len(defenderData) < 15 {
		return pvpsim.InitialData{}, pvpsim.InitialData{}, errors.NewHTTPError(nil, 400, "Defender error: not enough intial data")
	}

	attacker, err := parseSinglePok(attackerData)
	if err != nil {
		return pvpsim.InitialData{}, pvpsim.InitialData{}, err
	}
	defender, err := parseSinglePok(defenderData)
	if err != nil {
		return pvpsim.InitialData{}, pvpsim.InitialData{}, err
	}

	return attacker, defender, nil
}

func parseSinglePok(pokData []string) (pvpsim.InitialData, error) {
	isGreedy, err := strconv.ParseBool(pokData[10])
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid strategy value")
	}
	isShadow, err := strconv.ParseBool(pokData[11])
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid type value")
	}
	level, err := strconv.ParseFloat(pokData[1], 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid level value")
	}

	shields, err := strconv.ParseUint(pokData[5], 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid shields value")
	}

	attackIV, err := strconv.ParseUint(pokData[2], 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk IV value")
	}

	defenceIV, err := strconv.ParseUint(pokData[3], 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def IV value")
	}

	staminaIV, err := strconv.ParseUint(pokData[4], 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Sta IV value")
	}

	AtkStage, err := strconv.ParseInt(pokData[6], 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk Stage value")
	}

	DefStage, err := strconv.ParseInt(pokData[7], 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def Stage value")
	}

	InitialHP, err := strconv.ParseUint(pokData[8], 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital HP value")
	}

	InitialEnergy, err := strconv.ParseUint(pokData[9], 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital Energy value")
	}

	return pvpsim.InitialData{
		Name:      pokData[0],
		Level:     float32(level),
		Shields:   uint8(shields),
		AttackIV:  uint8(attackIV),
		DefenceIV: uint8(defenceIV),
		StaminaIV: uint8(staminaIV),

		InitialAttackStage:  int8(AtkStage),
		InitialDefenceStage: int8(DefStage),
		InitialHp:           int16(InitialHP),
		InitialEnergy:       pvpsim.Energy(InitialEnergy),

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
func ParseMatrixRequest(body []byte) ([]pvpsim.InitialData, []pvpsim.InitialData, error) {
	requstedInDat := matrixSet{}
	err := json.Unmarshal(body, &requstedInDat)
	if err != nil {
		return []pvpsim.InitialData{}, []pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Request format error")
	}
	if len(requstedInDat.Party1) <= 0 {
		return []pvpsim.InitialData{}, []pvpsim.InitialData{}, errors.NewHTTPError(nil, 400, "The first party is empty")
	}
	if len(requstedInDat.Party2) <= 0 {
		return []pvpsim.InitialData{}, []pvpsim.InitialData{}, errors.NewHTTPError(nil, 400, "The second party is empty")
	}
	var (
		wg     sync.WaitGroup
		partyA []pvpsim.InitialData
		partyB []pvpsim.InitialData
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
		return []pvpsim.InitialData{}, []pvpsim.InitialData{}, err
	}

	return partyA, partyB, nil
}

func parseParty(party []initialDataString) ([]pvpsim.InitialData, error) {
	parsedParty := make([]pvpsim.InitialData, 0, 10)
	for _, value := range party {
		partyEntry, err := parseSinglePokMatrix(value)
		if err != nil {
			return []pvpsim.InitialData{}, err
		}
		parsedParty = append(parsedParty, partyEntry)
	}
	return parsedParty, nil
}

func parseSinglePokMatrix(pokData initialDataString) (pvpsim.InitialData, error) {
	isGreedy, err := strconv.ParseBool(pokData.IsGreedy)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid strategy value of "+pokData.Name)
	}
	isShadow, err := strconv.ParseBool(pokData.IsShadow)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid type value of "+pokData.Name)
	}
	level, err := strconv.ParseFloat(pokData.Lvl, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid level value of "+pokData.Name)
	}

	shields, err := strconv.ParseUint(pokData.Shields, 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid shields value of "+pokData.Name)
	}

	attackIV, err := strconv.ParseUint(pokData.Atk, 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk IV value of "+pokData.Name)
	}

	defenceIV, err := strconv.ParseUint(pokData.Def, 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def IV value of "+pokData.Name)
	}

	staminaIV, err := strconv.ParseUint(pokData.Sta, 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Sta IV value of "+pokData.Name)
	}

	AtkStage, err := strconv.ParseInt(pokData.AtkStage, 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Atk Stage value of "+pokData.Name)
	}

	DefStage, err := strconv.ParseInt(pokData.DefStage, 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Def Stage value of "+pokData.Name)
	}

	InitialHP, err := strconv.ParseUint(pokData.InitialHP, 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital HP value of "+pokData.Name)
	}

	InitialEnergy, err := strconv.ParseUint(pokData.InitialEnergy, 10, 64)
	if err != nil {
		return pvpsim.InitialData{}, errors.NewHTTPError(err, 400, "Invalid Inital Energy value of "+pokData.Name)
	}

	return pvpsim.InitialData{
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
		InitialEnergy:       pvpsim.Energy(InitialEnergy),

		IsGreedy: isGreedy,
		IsShadow: isShadow,

		QuickMove:  pokData.QuickMove,
		ChargeMove: []string{pokData.ChargeMove1, pokData.ChargeMove2},
	}, nil
}

type constructorSet struct {
	Attacker    initialDataString
	Defender    initialDataString
	Constructor pvpsim.Constructor
}

//ParseConstructorRequest parses constructor request
func ParseConstructorRequest(body []byte) (pvpsim.InitialData, pvpsim.InitialData, pvpsim.Constructor, error) {
	requstedInDat := constructorSet{}
	err := json.Unmarshal(body, &requstedInDat)
	if err != nil {
		return pvpsim.InitialData{}, pvpsim.InitialData{}, pvpsim.Constructor{}, errors.NewHTTPError(err, 400, "Request format error")
	}

	Attacker, err := parseSinglePokMatrix(requstedInDat.Attacker)
	if err != nil {
		return pvpsim.InitialData{}, pvpsim.InitialData{}, pvpsim.Constructor{}, err
	}

	Defender, err := parseSinglePokMatrix(requstedInDat.Defender)
	if err != nil {
		return pvpsim.InitialData{}, pvpsim.InitialData{}, pvpsim.Constructor{}, err
	}

	return Attacker, Defender, requstedInDat.Constructor, nil
}
