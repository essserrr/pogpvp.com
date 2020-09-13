import React from "react"
import ReactTooltip from "react-tooltip"
import { Link } from "react-router-dom"

const NavigationBlock = React.memo(function (props) {
    function buttonsConfig() {
        if (props.prev && props.next) {
            return "justify-content-between"
        }
        if (props.prev) {
            return "justify-content-start"
        }
        return "justify-content-end"
    }

    return (
        <div className={(props.class ? props.class : "row m-0 mb-2 ") + buttonsConfig()}>
            {props.prev && <Link to={navigator.userAgent === "ReactSnap" ? "/" : props.prev}>
                <i
                    attr={"prev"}
                    className="fas fa-angle-double-left fa-2x clickable"
                    data-tip data-for={props.prevTitle ? "prev" : ""}
                ></i>
                <ReactTooltip
                    className={"infoTip"}
                    multiline={true}
                    id={props.prevTitle ? "prev" : ""} effect="solid">
                    {props.prevTitle}
                </ReactTooltip>
            </Link>}
            {props.next && <Link to={navigator.userAgent === "ReactSnap" ? "/" : props.next}>
                <i
                    attr={"next"}
                    className="fas fa-angle-double-right fa-2x clickable"
                    data-tip data-for={props.nextTitle ? "next" : ""}
                ></i>
                <ReactTooltip
                    className={"infoTip"}
                    multiline={true}
                    id={props.nextTitle ? "next" : ""} effect="solid">
                    {props.nextTitle}
                </ReactTooltip>

            </Link >}
        </div >
    )
});


export default NavigationBlock;