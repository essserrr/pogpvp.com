import React from "react";


const HpRemaining = React.memo(function (props) {
    return (
        <>
            {props.locale}{(props.tierHP - props.DAvg)}
            {" (" + (props.tierHP - props.DMax) + "-" + (props.tierHP - props.DMin) + ")"}
            <span className="bigText">{props.NOfWins > 0 ? " Winrate " + props.NOfWins + "%" : ""}</span>
        </>
    )
});

export default HpRemaining;