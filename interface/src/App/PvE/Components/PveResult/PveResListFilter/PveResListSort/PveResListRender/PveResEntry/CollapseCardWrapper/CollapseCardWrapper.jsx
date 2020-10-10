import React from "react"

import PlayerStatistics from "../PlayerStatistics/PlayerStatistics"
import CollapseCard from "./CollapseCard/CollapseCard"

class CollapseCardWrapper extends React.PureComponent {
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
            <CollapseCard
                pokQick={this.props.moveTable[this.props.stats.BQ]}
                pokCh={this.props.moveTable[this.props.stats.BCh]}
                weather={this.props.snapshot.pveObj.Weather}
            >
                <PlayerStatistics
                    bounds={{
                        up: ((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DMin)) /
                            (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1),
                        low: ((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DMax)) /
                            (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1),
                        avg: ((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DAvg)) /
                            (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1),
                    }}
                    remain={{
                        avg: this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DAvg),
                        max: this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DMax),
                        min: this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(this.props.stats.DMin),
                        nbOfWins: this.props.stats.NOfWins.toFixed(1),
                    }}
                    stats={this.processStats(this.props.stats)}
                    disableCollapse={true}
                />
            </CollapseCard>
        );
    }
};

export default CollapseCardWrapper;


