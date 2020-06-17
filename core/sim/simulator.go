package sim

import (
	app "Solutions/pvpSimulator/core/sim/app"
	pve "Solutions/pvpSimulator/core/sim/pve"
	pvp "Solutions/pvpSimulator/core/sim/pvp"
	"fmt"
)

var Application *app.SimApp

func init() {
	Application = app.InitApp()
}

//InitApp reinits app
func InitApp() {
	Application = app.InitApp()
}

//Constructor  contains constructor initial data
type Constructor pvp.Constructor

//MatrixResult contains matrix pvp results
type MatrixResult pvp.MatrixResult

//InitialData contains single pokemon initial data
type InitialData pvp.InitialData

//ErrorChan a set of errors returned by matrix battle
type ErrorChan app.ErrorChan

//Energy is a representations of pokemon's energy
type Energy pvp.Energy

//PvpResults contains PvP results
type PvpResults pvp.PvpResults

//RatingResult contains rating PvP results
type RatingResult pvp.RatingResult

//SinglePvpInitialData contains single pvp initial data
type SinglePvpInitialData struct {
	AttackerData InitialData
	DefenderData InitialData
	Constr       Constructor
	Logging      bool
}

//Flush prints all errors got from matrix battle
func (eCh *ErrorChan) Flush() string {
	var errorString string
	for value := range *eCh {
		errorString += value.Error()
		errorString += ", "
	}
	return errorString
}

//NewPvpBetween takes initial data object and returns pvp results and error
func NewPvpBetween(inData SinglePvpInitialData) (PvpResults, error) {
	res, err := pvp.NewPvpBetween(pvp.SinglePvpInitialData{
		AttackerData: pvp.InitialData(inData.AttackerData),
		DefenderData: pvp.InitialData(inData.DefenderData),
		Constr:       pvp.Constructor(inData.Constr),
		Logging:      inData.Logging,
		App:          Application,
	})
	return PvpResults(res), err
}

//NewPvpBetweenPvpoke takes initial data object and returns pvp results calculted using pvpoke rusles and error
func NewPvpBetweenPvpoke(inData SinglePvpInitialData) (PvpResults, error) {
	res, err := pvp.NewPvpBetweenPvpoke(pvp.SinglePvpInitialData{
		AttackerData: pvp.InitialData(inData.AttackerData),
		DefenderData: pvp.InitialData(inData.DefenderData),
		Constr:       pvp.Constructor(inData.Constr),
		Logging:      inData.Logging,
		App:          Application,
	})
	return PvpResults(res), err
}

//RatingPvp takes initial data and returns pvp results and error
func RatingPvp(attackerData, defenderData InitialData) (RatingResult, error) {
	aData := pvp.InitialData(attackerData)
	dData := pvp.InitialData(defenderData)
	res, err := pvp.RatingPvp(&aData, &dData, Application)
	return RatingResult(res), err
}

//IntialDataPve contains data to start common raid
type IntialDataPve pve.IntialDataPve

//PokemonInitialData contains initial data for pvp
type PokemonInitialData pve.PokemonInitialData

//BossInfo contains boss initial data
type BossInfo pve.BossInfo

//CalculteCommonPve return common raid results as an array of format pokemon+moveset:boss:result
func CalculteCommonPve(data IntialDataPve) ([][]app.CommonResult, error) {
	res, err := pve.ReturnCommonRaid(pve.IntialDataPve(data))
	if err != nil {
		fmt.Println(err)
	}
	if err != nil {
		return [][]app.CommonResult{}, err
	}
	return res, nil
}
