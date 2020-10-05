import React from "react";


const FightStats = React.memo(function (props) {
    return (
        <div className="row m-0 fBolder">
            <div className="col-6 p-0 pr-1">
                <i className="fas fa-crosshairs mr-1"></i>
                {props.dAvg + "% (" + props.dMin + "% - " + props.dMax + "%)"}
            </div>
            <div className="col-6 p-0">
                <i className="fas fa-users mr-1"></i>
                {props.plAvg + " (" + props.plMin + " - " + props.plMax + ")"}
            </div>
            <div className="col-6 p-0 pr-1">
                <i className="fab fa-cloudscale mr-1"></i>
                {props.dpsAvg + " (" + props.dpsMin + " - " + props.dpsMax + ")"}
            </div>
            <div className="col-6 p-0">
                <i className="fas fa-skull-crossbones mr-1"></i>
                {props.FMin + " - " + props.FMax}
            </div>
            <div className="col-6 p-0">
                <i className="far fa-clock mr-1"></i>
                {props.tAvg + props.locale + " (" + props.tMin + props.locale + " - " + props.tMax + props.locale + ")"}
            </div>
            <div className="col-6 p-0">
                <i className="far fa-hourglass mr-1"></i>
                {props.ttwAvg + props.locale}
            </div>

        </div>
    )
});

export default FightStats;