package pve

import (
	app "Solutions/pvpSimulator/core/sim/app"
	"sort"
	"strings"
)

type prerunObj struct {
	inDat *app.IntialDataPve

	prerunArr  []preRun
	bossStat   app.PokemonsBaseEntry
	bossLvl    float32
	bossEffDef float32
}

type preRun struct {
	Name   string
	Quick  string
	Charge string

	Dps float32
}

type byDps []preRun

func (a byDps) Len() int           { return len(a) }
func (a byDps) Less(i, j int) bool { return a[i].Dps > a[j].Dps }
func (a byDps) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

func makeBoostersRow(inDat *app.IntialDataPve) ([]preRun, error) {
	//if booster Slot is Disabled return empty prerun
	if !inDat.BoostSlotEnabled {
		return []preRun{}, nil
	}

	prerun := prerunObj{
		inDat:      inDat,
		prerunArr:  make([]preRun, 0, 100),
		bossStat:   inDat.App.PokemonStatsBase[inDat.Boss.Name],
		bossLvl:    tierMult[inDat.Boss.Tier],
		bossEffDef: (float32(15.0) + float32(inDat.App.PokemonStatsBase[inDat.Boss.Name].Def)) * tierMult[inDat.Boss.Tier],
	}

	_, ok := inDat.App.PokemonStatsBase[inDat.BoostSlotPokemon.Name]
	switch ok {
	case true:
		if err := prerun.generateForKnownBooster(&inDat.BoostSlotPokemon); err != nil {
			return nil, err
		}
	default:
		prerun.generateForUnknownBooster()
	}
	return prerun.prerunArr, nil
}

func canBoost(target string) bool {
	if strings.Index(target, "Mega ") != -1 {
		return true
	}
	if strings.Index(target, "Primal ") != -1 {
		return true
	}
	return false
}

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

//generateMovesets generates row of attacker movesets if attacker name is known
func (po *prerunObj) generateForKnownBooster(pok *app.PokemonInitialData) error {
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
	for _, qm := range quickMoveList {
		for _, chm := range chargeMoveList {
			//calculate attacker stats
			effAtk := (float32(po.inDat.BoostSlotPokemon.AttackIV) + float32(pokVal.Atk)) *
				po.inDat.App.LevelData[int(po.inDat.BoostSlotPokemon.Level/0.5)]
			quickMBody := po.inDat.App.PokemonMovesBase[qm]
			chargeMBody := po.inDat.App.PokemonMovesBase[chm]

			damageCharge := (float32(chargeMBody.Damage)*0.5*(effAtk/po.bossEffDef)*getBoostBonus(&pokVal, chargeMBody.MoveType)*
				getMultipliers(&pokVal, &po.bossStat, &chargeMBody, po.inDat) + 1)
			//dps*dpe
			dpsCharge := damageCharge / (float32(chargeMBody.Cooldown) / 1000.0) * damageCharge / float32(-chargeMBody.Energy)

			damageQuick := (float32(quickMBody.Damage)*0.5*(effAtk/po.bossEffDef)*getBoostBonus(&pokVal, quickMBody.MoveType)*
				getMultipliers(&pokVal, &po.bossStat, &quickMBody, po.inDat) + 1)
			dpsQuick := damageQuick / (float32(quickMBody.Cooldown) / 1000.0)

			po.prerunArr = append(po.prerunArr, preRun{Name: pok.Name, Quick: qm, Charge: chm, Dps: dpsQuick + dpsCharge})
		}
	}

	sort.Sort(byDps(po.prerunArr))
	po.prerunArr = po.prerunArr[:1]
	return nil
}

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

func (po *prerunObj) generateForUnknownBooster() {
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

				damageCharge := (float32(chargeMBody.Damage)*0.5*(effAtk/po.bossEffDef)*getBoostBonus(&pok, chargeMBody.MoveType)*
					getMultipliers(&pok, &po.bossStat, &chargeMBody, po.inDat) + 1)
				//dps*dpe
				dpsCharge := damageCharge / (float32(chargeMBody.Cooldown) / 1000.0) * damageCharge / float32(-chargeMBody.Energy)

				damageQuick := (float32(quickMBody.Damage)*0.5*(effAtk/po.bossEffDef)*getBoostBonus(&pok, quickMBody.MoveType)*
					getMultipliers(&pok, &po.bossStat, &quickMBody, po.inDat) + 1)
				dpsQuick := damageQuick / (float32(quickMBody.Cooldown) / 1000.0)

				if prerunObj.Dps < dpsCharge+dpsQuick {
					prerunObj.Name = pok.Title
					prerunObj.Quick = qm
					prerunObj.Charge = chm
					prerunObj.Dps = dpsCharge + dpsQuick
				}

			}
		}
		//if we found the best move append it
		if prerunObj.Dps != 0 {
			po.prerunArr = append(po.prerunArr, prerunObj)
		}
	}
	sort.Sort(byDps(po.prerunArr))
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
		for _, value := range ms.movelist {
			if ms.skipMove() {
				continue
			}
			moves = append(moves, value)
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
			po.prerunArr = append(po.prerunArr, preRun{Name: pok.Name, Quick: valueQ, Charge: valueCH})
		}
	}
	return nil
}

func (po *prerunObj) generateForUnknown() {
	po.prerunArr = make([]preRun, 0, 10000)
	//define shadow bonus
	var shadowBonus float32 = 1.0
	if po.inDat.Pok.IsShadow {
		shadowBonus = shadowBonusAttack
	}

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
				effAtk := (float32(po.inDat.Pok.AttackIV) + float32(pok.Atk)) * shadowBonus * po.inDat.App.LevelData[int(po.inDat.Pok.Level/0.5)]
				quickMBody := po.inDat.App.PokemonMovesBase[qm]
				chargeMBody := po.inDat.App.PokemonMovesBase[chm]

				damageCharge := (float32(chargeMBody.Damage)*0.5*(effAtk/po.bossEffDef)*
					getMultipliers(&pok, &po.bossStat, &chargeMBody, po.inDat) + 1)
				//dps*dpe
				dpsCharge := damageCharge / (float32(chargeMBody.Cooldown) / 1000.0) * damageCharge / float32(-chargeMBody.Energy)

				dpsQuick := (float32(quickMBody.Damage)*0.5*(effAtk/po.bossEffDef)*
					getMultipliers(&pok, &po.bossStat, &quickMBody, po.inDat) + 1) / (float32(quickMBody.Cooldown) / 1000.0)

				po.prerunArr = append(po.prerunArr, preRun{
					Name:   pok.Title,
					Quick:  qm,
					Charge: chm,
					Dps:    dpsCharge + dpsQuick,
				})
			}
		}
	}
	sort.Sort(byDps(po.prerunArr))
	po.prerunArr = po.prerunArr[:900]
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
	chargekMoveList := selectObj.selectMoves()

	var (
		maxMoves = 10
		err      error
	)
	if len(quickMoveList) > maxMoves && len(chargekMoveList) > maxMoves {
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
	if len(chargekMoveList) > maxMoves {
		limiterObj := limiterObject{pok: pokVal, orginalMoveList: chargekMoveList, inDat: inDat, isCharge: true, n: maxMoves}
		chargekMoveList, err = limiterObj.limitMoves()
		if err != nil {
			return []app.BossInfo{}, err
		}
	}

	//create boss list
	bosses := make([]app.BossInfo, 0, 1)
	for _, valueQ := range quickMoveList {
		for _, valueCH := range chargekMoveList {
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
