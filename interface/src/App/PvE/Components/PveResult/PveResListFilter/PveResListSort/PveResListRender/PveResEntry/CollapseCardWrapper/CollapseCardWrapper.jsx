import React from "react";
import PropTypes from 'prop-types';

import PlayerStatistics from "../PlayerStatistics/PlayerStatistics"
import CollapseCard from "./CollapseCard/CollapseCard"

const CollapseCardWrapper = React.memo(function CollapseCardWrapper(props) {

    const cropDamage = (damage) => {
        return props.tables.hp[props.snapshot.bossObj.Tier] < damage ?
            props.tables.hp[props.snapshot.bossObj.Tier] : damage
    }

    const processStats = (avgStats) => {
        let dAvg = (avgStats.DAvg / (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1)
        let dMin = (avgStats.DMin / (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1)
        let dMax = (avgStats.DMax / (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1)

        let tAvg = (avgStats.TAvg / 1000).toFixed(0)

        return {
            dAvg: dAvg,
            dMin: dMin,
            dMax: dMax,

            tAvg: (avgStats.TAvg / 1000).toFixed(0),
            tMin: (avgStats.TMin / 1000).toFixed(0),
            tMax: (avgStats.TMax / 1000).toFixed(0),

            dpsAvg: (avgStats.DAvg / (props.tables.timer[props.snapshot.bossObj.Tier] - tAvg)).toFixed(1),
            dpsMin: (avgStats.DMin / (props.tables.timer[props.snapshot.bossObj.Tier] - tAvg)).toFixed(1),
            dpsMax: (avgStats.DMax / (props.tables.timer[props.snapshot.bossObj.Tier] - tAvg)).toFixed(1),

            plAvg: (100 / dAvg).toFixed(2),
            plMin: Math.ceil(100 / dMax),
            plMax: Math.ceil(100 / dMin),

            ttwAvg: Math.ceil((props.tables.timer[props.snapshot.bossObj.Tier] - tAvg) * 100 / dAvg),

            FMin: avgStats.FMin,
            FMax: avgStats.FMax,
        }
    }

    return (
        <CollapseCard pokQick={props.moveTable[props.stats.BQ]} pokCh={props.moveTable[props.stats.BCh]} weather={props.snapshot.pveObj.Weather}>

            <PlayerStatistics
                bounds={{
                    up: ((props.tables.hp[props.snapshot.bossObj.Tier] - cropDamage(props.stats.DMin)) /
                        (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1),
                    low: ((props.tables.hp[props.snapshot.bossObj.Tier] - cropDamage(props.stats.DMax)) /
                        (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1),
                    avg: ((props.tables.hp[props.snapshot.bossObj.Tier] - cropDamage(props.stats.DAvg)) /
                        (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1),
                }}
                remain={{
                    avg: props.tables.hp[props.snapshot.bossObj.Tier] - cropDamage(props.stats.DAvg),
                    max: props.tables.hp[props.snapshot.bossObj.Tier] - cropDamage(props.stats.DMax),
                    min: props.tables.hp[props.snapshot.bossObj.Tier] - cropDamage(props.stats.DMin),
                    nbOfWins: props.stats.NOfWins.toFixed(1),
                }}
                stats={processStats(props.stats)}
                disableCollapse={true}
            />

        </CollapseCard>
    )
});


export default CollapseCardWrapper;

CollapseCardWrapper.propTypes = {
    stats: PropTypes.object,
    moveTable: PropTypes.object,
    snapshot: PropTypes.object,
    tables: PropTypes.object,
};