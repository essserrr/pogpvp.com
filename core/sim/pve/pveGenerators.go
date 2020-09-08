package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"fmt"
	"sort"
	"strings"
)

type prerunObj struct {
	inDat *app.IntialDataPve

	prerunGroups [][]preRun
	prerunArr    []preRun
	bossStat     app.PokemonsBaseEntry
	bossLvl      float32
	bossEffDef   float32
}

type preRun struct {
	Name    string
	Quick   string
	Charge  string
	Charge2 string

	Dps         float32
	DamageDealt float32

	Lvl float32
	CP  uint32

	Atk uint8
	Def uint8
	Sta uint8

	IsShadow bool
}

type byDps []preRun

func (a byDps) Len() int           { return len(a) }
func (a byDps) Less(i, j int) bool { return a[i].Dps > a[j].Dps }
func (a byDps) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

type byDamage []preRun

func (a byDamage) Len() int           { return len(a) }
func (a byDamage) Less(i, j int) bool { return a[i].DamageDealt > a[j].DamageDealt }
func (a byDamage) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

//creates booster row for common pve
func makeBoostersRow(inDat *app.IntialDataPve, bosses *[]app.BossInfo) ([]preRun, error) {
	//if booster Slot is Disabled return empty prerun
	if !inDat.BoostSlotEnabled {
		return []preRun{}, nil
	}

	prerun := prerunObj{
		inDat:    inDat,
		bossStat: inDat.App.PokemonStatsBase[inDat.Boss.Name], bossLvl: tierMult[inDat.Boss.Tier],
		bossEffDef: (float32(15.0) + float32(inDat.App.PokemonStatsBase[inDat.Boss.Name].Def)) * tierMult[inDat.Boss.Tier],
		prerunArr:  make([]preRun, 0, 100),
	}

	_, ok := inDat.App.PokemonStatsBase[inDat.BoostSlotPokemon.Name]
	switch ok {
	case true:
		if err := prerun.generateForKnownBooster(&inDat.BoostSlotPokemon); err != nil {
			return nil, err
		}
	default:
		if err := prerun.generateForUnknownBooster(bosses); err != nil {
			return nil, err
		}
	}
	return prerun.prerunArr, nil
}

//checks if pokemon can boost
func canBoost(target string) bool {
	if strings.Index(target, "Mega ") != -1 {
		return true
	}
	if strings.Index(target, "Primal ") != -1 {
		return true
	}
	return false
}

//return boost bonus
func getBoostBonus(booster *app.PokemonsBaseEntry, targetType int) float32 {
	if booster == nil {
		return 1.0
	}
	if len(booster.Type) == 0 {
		return 1.0
	}
	for _, boosterType := range booster.Type {
		if boosterType == targetType {
			return megaBonusMultiplier
		}
	}
	return speedBoostMultiplier
}

//generateMovesets generates row of boosters if booster name is known
func (po *prerunObj) generateForKnownBooster(pok *app.PokemonInitialData) error {
	if err := po.selectBoosterFromGivenData(pok); err != nil {
		return err
	}
	sort.Sort(byDps(po.prerunArr))
	po.prerunArr = po.prerunArr[:1]
	return nil
}

//selectBoosterFromGivenData selects best moveset for given booster
func (po *prerunObj) selectBoosterFromGivenData(pokInDat *app.PokemonInitialData) error {
	//get pokemon from the base
	pokVal := po.inDat.App.PokemonStatsBase[pokInDat.Name]

	//get quick move(s)
	selectObj := moveSelect{inDat: po.inDat, move: pokInDat.QuickMove, movelist: pokVal.QuickMoves}
	quickMoveList := selectObj.selectMoves()
	if len(quickMoveList) == 0 {
		return &customError{pokInDat.Name + " quick movelist is empty; select a quick move"}
	}
	//get charge move(s)
	selectObj.move, selectObj.movelist = pokInDat.ChargeMove, pokVal.ChargeMoves
	chargeMoveList := selectObj.selectMoves()
	if len(chargeMoveList) == 0 {
		return &customError{pokInDat.Name + " charge movelist is empty; select a charge move"}
	}

	//make entry for every moveset
	po.prerunArr = make([]preRun, 0, 1)
	for _, qm := range quickMoveList {
		for _, chm := range chargeMoveList {
			//calculate attacker stats
			effAtk := (float32(po.inDat.BoostSlotPokemon.AttackIV) + float32(pokVal.Atk)) *
				po.inDat.App.LevelData[int(po.inDat.BoostSlotPokemon.Level/0.5)]
			quickMBody := po.inDat.App.PokemonMovesBase[qm]
			chargeMBody := po.inDat.App.PokemonMovesBase[chm]

			dpsQuick, dpsCharge := calculatePokDPS(&quickMBody, &chargeMBody,
				getMultipliers(&pokVal, &po.bossStat, &quickMBody, po.inDat), getMultipliers(&pokVal, &po.bossStat, &chargeMBody, po.inDat), effAtk/po.bossEffDef)

			po.prerunArr = append(po.prerunArr, preRun{Name: pokInDat.Name, Quick: qm, Charge: chm, Dps: dpsQuick + dpsCharge,
				Atk: po.inDat.BoostSlotPokemon.AttackIV, Def: po.inDat.BoostSlotPokemon.DefenceIV, Sta: po.inDat.BoostSlotPokemon.StaminaIV,
				Lvl: po.inDat.BoostSlotPokemon.Level, IsShadow: false})
		}
	}
	return nil
}

//returns damage multiplier
func getMultipliers(attacker, defender *app.PokemonsBaseEntry, move *app.MoveBaseEntry, inDat *app.IntialDataPve) float32 {
	moveEfficiency := inDat.App.TypesData[move.MoveType]

	var stabMultiplier float32 = 1.0
	for _, pokType := range attacker.Type {
		if pokType == move.MoveType {
			stabMultiplier = stabBonusMultiplier
			break
		}
	}

	var seMultiplier float32 = 1.0
	for _, trgType := range defender.Type {
		if moveEfficiency[trgType] != 0.0 {
			seMultiplier *= moveEfficiency[trgType]
		}
	}

	weatherMultiplier, ok := weather[inDat.Weather][move.MoveType]
	if !ok {
		weatherMultiplier = 1.0
	}

	return stabMultiplier * friendship[inDat.FriendStage] * seMultiplier * weatherMultiplier
}

//generates row of boosters if attacker booster is unknown
func (po *prerunObj) generateForUnknownBooster(bosses *[]app.BossInfo) error {
	po.selectBoosterFromDB()
	if err := po.makePrerun(bosses, 1, 5); err != nil {
		return err
	}
	sort.Sort(byDps(po.prerunArr))
	return nil
}

//makes prerun for every pokemon in prerun object and culculates dps and damge dealt for them
func (po *prerunObj) makePrerun(bosses *[]app.BossInfo, partySize uint8, numberOfRuns int) error {
	for boosterKey, booster := range po.prerunArr {
		var sumOfDmg int32
		var sumOfTime int32

		for _, currBoss := range *bosses {
			pokData := app.PokemonInitialData{
				Name: booster.Name, QuickMove: booster.Quick, ChargeMove: booster.Charge,
				Level: booster.Lvl, AttackIV: booster.Atk, DefenceIV: booster.Def, StaminaIV: booster.Sta,
				IsShadow: booster.IsShadow,
			}

			singleResult, err := setOfRuns(pvpeInitialData{
				CustomMoves: po.inDat.CustomMoves, App: po.inDat.App,

				AttackerPokemon: []app.PokemonInitialData{pokData}, BoostSlotPokemon: pokData,
				Boss: currBoss,

				NumberOfRuns: numberOfRuns, PartySize: partySize, PlayersNumber: po.inDat.PlayersNumber,
				FriendStage: po.inDat.FriendStage, Weather: po.inDat.Weather, DodgeStrategy: po.inDat.DodgeStrategy, AggresiveMode: po.inDat.AggresiveMode,
			})
			if err != nil {
				return err
			}
			sumOfDmg += singleResult.DAvg
			sumOfTime += singleResult.TAvg
		}
		damageDealt := float32(float64(sumOfDmg) / float64(len(*bosses)))
		avgTimeLeft := float64(sumOfTime) / float64(len(*bosses))
		avgTimeSpent := float64(tierTimer[po.inDat.Boss.Tier]) - avgTimeLeft

		po.prerunArr[boosterKey].Dps = damageDealt / float32(avgTimeSpent/1000.0)
		po.prerunArr[boosterKey].DamageDealt = damageDealt
	}
	return nil
}

//selects all pokemon that can boost from DB
func (po *prerunObj) selectBoosterFromDB() {
	for _, pok := range po.inDat.App.PokemonStatsBase {
		//skip pokemon that cannot boost attack
		if !canBoost(pok.Title) {
			continue
		}
		//define the best booster's moveset
		prerunObj := preRun{}
		for _, qm := range pok.QuickMoves {
			//skip empty moves
			if qm == "" {
				continue
			}
			for _, chm := range pok.ChargeMoves {
				//skip empty moves
				if chm == "" {
					continue
				}
				//calculate attacker stats
				effAtk := (float32(po.inDat.BoostSlotPokemon.AttackIV) + float32(pok.Atk)) *
					po.inDat.App.LevelData[int(po.inDat.BoostSlotPokemon.Level/0.5)]
				quickMBody := po.inDat.App.PokemonMovesBase[qm]
				chargeMBody := po.inDat.App.PokemonMovesBase[chm]

				dpsQuick, dpsCharge := calculatePokDPS(&quickMBody, &chargeMBody,
					getMultipliers(&pok, &po.bossStat, &quickMBody, po.inDat), getMultipliers(&pok, &po.bossStat, &chargeMBody, po.inDat), effAtk/po.bossEffDef)

				if prerunObj.Dps < dpsCharge+dpsQuick {
					prerunObj.Name, prerunObj.Quick, prerunObj.Charge = pok.Title, qm, chm
					prerunObj.Dps, prerunObj.Lvl, prerunObj.IsShadow = dpsCharge+dpsQuick, po.inDat.BoostSlotPokemon.Level, false
					prerunObj.Atk, prerunObj.Def, prerunObj.Sta = po.inDat.BoostSlotPokemon.AttackIV, po.inDat.BoostSlotPokemon.DefenceIV, po.inDat.BoostSlotPokemon.StaminaIV
				}
			}
		}
		//if we found the best move append it
		if prerunObj.Dps != 0 {
			po.prerunArr = append(po.prerunArr, prerunObj)
		}
	}
}

func makeAttackerRow(inDat *app.IntialDataPve) ([]preRun, error) {
	prerun := prerunObj{
		inDat:      inDat,
		bossStat:   inDat.App.PokemonStatsBase[inDat.Boss.Name],
		bossLvl:    tierMult[inDat.Boss.Tier],
		bossEffDef: (float32(15.0) + float32(inDat.App.PokemonStatsBase[inDat.Boss.Name].Def)) * tierMult[inDat.Boss.Tier],
	}

	_, ok := inDat.App.PokemonStatsBase[inDat.Pok.Name]
	switch ok {
	case true:
		if err := prerun.generateForKnown(&inDat.Pok); err != nil {
			return nil, err
		}
	default:
		prerun.generateForUnknown()
	}
	return prerun.prerunArr, nil
}

type moveSelect struct {
	inDat    *app.IntialDataPve
	move     string
	movelist []string

	movesToSkip filterList
	eliteMoves  filterList
}

type filterList map[string]int

func (ms *moveSelect) selectMoves() []string {
	moveVal, ok := ms.inDat.App.FindMove(ms.inDat.CustomMoves, ms.move)
	moves := make([]string, 0, 1)
	switch ok {
	case true:
		//if it is found append it to quick move list
		moves = append(moves, moveVal.Title)
	default:
		//otherwise add all quick moves
		for _, ms.move = range ms.movelist {
			if ms.skipMove() {
				continue
			}
			moves = append(moves, ms.move)
		}
	}
	return moves
}

func (ms *moveSelect) skipMove() bool {
	if ms.movesToSkip.isBlacklisted(ms.move) {
		return true
	}
	if ms.eliteMoves.isBlacklisted(ms.move) {
		return true
	}
	return false
}

func (fs *filterList) isBlacklisted(target string) bool {
	if *fs == nil {
		return false
	}
	_, ok := (*fs)[target]
	return ok
}

//generateMovesets generates row of attacker movesets if attacker name is known
func (po *prerunObj) generateForKnown(pok *app.PokemonInitialData) error {
	//get pokemon from the base
	pokVal := po.inDat.App.PokemonStatsBase[pok.Name]

	//get quick move(s)
	selectObj := moveSelect{inDat: po.inDat, move: pok.QuickMove, movelist: pokVal.QuickMoves}
	quickMoveList := selectObj.selectMoves()
	if len(quickMoveList) == 0 {
		return &customError{pok.Name + " quick movelist is empty; select a quick move"}
	}
	//get charge move(s)
	selectObj.move, selectObj.movelist = pok.ChargeMove, pokVal.ChargeMoves
	chargeMoveList := selectObj.selectMoves()
	if len(chargeMoveList) == 0 {
		return &customError{pok.Name + " charge movelist is empty; select a charge move"}
	}

	//make entry for every moveset
	po.prerunArr = make([]preRun, 0, 1)
	for _, valueQ := range quickMoveList {
		for _, valueCH := range chargeMoveList {
			po.prerunArr = append(po.prerunArr, preRun{Name: pok.Name, Quick: valueQ, Charge: valueCH,
				Atk: po.inDat.Pok.AttackIV, Def: po.inDat.Pok.DefenceIV, Sta: po.inDat.Pok.StaminaIV,
				Lvl: po.inDat.Pok.Level, IsShadow: po.inDat.Pok.IsShadow})
		}
	}
	return nil
}

func (po *prerunObj) generateForUnknown() {
	po.prerunArr = make([]preRun, 0, 10000)
	for _, pok := range po.inDat.App.PokemonStatsBase {
		//skip trash pokemons
		if (pok.Atk+pok.Def+pok.Sta) < 400 || canBoost(pok.Title) {
			continue
		}
		for _, qm := range pok.QuickMoves {
			//skip empty moves
			if qm == "" {
				continue
			}
			for _, chm := range pok.ChargeMoves {
				//skip empty moves
				if chm == "" {
					continue
				}
				//calculate attacker stats
				effAtk := (float32(po.inDat.Pok.AttackIV) + float32(pok.Atk)) * po.inDat.App.LevelData[int(po.inDat.Pok.Level/0.5)]
				quickMBody := po.inDat.App.PokemonMovesBase[qm]
				chargeMBody := po.inDat.App.PokemonMovesBase[chm]

				dpsQuick, dpsCharge := calculatePokDPS(&quickMBody, &chargeMBody,
					getMultipliers(&pok, &po.bossStat, &quickMBody, po.inDat), getMultipliers(&pok, &po.bossStat, &chargeMBody, po.inDat), effAtk/po.bossEffDef)

				po.prerunArr = append(po.prerunArr, preRun{
					Name: pok.Title, Quick: qm, Charge: chm, Dps: dpsCharge + dpsQuick,
					Atk: po.inDat.Pok.AttackIV, Def: po.inDat.Pok.DefenceIV, Sta: po.inDat.Pok.StaminaIV,
					Lvl: po.inDat.Pok.Level, IsShadow: false})

				if po.inDat.Pok.IsShadow && canBeShadow(&pok) {
					effAtk *= shadowBonusAttack
					dpsQuick, dpsCharge := calculatePokDPS(&quickMBody, &chargeMBody,
						getMultipliers(&pok, &po.bossStat, &quickMBody, po.inDat), getMultipliers(&pok, &po.bossStat, &chargeMBody, po.inDat), effAtk/po.bossEffDef)

					po.prerunArr = append(po.prerunArr, preRun{
						Name: pok.Title, Quick: qm, Charge: chm, Dps: dpsCharge + dpsQuick,
						Atk: po.inDat.Pok.AttackIV, Def: po.inDat.Pok.DefenceIV, Sta: po.inDat.Pok.StaminaIV,
						Lvl: po.inDat.Pok.Level, IsShadow: true})
				}
			}
		}
	}
	sort.Sort(byDps(po.prerunArr))
	po.prerunArr = po.prerunArr[:900]
}

func calculatePokDPS(quickMBody, chargeMBody *app.MoveBaseEntry, multQuick, multCharge, atkDefRatio float32) (float32, float32) {
	damageCharge := (float32(chargeMBody.Damage)*0.5*(atkDefRatio)*multCharge + 1)
	//dps*dpe
	dpsCharge := damageCharge / (float32(chargeMBody.Cooldown) / 1000.0) * damageCharge / float32(-chargeMBody.Energy)
	//dps
	dpsQuick := (float32(quickMBody.Damage)*0.5*(atkDefRatio)*multQuick + 1) / (float32(quickMBody.Cooldown) / 1000.0)
	return dpsQuick, dpsCharge
}

func canBeShadow(pok *app.PokemonsBaseEntry) bool {
	for _, value := range pok.ChargeMoves {
		if value == "Return" {
			return true
		}
	}
	return false
}

func generateBossRow(inDat *app.IntialDataPve) ([]app.BossInfo, error) {
	pokVal, _ := inDat.App.PokemonStatsBase[inDat.Boss.Name]
	if len(pokVal.QuickMoves) == 0 && inDat.Boss.QuickMove == "" {
		return []app.BossInfo{}, &customError{"Boss quick movelist is empty; select a quick move"}
	}
	if len(pokVal.ChargeMoves) == 0 && inDat.Boss.ChargeMove == "" {
		return []app.BossInfo{}, &customError{"Boss charge movelist is empty; select a charge move"}
	}

	//get quick move(s)
	selectObj := moveSelect{inDat: inDat, move: inDat.Boss.QuickMove, movelist: pokVal.QuickMoves, eliteMoves: pokVal.EliteMoves}
	quickMoveList := selectObj.selectMoves()
	//get charge move(s)
	selectObj.move, selectObj.movelist, selectObj.movesToSkip = inDat.Boss.ChargeMove, pokVal.ChargeMoves, map[string]int{"Return": 1}
	chargeMoveList := selectObj.selectMoves()

	var (
		maxMoves = 10
		err      error
	)
	if len(quickMoveList) > maxMoves && len(chargeMoveList) > maxMoves {
		maxMoves = 7
	}

	//limit movelist if needed
	if len(quickMoveList) > maxMoves {
		limiterObj := limiterObject{pok: pokVal, orginalMoveList: quickMoveList, inDat: inDat, isCharge: false, n: maxMoves}
		quickMoveList, err = limiterObj.limitMoves()
		if err != nil {
			return nil, err
		}
	}

	//limit if needed
	if len(chargeMoveList) > maxMoves {
		limiterObj := limiterObject{pok: pokVal, orginalMoveList: chargeMoveList, inDat: inDat, isCharge: true, n: maxMoves}
		chargeMoveList, err = limiterObj.limitMoves()
		if err != nil {
			return []app.BossInfo{}, err
		}
	}

	//create boss list
	bosses := make([]app.BossInfo, 0, 1)
	for _, valueQ := range quickMoveList {
		for _, valueCH := range chargeMoveList {
			bosses = append(bosses,
				app.BossInfo{
					Name:       pokVal.Title,
					QuickMove:  valueQ,
					ChargeMove: valueCH,
					Tier:       inDat.Boss.Tier,
				})
		}
	}
	return bosses, nil
}

type limiterObject struct {
	inDat *app.IntialDataPve

	pok             app.PokemonsBaseEntry
	orginalMoveList []string

	limiter     []moveLimiter
	hiddenPower []moveLimiter
	newList     []string

	move currentMove

	n        int
	isCharge bool
}

type currentMove struct {
	moveBody      app.MoveBaseEntry
	stab          float64
	weather       float64
	dps           float64
	isHiddenPower bool
}

type moveLimiter struct {
	MoveName string
	Dps      float64
}

type byDpsMoves []moveLimiter

func (a byDpsMoves) Len() int           { return len(a) }
func (a byDpsMoves) Less(i, j int) bool { return a[i].Dps > a[j].Dps }
func (a byDpsMoves) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

//limitMoves limits boss moves to n
func (lo *limiterObject) limitMoves() ([]string, error) {
	lo.limiter = make([]moveLimiter, 0, len(lo.orginalMoveList))
	lo.hiddenPower = make([]moveLimiter, 0, 0)

	//calculate dps / pds*dpe for every move
	for _, moveTitle := range lo.orginalMoveList {
		lo.move.moveBody, _ = lo.inDat.App.FindMove(lo.inDat.CustomMoves, moveTitle)
		lo.move.stab = lo.checkStab()
		lo.move.weather = lo.checkWeather()

		if err := lo.calculateDPS(); err != nil {
			return nil, err
		}
		lo.appendMove()
	}

	lo.combineLists()
	//create new movelist
	newList := make([]string, 0, lo.n)
	for _, mName := range lo.limiter {
		newList = append(newList, mName.MoveName)
	}
	return newList, nil
}

func (lo *limiterObject) checkStab() float64 {
	for _, pokType := range lo.pok.Type {
		if pokType == lo.move.moveBody.MoveType {
			return stabBonusMultiplier
		}
	}
	return 1.0
}

func (lo *limiterObject) checkWeather() float64 {
	val, ok := weather[lo.inDat.Weather][lo.move.moveBody.MoveType]
	if ok {
		return float64(val)
	}
	return 1.0
}

func (lo *limiterObject) calculateDPS() error {
	switch lo.isCharge {
	case true:
		//if it is charge move rturn dps
		damage := float64(lo.move.moveBody.Damage) * lo.move.weather * lo.move.stab
		lo.move.dps = damage / (float64(lo.move.moveBody.Cooldown) / 1000) * damage / float64(-lo.move.moveBody.Energy)
		lo.move.isHiddenPower = false
	default:
		lo.move.dps = float64(lo.move.moveBody.Damage) * lo.move.weather * lo.move.stab / (float64(lo.move.moveBody.Cooldown) / 1000)
		lo.move.dps *= lo.move.dps

		index := strings.Index(lo.move.moveBody.Title, "Hidden Power")
		lo.move.isHiddenPower = index != -1
	}
	if lo.move.dps == 0.0 {
		return &customError{"Boss has zero dps"}
	}
	return nil
}

func (lo *limiterObject) appendMove() {
	switch lo.move.isHiddenPower {
	case true:
		lo.hiddenPower = append(lo.hiddenPower, moveLimiter{
			MoveName: lo.move.moveBody.Title,
			Dps:      lo.move.dps,
		})
	default:
		lo.limiter = append(lo.limiter, moveLimiter{
			MoveName: lo.move.moveBody.Title,
			Dps:      lo.move.dps,
		})
	}
}

func (lo *limiterObject) combineLists() {
	switch len(lo.hiddenPower) > 0 {
	case true:
		//sort by dps
		sort.Sort(byDpsMoves(lo.limiter))
		sort.Sort(byDpsMoves(lo.hiddenPower))
		//get top-6 if possible
		switch len(lo.limiter) >= 6 {
		case true:
			lo.limiter = lo.limiter[:6]
		default:
		}
		//add top-4 hidden powers
		for i := 0; len(lo.limiter) < lo.n; i++ {
			lo.limiter = append(lo.limiter, lo.hiddenPower[i])
		}
	default:
		//sort by dps
		sort.Sort(byDpsMoves(lo.limiter))
		//get top-10
		lo.limiter = lo.limiter[:lo.n]
	}
}

func makeAttackerCustomPve(inDat *app.IntialDataPve, bosses *[]app.BossInfo) ([]preRun, error) {
	prerun := prerunObj{
		inDat:      inDat,
		bossStat:   inDat.App.PokemonStatsBase[inDat.Boss.Name],
		prerunArr:  make([]preRun, 0, 1500),
		bossLvl:    tierMult[inDat.Boss.Tier],
		bossEffDef: (float32(15.0) + float32(inDat.App.PokemonStatsBase[inDat.Boss.Name].Def)) * tierMult[inDat.Boss.Tier],
	}
	prerun.selectPokemonFromCollection(false)
	if len(prerun.prerunArr) == 0 {
		return nil, &customError{"Your collection is empty"}
	}

	if err := prerun.makePrerun(bosses, inDat.PartySize, 1); err != nil {
		return nil, err
	}

	switch inDat.SortByDamage {
	case true:
		sort.Sort(byDamage(prerun.prerunArr))
	default:
		sort.Sort(byDps(prerun.prerunArr))
	}

	if len(prerun.prerunArr) > 72 {
		prerun.prerunArr = prerun.prerunArr[:72]
	}

	return prerun.prerunArr, nil
}

func makeBoostersRowCustomPve(inDat *app.IntialDataPve, bosses *[]app.BossInfo) ([]preRun, error) {
	//if booster Slot is Disabled return empty prerun
	if !inDat.BoostSlotEnabled {
		return []preRun{}, nil
	}
	prerun := prerunObj{
		inDat:      inDat,
		prerunArr:  make([]preRun, 0, 10),
		bossStat:   inDat.App.PokemonStatsBase[inDat.Boss.Name],
		bossLvl:    tierMult[inDat.Boss.Tier],
		bossEffDef: (float32(15.0) + float32(inDat.App.PokemonStatsBase[inDat.Boss.Name].Def)) * tierMult[inDat.Boss.Tier],
	}
	prerun.selectPokemonFromCollection(true)

	if err := prerun.makePrerun(bosses, 1, 1); err != nil {
		return nil, err
	}

	switch inDat.SortByDamage {
	case true:
		sort.Sort(byDamage(prerun.prerunArr))
	default:
		sort.Sort(byDps(prerun.prerunArr))
	}

	return prerun.prerunArr, nil
}

func (po *prerunObj) selectPokemonFromCollection(canBeMega bool) {
	for _, pokInDat := range po.inDat.UserPokemon {
		pokemon, ok := po.inDat.App.PokemonStatsBase[pokInDat.Name]
		if !ok {
			continue
		}
		//skip or not skip megas
		if !canBeMega && canBoost(pokInDat.Name) {
			continue
		}
		if canBeMega && !canBoost(pokInDat.Name) {
			continue
		}
		//find quick move
		_, ok = po.inDat.App.FindMove(po.inDat.CustomMoves, pokInDat.QuickMove)
		if !ok {
			continue
		}

		//find charge move
		_, ok = po.inDat.App.FindMove(po.inDat.CustomMoves, pokInDat.ChargeMove)
		if !ok {
			//if first charge move not found, try to find the second
			_, ok = po.inDat.App.FindMove(po.inDat.CustomMoves, pokInDat.ChargeMove2)
			if !ok {
				continue
			}
			//swap moves
			pokInDat.ChargeMove2, pokInDat.ChargeMove = pokInDat.ChargeMove, pokInDat.ChargeMove2
		}

		preRunPok := preRun{Name: pokInDat.Name, Quick: pokInDat.QuickMove, Charge: pokInDat.ChargeMove, Charge2: pokInDat.ChargeMove2,
			Lvl: pokInDat.Lvl, Atk: pokInDat.Atk, Def: pokInDat.Def, Sta: pokInDat.Sta, IsShadow: pokInDat.IsShadow == "true"}
		preRunPok.selectChargeMove(po, &pokemon)

		po.prerunArr = append(po.prerunArr, preRunPok)
	}
}

func (pr *preRun) selectChargeMove(prerunObj *prerunObj, pok *app.PokemonsBaseEntry) {
	//define shadow bonus
	var shadowBonus float32 = 1.0
	if pr.IsShadow {
		shadowBonus = shadowBonusAttack
	}

	//calculate attacker stats
	effAtk := (float32(pr.Atk) + float32(pok.Atk)) * shadowBonus * prerunObj.inDat.App.LevelData[int(pr.Lvl/0.5)]
	//boss eff def

	dpsCharge1 := calculateChargeDps(prerunObj, pok, pr.Charge, effAtk/prerunObj.bossEffDef)
	dpsCharge2 := calculateChargeDps(prerunObj, pok, pr.Charge2, effAtk/prerunObj.bossEffDef)

	if dpsCharge2 > dpsCharge1 {
		pr.Charge, pr.Charge2 = pr.Charge2, pr.Charge
	}
}

func calculateChargeDps(prerunObj *prerunObj, pok *app.PokemonsBaseEntry, moveName string, atkDefRatio float32) float32 {
	chargeMBody, ok := prerunObj.inDat.App.PokemonMovesBase[moveName]
	if ok {
		damageCharge1 := (float32(chargeMBody.Damage)*0.5*(atkDefRatio)*getMultipliers(pok, &prerunObj.bossStat, &chargeMBody, prerunObj.inDat) + 1)
		//dps*dpe
		return damageCharge1 / (float32(chargeMBody.Cooldown) / 1000.0) * damageCharge1 / float32(-chargeMBody.Energy)
	}
	return 0
}

func makeAttackersFromGroup(inDat *app.IntialDataPve, bosses *[]app.BossInfo) ([][]preRun, error) {
	prerun := prerunObj{
		inDat:        inDat,
		prerunGroups: make([][]preRun, 0, len(inDat.UserPlayers)),
		bossStat:     inDat.App.PokemonStatsBase[inDat.Boss.Name],
		bossLvl:      tierMult[inDat.Boss.Tier],
		bossEffDef:   (float32(15.0) + float32(inDat.App.PokemonStatsBase[inDat.Boss.Name].Def)) * tierMult[inDat.Boss.Tier],
	}
	if err := prerun.selectAttackerFromGroup(); err != nil {
		return nil, err
	}

	if err := prerun.makePrerun(bosses, 1, 1); err != nil {
		return nil, err
	}

	return prerun.prerunGroups, nil
}

func (po *prerunObj) selectAttackerFromGroup() error {
	for playerNumber, playerGroup := range po.inDat.UserPlayers {
		group := make([]preRun, 0, len(playerGroup))

		for _, pokInDat := range playerGroup {
			pokemon, ok := po.inDat.App.PokemonStatsBase[pokInDat.Name]
			if !ok {
				return &customError{fmt.Sprintf("Player %v party has unknow pokemon %v", playerNumber+1, pokInDat.Name)}
			}
			//find quick move
			_, ok = po.inDat.App.FindMove(po.inDat.CustomMoves, pokInDat.QuickMove)
			if !ok {
				return &customError{fmt.Sprintf("Player %v party pokemon %v has unknow quick move %v", playerNumber+1, pokInDat.Name, pokInDat.QuickMove)}
			}

			//find charge move
			_, ok = po.inDat.App.FindMove(po.inDat.CustomMoves, pokInDat.ChargeMove)
			if !ok {
				//if first charge move not found, try to find the second
				_, ok = po.inDat.App.FindMove(po.inDat.CustomMoves, pokInDat.ChargeMove2)
				if !ok {
					return &customError{fmt.Sprintf("Player %v party pokemon %v has unknow charge moves %v and %v", playerNumber+1, pokInDat.Name, pokInDat.ChargeMove, pokInDat.ChargeMove2)}
				}
				pokInDat.ChargeMove2, pokInDat.ChargeMove = pokInDat.ChargeMove, pokInDat.ChargeMove2
			}

			preRunPok := preRun{Name: pokInDat.Name, Quick: pokInDat.QuickMove, Charge: pokInDat.ChargeMove, Charge2: pokInDat.ChargeMove2,
				Lvl: pokInDat.Lvl, Atk: pokInDat.Atk, Def: pokInDat.Def, Sta: pokInDat.Sta, IsShadow: pokInDat.IsShadow == "true"}
			preRunPok.selectChargeMove(po, &pokemon)

			group = append(group, preRunPok)
		}
		po.prerunGroups = append(po.prerunGroups, group)
	}
	return nil
}
