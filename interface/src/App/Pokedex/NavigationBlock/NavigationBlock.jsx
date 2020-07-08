import React from "react";
import { useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip"


const NavigationBlock = React.memo(function (props) {
    const history = useHistory();

    function buttonsConfig() {
        if (props.prev && props.next) {
            return "justify-content-between"
        }
        if (props.prev) {
            return "justify-content-start"
        }
        return "justify-content-end"
    }

    function onPrevNext(event) {
        let attr = event.target.getAttribute("attr");
        switch (attr) {
            case "prev":
                history.push((navigator.userAgent === "ReactSnap") ? "/" : props.prev);
                break
            case "next":
                history.push((navigator.userAgent === "ReactSnap") ? "/" : props.next);
                break
            default:
        }
    }

    function onMiddle(event) {
        if (event.button === 1) {
            let attr = event.target.getAttribute("attr");
            switch (attr) {
                case "prev":
                    window.open((navigator.userAgent === "ReactSnap") ? "/" : props.prev)
                    break
                case "next":
                    window.open((navigator.userAgent === "ReactSnap") ? "/" : props.next)
                    break
                default:
            }
        }
    }

    return (
        <div className={(props.class ? props.class : "row m-0 mb-2 ") + buttonsConfig()}>
            {props.prev && <>
                <i
                    attr={"prev"}
                    className="fas fa-angle-double-left fa-2x clickable"
                    onClick={onPrevNext}
                    onMouseDown={onMiddle}

                    data-tip data-for={props.prevTitle ? "prev" : ""}
                ></i>
                <ReactTooltip
                    className={"infoTip"}
                    multiline={true}
                    id={props.prevTitle ? "prev" : ""} effect="solid">
                    {props.prevTitle}
                </ReactTooltip>
            </>}
            {props.next && <>
                <i
                    attr={"next"}
                    className="fas fa-angle-double-right fa-2x clickable"
                    onMouseDown={onMiddle}
                    onClick={onPrevNext}

                    data-tip data-for={props.nextTitle ? "next" : ""}
                ></i>
                <ReactTooltip
                    className={"infoTip"}
                    multiline={true}
                    id={props.nextTitle ? "next" : ""} effect="solid">
                    {props.nextTitle}
                </ReactTooltip>

            </>}
        </div >
    )
});


export default NavigationBlock;