import React from "react";
import LocalizedStrings from "react-localization";

import Button from "../../Movedex/Button/Button"
import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const SliderBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <div className={"row m-0 my-2 text-center sliderButton justify-content-center"} >
            <Button
                attr="moves"
                title={strings.movelist}
                class={props.active.moves ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                disabled={props.moveDis}
                onClick={props.onClick}
            />
            <Button
                attr="evo"
                title={strings.evochart}
                class={props.active.evo ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                disabled={props.evoDis}
                onClick={props.onClick}
            />
            <Button
                attr={"eff"}
                title={strings.vunlist}
                class={props.active.eff ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onClick}
            />
            <Button
                attr={"cp"}
                title={"CP"}
                class={props.active.cp ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onClick}
            />
            <Button
                attr={"other"}
                title={strings.otherinf}
                class={props.active.other ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                disabled={props.othDis}
                onClick={props.onClick}
            />
        </div>
    )

});

export default SliderBlock;