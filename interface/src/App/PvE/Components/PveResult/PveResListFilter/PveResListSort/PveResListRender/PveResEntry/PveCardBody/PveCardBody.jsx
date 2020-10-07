import React from "react"
import LocalizedStrings from "react-localization"

import HpBar from "../PhBar/HpBar"
import HpRemaining from "../HpRemaining/HpRemaining"
import WeatherMoves from "../WeatherMoves/WeatherMoves"
import FightStats from "../FightStats/FightStats"

import { getCookie } from "../../../../../../../../../js/getCookie"
import { pveLocale } from "../../../../../../../../../locale/pveLocale"

import "./PveCardBody.scss"

let pveStrings = new LocalizedStrings(pveLocale)


class PveCardBody extends React.PureComponent {
    constructor(props) {
        super(props);
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    cropDamage(damage) {
        return this.props.tables.hp[this.props.snapshot.bossObj.Tier] < damage ?
            this.props.tables.hp[this.props.snapshot.bossObj.Tier] : damage
    }

    processStats(avgStats) {
        let dAvg = (avgStats.DAvg / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)
        let dMin = (avgStats.DMin / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)
        let dMax = (avgStats.DMax / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)

        let tAvg = (avgStats.TAvg / 1000).toFixed(0)

        return {
            dAvg: dAvg,
            dMin: dMin,
            dMax: dMax,

            tAvg: (avgStats.TAvg / 1000).toFixed(0),
            tMin: (avgStats.TMin / 1000).toFixed(0),
            tMax: (avgStats.TMax / 1000).toFixed(0),

            dpsAvg: (avgStats.DAvg / (this.props.tables.timer[this.props.snapshot.bossObj.Tier] - tAvg)).toFixed(1),
            dpsMin: (avgStats.DMin / (this.props.tables.timer[this.props.snapshot.bossObj.Tier] - tAvg)).toFixed(1),
            dpsMax: (avgStats.DMax / (this.props.tables.timer[this.props.snapshot.bossObj.Tier] - tAvg)).toFixed(1),

            plAvg: (100 / dAvg).toFixed(2),
            plMin: Math.ceil(100 / dMax),
            plMax: Math.ceil(100 / dMin),

            ttwAvg: Math.ceil((this.props.tables.timer[this.props.snapshot.bossObj.Tier] - tAvg) * 100 / dAvg),

            FMin: avgStats.FMin,
            FMax: avgStats.FMax,
        }
    }

    render() {
        return (

            <div className="pvecard-body col-12 m-0 p-0 p-2 my-1 " key={this.props.stats.BQ + this.props.stats.BCh}>
                <div className="col-12 d-flex align-items-center m-0 p-0">
                    <WeatherMoves
                        pokQick={this.props.moveTable[this.props.stats.BQ]}
                        pokCh={this.props.moveTable[this.props.stats.BCh]}
                        weather={this.props.snapshot.pveObj.Weather}
                    />
                </div>
                <div className="col-12 m-0 p-0 mt-2">
                    <HpBar

                        up={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DMin)) /
                            (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                        low={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DMax)) /
                            (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                        avg={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DAvg)) /
                            (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                    />
                </div>
                <div className="col-12 m-0 p-0">
                    <HpRemaining
                        avg={this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DAvg)}
                        max={this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DMax)}
                        min={this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DMin)}
                        nbOfWins={this.props.stats.NOfWins.toFixed(1)}
                    />
                </div>
                <div className="col-12 m-0 p-0">
                    <FightStats
                        {...this.processStats(this.props.stats)}
                    />
                </div>
            </div>
        );
    }
};

export default PveCardBody;


