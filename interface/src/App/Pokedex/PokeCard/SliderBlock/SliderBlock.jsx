import React from "react"
import LocalizedStrings from "react-localization"

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";

import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/dexLocale"

import "./SliderBlock.scss"

let strings = new LocalizedStrings(dexLocale)

const SliderButtons = React.memo(function SliderButtons(props) {

    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <SliderBlock>
            <SliderButton className={"pokcardslider-group__button"} attr="moves" toggled={!!props.active.moves} onClick={props.onClick} disabled={props.moveDis}>
                {strings.movelist}
            </SliderButton>

            <SliderButton className={"pokcardslider-group__button"} attr="evo" toggled={!!props.active.evo} onClick={props.onClick} disabled={props.evoDis}>
                {strings.evochart}
            </SliderButton>

            <SliderButton className={"pokcardslider-group__button"} attr="eff" toggled={!!props.active.eff} onClick={props.onClick}>
                {strings.vunlist}
            </SliderButton>

            <SliderButton className={"pokcardslider-group__button"} attr="cp" toggled={!!props.active.cp} onClick={props.onClick}>
                {"CP"}
            </SliderButton>

            <SliderButton className={"pokcardslider-group__button"} attr="other" toggled={!!props.active.other} onClick={props.onClick} disabled={props.othDis}>
                {strings.otherinf}
            </SliderButton>
        </SliderBlock>
    )

});

export default SliderButtons;