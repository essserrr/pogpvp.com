import React from "react";
import LocalizedStrings from "react-localization"

import Button from "../../Movedex/MoveCard/DoubleSlider/Button/Button"
import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/getCookie"

import "./ButtonsBlock.scss"

let strings = new LocalizedStrings(locale)

const ButtonsBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className={"raidslider-group row m-0 mb-3 text-center justify-content-center"} >
            <Button
                attr="megaRaids"
                title={strings.tierlist.mega}
                class={props.filter.megaRaids ? "raidslider-group__button active col py-1" : "raidslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="tier5"
                title={strings.tierlist.raidtier + " 5"}
                class={props.filter.tier5 ? "raidslider-group__button active col py-1" : "raidslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"tier3"}
                title={strings.tierlist.raidtier + " 3"}
                class={props.filter.tier3 ? "raidslider-group__button active col py-1" : "raidslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"tier1"}
                title={strings.tierlist.raidtier + " 1"}
                class={props.filter.tier1 ? "raidslider-group__button active col py-1" : "raidslider-group__button col py-1"}
                onClick={props.onFilter}
            />
        </div>
    )

});

export default ButtonsBlock;