import React from "react"
import LocalizedStrings from "react-localization"

import Button from "../../../Movedex/MoveCard/DoubleSlider/Button/Button"
import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/dexLocale"

import "./SliderBlock.scss"

let strings = new LocalizedStrings(dexLocale)

const SliderBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <div className={"pokcardslider-group row m-0 my-2 text-center justify-content-center"} >
            <Button
                attr="moves"
                title={strings.movelist}
                class={props.active.moves ? "pokcardslider-group__button active col py-1" : "pokcardslider-group__button col py-1"}
                disabled={props.moveDis}
                onClick={props.onClick}
            />
            <Button
                attr="evo"
                title={strings.evochart}
                class={props.active.evo ? "pokcardslider-group__button active col py-1" : "pokcardslider-group__button col py-1"}
                disabled={props.evoDis}
                onClick={props.onClick}
            />
            <Button
                attr={"eff"}
                title={strings.vunlist}
                class={props.active.eff ? "pokcardslider-group__button active col py-1" : "pokcardslider-group__button col py-1"}
                onClick={props.onClick}
            />
            <Button
                attr={"cp"}
                title={"CP"}
                class={props.active.cp ? "pokcardslider-group__button active col py-1" : "pokcardslider-group__button col py-1"}
                onClick={props.onClick}
            />
            <Button
                attr={"other"}
                title={strings.otherinf}
                class={props.active.other ? "pokcardslider-group__button active col py-1" : "pokcardslider-group__button col py-1"}
                disabled={props.othDis}
                onClick={props.onClick}
            />
        </div>
    )

});

export default SliderBlock;