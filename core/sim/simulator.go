package sim

import (
	app "Solutions/pvpSimulator/core/sim/app"
	pve "Solutions/pvpSimulator/core/sim/pve"
	pvp "Solutions/pvpSimulator/core/sim/pvp"
)

var Application *app.SimApp

func init() {
	Application = app.InitApp()
}

//InitApp reinits app
func InitApp() {
	Application = app.InitApp()
}

//NewPvpBetween takes initial data object and returns pvp results and error
func NewPvpBetween(inData app.SinglePvpInitialData) (app.PvpResults, error) {
	inData.App = Application
	res, err := pvp.NewPvpBetween(inData)
	return res, err
}

//NewPvpBetweenPvpoke takes initial data object and returns pvp results calculted using pvpoke rusles and error
func NewPvpBetweenPvpoke(inData app.SinglePvpInitialData) (app.PvpResults, error) {
	inData.App = Application
	res, err := pvp.NewPvpBetweenPvpoke(inData)
	return res, err
}

//RatingPvp takes initial data and returns pvp results and error
func RatingPvp(attackerData, defenderData app.InitialData) (app.RatingResult, error) {
	res, err := pvp.RatingPvp(&attackerData, &defenderData, Application)
	return res, err
}

//CalculteCommonPve return common raid results as an array of format pokemon+moveset:boss:result
func CalculteCommonPve(data app.IntialDataPve) ([]pve.PveResult, error) {
	data.App = Application
	return pve.ReturnCommonRaid(&data)
}

//CalculteSutomPve return custom raid results as an array of format pokemon+moveset:boss:result
func CalculteSustomPve(data app.IntialDataPve) ([]pve.PveResult, error) {
	data.App = Application
	return pve.ReturnCustomRaid(&data)
}
