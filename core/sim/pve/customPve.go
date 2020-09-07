package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"math/rand"
	"sort"
	"sync"
	"time"
)

//ReturnCustomRaid return common raid results as an array of format pokemon+moveset:boss:result
func ReturnCustomRaid(inDat *app.IntialDataPve) ([]PveResult, error) {
	if err := validateCustomData(inDat); err != nil {
		return nil, err
	}
	//otherwise make initial preparations
	rand.Seed(time.Now().UnixNano())
	inDat.SetCustomPveRuns()
	inDat.SetNumberOfPlayers()

	//make cancurrent object of this pve
	bossRow, err := generateBossRow(inDat)
	if err != nil {
		return nil, err
	}
	conObj := conStruct{
		bossRow: bossRow,

		inDat:    inDat,
		wg:       sync.WaitGroup{},
		count:    0,
		resArray: []PveResult{},
	}

	switch inDat.FindInCollection {
	case true:
		if err = conObj.collectionWrapper(); err != nil {
			return nil, err
		}
	default:
		if err = conObj.groupWrapper(); err != nil {
			return nil, err
		}
	}

	close(conObj.errChan)
	errStr := conObj.errChan.Flush()
	if errStr != "" {
		return []PveResult{}, &customError{
			errStr,
		}
	}

	sort.Sort(byAvgDamage(conObj.resArray))

	return conObj.resArray[:1], nil
}

//validateCustomData validates initial data and crops it down if necessary
func validateCustomData(inDat *app.IntialDataPve) error {
	//check boss name
	_, ok := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	if !ok {
		return &customError{"Unknown boss"}
	}
	switch inDat.FindInCollection {
	case true:
		if inDat.UserPokemon == nil || len(inDat.UserPokemon) == 0 {
			return &customError{"Your pokemon collection is empty"}
		}
	default:
		//check if any player exists
		if inDat.UserPlayers == nil || len(inDat.UserPlayers) == 0 {
			return &customError{"You haven't specified any players"}
		}
		//crop players if needed
		if len(inDat.UserPlayers) > 3 {
			inDat.UserPlayers = inDat.UserPlayers[:3]
		}
		//for every player
		for player, party := range inDat.UserPlayers {
			//check if a party is empty
			if party == nil || len(party) == 0 {
				return &customError{fmt.Sprintf("Player %v party is empty", player+1)}
			}
			//crop perty if it is somehow too long
			if len(party) > 18 {
				inDat.UserPlayers[player] = party[:18]
			}
		}
	}
	if inDat.PartySize > 18 {
		inDat.PartySize = 18
	}
	return nil
}

func (co *conStruct) collectionWrapper() error {
	var err error
	co.attackerRow, err = makeAttackerCustomPve(co.inDat, &co.bossRow)
	if err != nil {
		return err
	}
	co.boosterRow, err = makeBoostersRowCustomPve(co.inDat, &co.bossRow)
	if err != nil {
		return err
	}
	co.makeGroupsFromAttackers()
	combineBy := int(co.inDat.PartySize / 6)
	if combineBy == 0 {
		return &customError{"Party size is zero"}
	}
	if combineBy > 3 {
		return &customError{fmt.Sprintf("Well cool hacker, you want too many groups")}
	}
	switch len(co.attackerGroups) < combineBy {
	case true:
		co.attackerGroups = co.mergeGroups()
	default:
		co.attackerGroups = combineByAndMerge(co.attackerGroups, combineBy, make([][]preRun, 0, 1), 0)
	}
	co.startCustomPve(false)
	return nil
}

func (co *conStruct) makeGroupsFromAttackers() {
	co.attackerGroups = make([][]preRun, 0, 1)

	numberOfPartiesAllowed := 12
	party := make([]preRun, 0, 6)

	for _, value := range co.attackerRow {
		if numberOfPartiesAllowed == 0 {
			break
		}
		party = append(party, value)
		if len(party) >= 6 {
			co.attackerGroups = append(co.attackerGroups, party)
			party = make([]preRun, 0, 6)
			numberOfPartiesAllowed--
		}
	}
	if len(party) > 0 {
		co.attackerGroups = append(co.attackerGroups, party)
	}
}

func (co *conStruct) mergeGroups() [][]preRun {
	mergedGroups := make([]preRun, 0, 7)
	for _, group := range co.attackerGroups {
		mergedGroups = append(mergedGroups, group...)
	}
	return [][]preRun{mergedGroups}
}

// return n choose k combinations
func combineByAndMerge(arr [][]preRun, k int, prefix [][]preRun, i int) [][]preRun {
	// if the remainder of the array will complete the combination length exactly, combine it with the current prefix and add to results
	if len(prefix)+len(arr)-i == k {
		return [][]preRun{decostruct(append(prefix, arr[i:]...))}
		// if the prefix is long enough, add it to the results
	} else if len(prefix) == k {
		return [][]preRun{decostruct(prefix)}
		// otherwise, push combinations with and without
		// the current element
	} else {
		return append(combineByAndMerge(arr, k, append(prefix, arr[i]), i+1), combineByAndMerge(arr, k, prefix, i+1)...)
	}
}

func decostruct(party18 [][]preRun) []preRun {
	deconstructed := []preRun{}
	for _, party6 := range party18 {
		for _, pok := range party6 {
			deconstructed = append(deconstructed, pok)
		}
	}
	return deconstructed
}

type typeSort struct {
	count    int
	typeName int
}

func (ts *typeSort) increaseType(typeValue int) {
	ts.count++
	ts.typeName = typeValue
}

func (co *conStruct) countTypes(groupNumber int) []int {
	if co.boosterRow == nil || len(co.boosterRow) == 0 {
		return []int{}
	}
	//make type dictionary
	typePrevails := make([]typeSort, 18, 18)
	//count every pokemon move type
	for _, pok := range co.attackerGroups[groupNumber] {
		quickType := co.inDat.App.PokemonMovesBase[pok.Quick].MoveType
		typePrevails[quickType].increaseType(quickType)

		chargeType := co.inDat.App.PokemonMovesBase[pok.Charge].MoveType
		typePrevails[chargeType].increaseType(chargeType)
	}
	sort.SliceStable(typePrevails, func(i, j int) bool {
		return typePrevails[i].count > typePrevails[j].count
	})
	mostCommonType := []int{typePrevails[0].typeName}
	if typePrevails[1].count > 0 {
		mostCommonType = append(mostCommonType, typePrevails[1].typeName)
	}
	return mostCommonType
}

func (co *conStruct) selectCustomBooster(commonTypes []int) preRun {
	if co.boosterRow == nil || len(co.boosterRow) == 0 {
		return preRun{}
	}

	selectedBooster := preRun{}
	//select booster
	for _, booster := range co.boosterRow {
		//define matches of type
		matches := 0
		for _, boosterType := range co.inDat.App.PokemonStatsBase[booster.Name].Type {
			//for every common type
			for _, commoType := range commonTypes {
				if commoType == boosterType {
					matches++
				}
			}
		}
		//if both types of moves matched select and exit
		if matches == 2 {
			selectedBooster = booster
			break
		}
		//if 1 type matched continue search
		if matches == 1 {
			if selectedBooster.Name == "" {
				selectedBooster = booster
			}
		}
	}
	//if none selected, select the best dps option
	if selectedBooster.Name == "" {
		selectedBooster = co.boosterRow[0]
	}
	return selectedBooster
}

func (co *conStruct) startCustomPve(fromGroup bool) {
	co.resArray = make([]PveResult, 0, len(co.attackerGroups))
	co.errChan = make(app.ErrorChan, len(co.attackerGroups)*len(co.bossRow))

	for number := range co.attackerGroups {
		attackers, boosterInData := co.returnCustomPveInitialData(number, fromGroup)

		co.resArray = append(co.resArray, PveResult{
			Result: make([]app.VsBossResult, 0, len(co.bossRow)),
			Party:  co.attackerGroups[number],
		})

		for _, boss := range co.bossRow {
			//limit rountines number
			for co.count > 20000 {
				time.Sleep(10 * time.Microsecond)
			}
			co.wg.Add(1)
			co.Lock()
			co.count++
			co.Unlock()

			go func(currBoss app.BossInfo, i int) {
				defer co.wg.Done()
				singleResult, err := setOfRuns(pvpeInitialData{
					CustomMoves: co.inDat.CustomMoves, App: co.inDat.App,
					AttackerPokemon: attackers, BoostSlotPokemon: boosterInData, Boss: currBoss,
					PartySize: uint8(len(attackers)), PlayersNumber: co.inDat.PlayersNumber, NumberOfRuns: co.inDat.NumberOfRuns,
					FriendStage: co.inDat.FriendStage, Weather: co.inDat.Weather, DodgeStrategy: co.inDat.DodgeStrategy, AggresiveMode: co.inDat.AggresiveMode,
				})
				if err != nil {
					co.errChan <- err
					return
				}
				co.Lock()
				co.count--
				co.resArray[i].Result = append(co.resArray[i].Result, singleResult)
				co.Unlock()
			}(boss, number)
		}
	}
	co.wg.Wait()
}

//returnCustomPveInitialData returns initial data for simulator run AND modies group inside original array if mega pokemon was added to the group
func (co *conStruct) returnCustomPveInitialData(groupNumber int, fromGroup bool) ([]app.PokemonInitialData, app.PokemonInitialData) {
	//make attakers initial data array
	attackers := make([]app.PokemonInitialData, 0, len(co.attackerGroups[groupNumber]))

	selectedBooster := preRun{}
	switch fromGroup {
	case true:
		selectedBooster = co.selectFirstBoosterFromGroup(groupNumber)
	default:
		commonTypes := co.countTypes(groupNumber)
		selectedBooster = co.selectCustomBooster(commonTypes)
	}

	//if we selected a booster
	boosterInData := app.PokemonInitialData{}
	if selectedBooster.Name != "" {
		boosterInData = app.PokemonInitialData{Name: selectedBooster.Name, QuickMove: selectedBooster.Quick, ChargeMove: selectedBooster.Charge, Level: selectedBooster.Lvl,
			AttackIV: selectedBooster.Atk, DefenceIV: selectedBooster.Def, StaminaIV: selectedBooster.Sta, IsShadow: selectedBooster.IsShadow}
	}
	if selectedBooster.Name != "" && !fromGroup {
		attackers = append(attackers, boosterInData)
	}

	//append attackers
	for _, singlePok := range co.attackerGroups[groupNumber] {
		attackers = append(attackers, app.PokemonInitialData{
			Name: singlePok.Name, QuickMove: singlePok.Quick, ChargeMove: singlePok.Charge, Level: singlePok.Lvl,
			AttackIV: singlePok.Atk, DefenceIV: singlePok.Def, StaminaIV: singlePok.Sta, IsShadow: singlePok.IsShadow,
		})
	}

	//change original array if needed
	if selectedBooster.Name != "" && !fromGroup {
		endIndex := co.inDat.PartySize
		co.attackerGroups[groupNumber] = append([]preRun{selectedBooster}, co.attackerGroups[groupNumber]...)[:endIndex]
	}

	return attackers, boosterInData
}

func (co *conStruct) selectFirstBoosterFromGroup(groupNumber int) preRun {
	for _, singlePok := range co.attackerGroups[groupNumber] {
		if canBoost(singlePok.Name) {
			return singlePok
		}
	}
	return preRun{}
}

func (co *conStruct) groupWrapper() error {
	var err error
	co.attackerGroups, err = makeAttackersFromGroup(co.inDat, &co.bossRow)
	if err != nil {
		return err
	}
	switch len(co.attackerGroups) {
	case 1:
		co.startCustomPve(true)
	default:
		return &customError{"Not implemented"}
	}
	return nil
}
