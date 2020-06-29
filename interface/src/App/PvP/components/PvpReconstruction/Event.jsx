import React from "react";
import ReactTooltip from "react-tooltip"

const Event = React.memo(function (props) {
    return (
        <td
            onMouseEnter={props.onMouseEnter}
            id={props.for}
            style={{
                verticalAlign: "middle",
                textAlign: "center"
            }}
        >
            <div
                onClick={props.onclick}
                className={props.className}
                style={props.style}
                data-tip data-for={props.for}
            >{props.value}</div>
            {(props.for !== "") && <ReactTooltip
                className='logItems'
                id={props.for} effect='solid'
                place={props.place}
                multiline={true}>
                {props.tip}
            </ReactTooltip>}
        </td>
    )
});

export default Event;
