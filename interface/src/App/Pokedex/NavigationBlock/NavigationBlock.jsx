import React from "react";
import LocalizedStrings from 'react-localization';
import { useHistory } from "react-router-dom";

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const NavigationBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const history = useHistory();

    function buttonsConfig() {
        if (props.list[props.position - 1] && props.list[props.position + 1]) {
            return "justify-content-between"
        }
        if (props.list[props.position - 1]) {
            return "justify-content-start"
        }
        return "justify-content-end"
    }

    function onPrevNext(event) {
        let attr = event.target.getAttribute('attr');
        switch (attr) {
            case "prev":
                history.push((navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" +
                    encodeURIComponent(props.list[props.position - 1][0]));
                break
            case "next":
                history.push((navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" +
                    encodeURIComponent(props.list[props.position + 1][0]));
                break
            default:
        }
    }

    return (
        <div className={"row m-0 p-0 mb-2 " + buttonsConfig()}>
            {props.list[props.position - 1] &&
                <i
                    attr={"prev"}
                    class="fas fa-angle-double-left fa-2x clickable"
                    onClick={onPrevNext}
                ></i>}
            {props.list[props.position + 1] &&
                <i
                    attr={"next"}
                    class="fas fa-angle-double-right fa-2x clickable"
                    onClick={onPrevNext}
                ></i>}
        </div>
    )
});





/*
<a
                    title={strings.dexentr +
                        "#" + props.list[props.position - 1][1].Number + " " +
                        props.list[props.position - 1][0]}
                    href={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" +
                        encodeURIComponent(props.list[props.position - 1][0])}
                >


 <a
                        title={strings.dexentr +
                            "#" + props.list[props.position + 1][1].Number + " " +
                            props.list[props.position + 1][0]}
                        href={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" +
                            encodeURIComponent(props.list[props.position + 1][0])}
                    >
*/

export default NavigationBlock;