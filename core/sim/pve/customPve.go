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
func ReturnCustomRaid(inDat *app.IntialDataPve) ([][]app.CommonResult, error) {
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
		resArray: [][]app.CommonResult{},
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
		return [][]app.CommonResult{}, &customError{
			errStr,
		}
	}

	return conObj.resArray, nil
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
	if co.inDat.BoostSlotEnabled {
		co.selectBoosterForCutomGroup()
	}

	fmt.Println(co.attackerGroups)
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

func (co *conStruct) startCustomFromGroups() error {
	var err error
	co.attackerGroups, err = selectAttackerFromGroup(co.inDat)
	if err != nil {
		return err
	}
	switch len(co.attackerGroups) {
	case 1:
	default:
		return &customError{"Not implemented"}
	}
	return nil
}