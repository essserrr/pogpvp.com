import React from "react";
import LabelPrepend from "../../../PvP/components/SelectGroup/LabelPrepend"

import LocalizedStrings from "react-localization";
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

import "./LabelAndInput.scss"

let strings = new LocalizedStrings(locale);

const LabelAndInput = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (

        <div className="col-12 px-0">
            <div className="input-group input-group-sm mt-2">
                <LabelPrepend
                    label={props.label}
                    tipClass="infoTip"
                    for={props.attr + props.name}
                    place={"top"}
                    tip={props.lTip}
                />
                <input
                    className={"form-control landinp-input mx-0 " + (props.notOk !== "" ? "landinp-input--alert" : "")}

                    name={props.name}
                    attr={props.attr}
                    value={props.value}

                    placeholder={props.place}
                    type={props.type}

                    onChange={props.onChange}
                />
            </div>
            {props.notOk !== "" && <div className="col-12 px-0 landinp-input__alert-text text-left">{props.notOk}</div>}
        </div>
    )

});

export default LabelAndInput;