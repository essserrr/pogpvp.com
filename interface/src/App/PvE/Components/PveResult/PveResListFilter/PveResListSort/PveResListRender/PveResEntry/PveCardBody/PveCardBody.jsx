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

    damageString(damage) {
        return this.props.tables.hp[this.props.snapshot.bossObj.Tier] < damage ?
            this.props.tables.hp[this.props.snapshot.bossObj.Tier] : damage
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
                        upbound={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] -
                            this.damageString(this.props.stats.DMin)) / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                        lowbound={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] -
                            this.damageString(this.props.stats.DMax)) / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                        length={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] -
                            this.damageString(this.props.stats.DAvg)) / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                    />
                </div>
                <div className="pvecard-body--font col-12 m-0 p-0">
                    <HpRemaining
                        locale={pveStrings.hprem}
                        DAvg={this.damageString(this.props.stats.DAvg)}
                        DMax={this.damageString(this.props.stats.DMax)}
                        DMin={this.damageString(this.props.stats.DMin)}
                        NOfWins={this.props.stats.NOfWins.toFixed(1)}
                        tierHP={this.props.tables.hp[this.props.snapshot.bossObj.Tier]}
                    />
                </div>
                <div className="col-12 m-0 p-0">
                    <FightStats
                        locale={pveStrings.s}
                        tables={this.props.tables}
                        snapshot={this.props.snapshot}
                        avgStats={this.props.stats}
                    />
                </div>
            </div>
        );
    }
};

export default PveCardBody;


