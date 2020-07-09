import React from "react";
import { calculateEffStat } from "../../../../js/indexFunctions"
import ReactTooltip from "react-tooltip"

const EnergyIndicator = React.memo(function (props) {
    let maxValue
    let defaultValue

    switch (props.maxValue === undefined) {
        case true:
            maxValue = calculateEffStat(props.name, props.lvl, props.sta, "0", props.table, "Sta")
            defaultValue = maxValue
            break
        default:
            maxValue = props.maxValue
            defaultValue = props.defaultValue
    }
    let value = (props.value !== undefined && props.value !== "") ? (props.value <= maxValue ? props.value : maxValue) : defaultValue;
    return (
        <>
            <ReactTooltip
                className="logItems"
                id={props.for}
                effect="solid"
                place="top"
                multiline={true}
            >
                {props.tip}
            </ReactTooltip>
            <div
                data-tip data-for={props.for}
                className={(value < maxValue) ? "energyBar" : "energyBar glow" + props.moveType}
            >
                <div className="textOnBar noselect" >
                    {props.moveName}
                </div>
                <div className={"energyIndicator typeColorC" + props.moveType} style={{ height: ((value / maxValue * 100)) + "%" }}></div>

            </div>
        </>
    )
});

export default EnergyIndicator;