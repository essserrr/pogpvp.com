import React from "react";


const FightStats = React.memo(function (props) {
    return (
        <div className="row m-0 p-0 fBolder">
            <div className="col-6 m-0 p-0 pr-1">
                <i className="fas fa-crosshairs mr-1"></i>
                {(props.avgStats.DAvg / (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1)}%
                {" ("}{(props.avgStats.DMin / (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1)}{"% - "}
                {(props.avgStats.DMax / (props.tables.hp[props.snapshot.bossObj.Tier]) * 100).toFixed(1)}%)
            </div>
            <div className="col-6 m-0 p-0">
                <i className="far fa-clock mr-1"></i>
                {(props.avgStats.TAvg / 1000).toFixed(0)}{props.locale}
                {" ("}{(props.avgStats.TMin / 1000).toFixed(0)}{props.locale}{" - "}
                {(props.avgStats.TMax / 1000).toFixed(0)}{props.locale})
            </div>
            <div className="col-6 m-0 p-0 pr-1">
                <i className="fab fa-cloudscale mr-1"></i>
                {(props.avgStats.DAvg / (props.tables.timer[props.snapshot.bossObj.Tier] - (props.avgStats.TAvg / 1000).toFixed(0))).toFixed(1)}
                {" ("}{(props.avgStats.DMin / (props.tables.timer[props.snapshot.bossObj.Tier] - (props.avgStats.TAvg / 1000).toFixed(0))).toFixed(1)}{" - "}
                {(props.avgStats.DMax / (props.tables.timer[props.snapshot.bossObj.Tier] - (props.avgStats.TAvg / 1000).toFixed(0))).toFixed(1)})
            </div>


            <div className="col-6 m-0 p-0">
                <i className="fas fa-skull-crossbones mr-1"></i>
                {props.avgStats.FMin + " - " + props.avgStats.FMax}
            </div>
        </div>
    )
});

export default FightStats;