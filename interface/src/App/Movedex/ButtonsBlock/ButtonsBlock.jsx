import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import Button from "../../Pokedex/ButtonsBlock/Button"

let strings = new LocalizedStrings(dexLocale);


const ButtonsBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    return (
        <div className={"row m-0 p-0 my-2 text-center dexButtonGroup justify-content-center"} >
            <Button
                attr={"eff"}
                title={strings.vunlist}
                class=""
                onClick={props.onClick}
            />
            <Button
                attr={"use"}
                title={strings.used}
                class=""
                onClick={props.onClick}
            />
        </div>
    )
});

export default ButtonsBlock;