import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import Button from "./Button"

let strings = new LocalizedStrings(dexLocale);


const ButtonsBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className={"row m-0 p-0 my-2 text-center dexButtonGroup justify-content-center"} >
            {props.buttons.map((el, i) =>
                <Button
                    key={el.attr + i}

                    attr={el.attr}
                    title={el.title}
                    disabled={el.disabled}

                    class={el.class}
                    onClick={props.onClick}
                />)}
        </div>
    )
});

export default ButtonsBlock;