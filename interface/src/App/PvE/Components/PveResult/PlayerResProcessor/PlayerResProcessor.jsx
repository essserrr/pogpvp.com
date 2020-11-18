import React from "react";
import PropTypes from 'prop-types';

import PlayerResEntry from "./PlayerResEntry/PlayerResEntry";

class PlayerResProcessor extends React.PureComponent {

    sumDamage() {
        //create new
        let setOfResults = {
            overall: {
                avg: { dAvg: 0, playerImpact: [], ttwAvg: 0 },
                max: { dAvg: 0, playerImpact: [], ttwAvg: 0 },
                min: { dAvg: 999999, playerImpact: [], ttwAvg: 0 },
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
                        avg: { dAvg: 0, playerImpact: [], },
                        max: { dAvg: 0, playerImpact: [], },
                        min: { dAvg: 0, playerImpact: [], },
                    }
                }
                //sum dmg
                setOfResults.detailed[key].results.push(vsBossResult)
                setOfResults.detailed[key].avg.dAvg += vsBossResult.DAvg
                setOfResults.detailed[key].max.dAvg += vsBossResult.DMax
                setOfResults.detailed[key].min.dAvg += vsBossResult.DMin
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

        switch (partyResult.dAvg >= bossHP) {
            //process win
            case true:
                partyResult.dAvg = this.noMoreThanBossHP(partyResult.dAvg, bossHP)
                //estimate each player impact
                partyResult.playerImpact = this.estimateImpact(eachPlayerResult, dmgType)
                //write time total
                partyResult.ttwAvg = partyResult.playerImpact.reduce((max, player) => player.time > max ? player.time : max, 0)
                break
            //process lose
            default:
                //for each player write their impact and sum avg time
                let avgTime = 0
                eachPlayerResult.forEach(player => {
                    const timeSpent = battleTimer - player[`T${timeType}`] / 1000
                    if (avgTime < timeSpent) { avgTime = timeSpent }
                    partyResult.playerImpact.push({ dAvg: player[`D${dmgType}`], time: timeSpent })
                })
                //write time total
                partyResult.ttwAvg = Math.ceil((avgTime) * bossHP / partyResult.dAvg)
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
        let ttwAvg = this.calculateTTW(playersAvgDPS, bossHP)
        //exclude players which live less than ttw
        eachPlayerResult.forEach((player, id) => {
            if (ttwAvg > (battleTimer - player.TAvg / 1000)) {
                sum.push({ dAvg: player[`D${statType}`], time: battleTimer - player.TAvg / 1000 })
                eachPlayerResult = [...eachPlayerResult.slice(0, id), ...eachPlayerResult.slice(id + 1, eachPlayerResult.length)]
                playersAvgDPS = [...playersAvgDPS.slice(0, id), ...playersAvgDPS.slice(id + 1, playersAvgDPS.length)]
            }
        })

        //extract exluded players damage from boss hp
        bossHP -= sum.reduce((sum, value) => value.dAvg + sum, 0)
        //calculate dps
        playersAvgDPS = this.calculateDPS(eachPlayerResult, battleTimer, statType)
        //get average ttw
        ttwAvg = this.calculateTTW(playersAvgDPS, bossHP)

        eachPlayerResult.forEach((player, id) => {
            sum.push({ dAvg: playersAvgDPS[id] * ttwAvg, time: ttwAvg })
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
        // eslint-disable-next-line
        for (const [key, value] of Object.entries(setOfResults.detailed)) {
            if (setOfResults.overall.max.dAvg < value.max.dAvg) { setOfResults.overall.max.dAvg = value.max.dAvg; setOfResults.overall.max.ttwAvg = value.max.ttwAvg; }
            if (setOfResults.overall.min.dAvg > value.min.dAvg) { setOfResults.overall.min.dAvg = value.min.dAvg; setOfResults.overall.min.ttwAvg = value.min.ttwAvg; }

            setOfResults.overall.avg.dAvg += value.avg.dAvg
            setOfResults.overall.avg.ttwAvg += value.avg.ttwAvg
        }

        const numberOfBosses = Object.entries(setOfResults.detailed).length
        setOfResults.overall.avg.dAvg /= numberOfBosses
        setOfResults.overall.avg.ttwAvg = (setOfResults.overall.avg.ttwAvg / numberOfBosses).toFixed(0)

        return setOfResults
    }

    noMoreThanBossHP(value, bossHP) {
        return value > bossHP ? bossHP : value
    }

    render() {
        let summedDamgObj = this.sumDamage()
        summedDamgObj = this.processResult(summedDamgObj)
        summedDamgObj = this.findOverall(summedDamgObj)

        return (
            <PlayerResEntry
                {...this.props}
                value={summedDamgObj}
            />
        )
    }

}

export default PlayerResProcessor;

PlayerResProcessor.propTypes = {
    value: PropTypes.array,

    snapshot: PropTypes.object,
    tables: PropTypes.object,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};