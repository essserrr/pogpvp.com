import React from "react";
import LocalizedStrings from "react-localization";


import Button from "../../Movedex/Button/Button"
import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);


const ButtonsBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className={"row m-0 mb-3 text-center sliderGroup justify-content-center"} >
            <Button
                attr="tier5"
                title={strings.tierlist.raidtier + " 5"}
                class={props.filter.tier5 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
            <Button
                attr="tier4"
                title={strings.tierlist.raidtier + " 4"}
                class={props.filter.tier4 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
            <Button
                attr={"tier3"}
                title={strings.tierlist.raidtier + " 3"}
                class={props.filter.tier3 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
            <Button
                attr={"tier2"}
                title={strings.tierlist.raidtier + " 2"}
                class={props.filter.tier2 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
            <Button
                attr={"tier1"}
                title={strings.tierlist.raidtier + " 1"}
                class={props.filter.tier1 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
        </div>
    )

});

export default ButtonsBlock;