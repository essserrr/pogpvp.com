import React from "react"

import PlayerRes from "./PlayerRes/PlayerRes"

class PlayersAvg extends React.PureComponent {

    sumDamage() {
        //create new
        let setOfResults = {
            overall: {
                avg: { dmg: 0, playerImpact: [], isWin: false, timeTotal: 0 },
                max: { dmg: 0, playerImpact: [], isWin: false, timeTotal: 0 },
                min: { dmg: 999999, playerImpact: [], isWin: false, timeTotal: 0 },
            },
            detailed: {},
        }

        this.props.value.forEach(player => {
            player.Result.forEach(vsBossResult => {
                const key = vsBossResult.BName + vsBossResult.BQ + vsBossResult.BCh
                //add new entry
                if (!setOfResults.detailed[key]) {
                    setOfResults.detailed[key] = {
                        results: [],
                        avg: { dmg: 0, playerImpact: [], isWin: false, },
                        max: { dmg: 0, playerImpact: [], isWin: false, },
                        min: { dmg: 0, playerImpact: [], isWin: false, },
                    }
                }
                //sum dmg
                setOfResults.detailed[key].results.push(vsBossResult)
                setOfResults.detailed[key].avg.dmg += vsBossResult.DAvg
                setOfResults.detailed[key].max.dmg += vsBossResult.DMax
                setOfResults.detailed[key].min.dmg += vsBossResult.DMin
            })
        });

        return setOfResults
    }

    processResult(setOfResults) {
        for (const [key, value] of Object.entries(setOfResults.detailed)) {
            setOfResults.detailed[key] = {
                avg: this.processResultType(value.avg, value.results, "Avg", "Avg"),
                max: this.processResultType(value.max, value.results, "Max", "Min"),
                min: this.processResultType(value.min, value.results, "Min", "Max"),
                boss: { name: value.results[0].BName, quick: value.results[0].BQ, charge: value.results[0].BCh, },
            }
        }
        return setOfResults
    }

    processResultType(partyResult, eachPlayerResult, dmgType, timeType) {
        const bossHP = this.props.tables.hp[this.props.snapshot.bossObj.Tier]
        const battleTimer = this.props.tables.timer[this.props.snapshot.bossObj.Tier]

        switch (partyResult.dmg >= bossHP) {
            //process win
            case true:
                partyResult.dmg = this.noMoreThanBossHP(partyResult.dmg, bossHP)
                partyResult.isWin = true
                //estimate each player impact
                partyResult.playerImpact = this.estimateImpact(eachPlayerResult, dmgType)
                //write time total
                partyResult.timeTotal = partyResult.playerImpact.reduce((max, player) => player.time > max ? player.time : max, 0)
                break
            //process lose
            default:
                partyResult.isWin = false
                //for each player write their impact and sum avg time
                let avgTime = 0
                eachPlayerResult.forEach(player => {
                    const timeSpent = battleTimer - player[`T${timeType}`] / 1000
                    if (avgTime < timeSpent) { avgTime = timeSpent }
                    partyResult.playerImpact.push({ dmg: player[`D${dmgType}`], time: timeSpent })
                })
                //write time total
                partyResult.timeTotal = Math.ceil((avgTime) * bossHP / partyResult.dmg)
        }

        return partyResult
    }

    estimateImpact(eachPlayerResult, statType) {
        let sum = []
        let bossHP = this.props.tables.hp[this.props.snapshot.bossObj.Tier]
        const battleTimer = this.props.tables.timer[this.props.snapshot.bossObj.Tier]


        //calculate players dps
        let playersAvgDPS = this.calculateDPS(eachPlayerResult, battleTimer, statType)
        //get average ttw
        let timeTotal = this.calculateTTW(playersAvgDPS, bossHP)
        //exclude players which live less than ttw
        eachPlayerResult.forEach((player, id) => {
            if (timeTotal > (battleTimer - player.TAvg / 1000)) {
                sum.push({ dmg: player[`D${statType}`], time: battleTimer - player.TAvg / 1000 })
                eachPlayerResult = [...eachPlayerResult.slice(0, id), ...eachPlayerResult.slice(id + 1, eachPlayerResult.length)]
                playersAvgDPS = [...playersAvgDPS.slice(0, id), ...playersAvgDPS.slice(id + 1, playersAvgDPS.length)]
            }
        })

        //extract exluded players damage from boss hp
        bossHP -= sum.reduce((sum, value) => value.dmg + sum, 0)
        //calculate dps
        playersAvgDPS = this.calculateDPS(eachPlayerResult, battleTimer, statType)
        //get average ttw
        timeTotal = this.calculateTTW(playersAvgDPS, bossHP)

        eachPlayerResult.forEach((player, id) => {
            sum.push({ dmg: playersAvgDPS[id] * timeTotal, time: timeTotal })
        })

        return sum
    }


    calculateDPS(eachPlayerResult, battleTimer, statType) {
        let dps = []
        eachPlayerResult.forEach(player => {
            dps.push(player[`D${statType}`] / (battleTimer - player.TAvg / 1000))
        })
        return dps
    }

    calculateTTW(playersAvgDPS, bossHP) {
        return Math.ceil(bossHP / playersAvgDPS.reduce((sum, val) => sum + val, 0))
    }

    findOverall(setOfResults) {
        let nOfWin = 0
        // eslint-disable-next-line
        for (const [key, value] of Object.entries(setOfResults.detailed)) {
            if (setOfResults.overall.max.dmg < value.max.dmg) { setOfResults.overall.max = value.max }
            if (setOfResults.overall.min.dmg > value.min.dmg) { setOfResults.overall.min = value.min }

            setOfResults.overall.avg.dmg += value.avg.dmg
            setOfResults.overall.avg.timeTotal += value.avg.timeTotal
            if (value.avg.isWin) { nOfWin++ }
        }
        console.log(nOfWin)

        const numberOfBosses = Object.entries(setOfResults.detailed).length
        setOfResults.overall.avg.isWin = nOfWin >= numberOfBosses / 2
        setOfResults.overall.avg.winrate = nOfWin / numberOfBosses
        setOfResults.overall.avg.dmg /= numberOfBosses
        setOfResults.overall.avg.timeTotal /= numberOfBosses

        return setOfResults
    }

    noMoreThanBossHP(value, bossHP) {
        return value > bossHP ? bossHP : value
    }


    /*
{overall: {…}, detailed: {…}}
detailed:
AbomasnowPowder SnowBlizzard:
avg: {dmg: 2445, playerImpact: Array(2), isWin: false, timeTotal: 511}
boss: {name: "Abomasnow", quick: "Powder Snow", charge: "Blizzard"}
max: {dmg: 3840, playerImpact: Array(2), isWin: false, timeTotal: 584}
min: {dmg: 1920, playerImpact: Array(2), isWin: false, timeTotal: 512}
__proto__: Object
AbomasnowPowder SnowEnergy Ball: {avg: {…}, max: {…}, min: {…}, boss: {…}}
AbomasnowPowder SnowOutrage: {avg: {…}, max: {…}, min: {…}, boss: {…}}
AbomasnowPowder SnowWeather Ball Ice: {avg: {…}, max: {…}, min: {…}, boss: {…}}
AbomasnowRazor LeafBlizzard: {avg: {…}, max: {…}, min: {…}, boss: {…}}
AbomasnowRazor LeafEnergy Ball: {avg: {…}, max: {…}, min: {…}, boss: {…}}
AbomasnowRazor LeafOutrage: {avg: {…}, max: {…}, min: {…}, boss: {…}}
AbomasnowRazor LeafWeather Ball Ice: {avg: {…}, max: {…}, min: {…}, boss: {…}}
__proto__: Object
overall:
avg: {dmg: 2172.25, playerImpact: Array(0), isWin: false, timeTotal: 544.25, winrate: 0}
max: {dmg: 4146, playerImpact: Array(2), isWin: false, timeTotal: 425}
min: {dmg: 1168, playerImpact: Array(2), isWin: false, timeTotal: 666}
    */

    render() {
        let summedDamgObj = this.sumDamage()
        summedDamgObj = this.processResult(summedDamgObj)
        summedDamgObj = this.findOverall(summedDamgObj)
        console.log(this.props)



        return (
            <PlayerRes
                {...this.props}
                value={summedDamgObj}
            />
        )
    }

}


export default PlayersAvg;