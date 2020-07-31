import React from "react";


const FightStats = React.memo(function (props) {
    let dAvg = (props.avgStats.DAvg / (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1)
    let dMin = (props.avgStats.DMin / (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1)
    let dMax = (props.avgStats.DMax / (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1)

    let tAvg = (props.avgStats.TAvg / 1000).toFixed(0)
    let tMin = (props.avgStats.TMin / 1000).toFixed(0)
    let tMax = (props.avgStats.TMax / 1000).toFixed(0)

    let dpsAvg = (props.avgStats.DAvg / (props.tables.timer[props.snapshot.bossObj.Tier] - tAvg)).toFixed(1)
    let dpsMin = (props.avgStats.DMin / (props.tables.timer[props.snapshot.bossObj.Tier] - tAvg)).toFixed(1)
    let dpsMax = (props.avgStats.DMax / (props.tables.timer[props.snapshot.bossObj.Tier] - tAvg)).toFixed(1)

    let plAvg = (100 / dAvg).toFixed(2)
    let plMin = Math.ceil(100 / dMax)
    let plMax = Math.ceil(100 / dMin)

    let ttwAvg = Math.ceil((props.tables.timer[props.snapshot.bossObj.Tier] - tAvg) * 100 / dAvg)

    return (
        <div className="row m-0 fBolder">
            <div className="col-6 p-0 pr-1">
                <i className="fas fa-crosshairs mr-1"></i>
                {dAvg + "% (" + dMin + "% - " + dMax + "%)"}
            </div>
            <div className="col-6 p-0">
                <i className="fas fa-users mr-1"></i>
                {plAvg + " (" + plMin + " - " + plMax + ")"}
            </div>
            <div className="col-6 p-0 pr-1">
                <i className="fab fa-cloudscale mr-1"></i>
                {dpsAvg + " (" + dpsMin + " - " + dpsMax + ")"}
            </div>
            <div className="col-6 p-0">
                <i className="fas fa-skull-crossbones mr-1"></i>
                {props.avgStats.FMin + " - " + props.avgStats.FMax}
            </div>
            <div className="col-6 p-0">
                <i className="far fa-clock mr-1"></i>
                {tAvg + props.locale + " (" + tMin + props.locale + " - " + tMax + props.locale + ")"}
            </div>
            <div className="col-6 p-0">
                <i className="far fa-hourglass mr-1"></i>
                {ttwAvg + props.locale}
            </div>

        </div>
    )
});

export default FightStats;