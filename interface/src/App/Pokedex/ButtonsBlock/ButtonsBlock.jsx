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
            <Button
                disabled={props.moDis}

                attr={"moves"}
                title={strings.movelist}
                class=""
                onClick={props.onClick}
            />
            <Button
                disabled={props.evoDis}

                attr={"evo"}
                title={strings.evochart}
                class=""
                onClick={props.onClick}
            />
            <Button
                attr={"eff"}
                title={strings.vunlist}
                class=""
                onClick={props.onClick}
            />
            <Button
                attr={"cp"}
                title={"CP"}
                class=""
                onClick={props.onClick}
            />
            <Button
                disabled={props.othDis}

                attr={"other"}
                title={strings.otherinf}
                class=""
                onClick={props.onClick}
            />
        </div>
    )
});

export default ButtonsBlock;