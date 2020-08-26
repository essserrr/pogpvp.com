import React from "react";
import LabelPrepend from "../../../../PvP/components/SelectGroup/LabelPrepend"
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'

import LocalizedStrings from "react-localization";
import { userLocale } from "../../../../../locale/userLocale"
import { getCookie } from "../../../../../js/getCookie"

import "./CountryAndRegion.scss"

let strings = new LocalizedStrings(userLocale);

const CountryAndRegion = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (

        <div className="col-12 px-0">
            <div className="input-group input-group-sm">
                <LabelPrepend
                    label={props.label}

                    labelWidth={props.labelWidth}
                    tipClass="infoTip"
                    for={props.lTip ? props.attr + props.name : ""}
                    place={"top"}
                    tip={props.lTip}
                />
                {props.type === "Country" ?
                    <CountryDropdown
                        classes={"custom-select countreg-input " + (props.notOk !== "" ? "countreg-input--alert" : "")}
                        defaultOptionLabel={strings.shbroker.cPlace}
                        value={props.Country}
                        onChange={props.onChange} /> :
                    <RegionDropdown
                        classes={"custom-select countreg-input " + (props.notOk !== "" ? "countreg-input--alert" : "")}
                        defaultOptionLabel={strings.shbroker.rPlace}

                        country={props.Country}
                        value={props.Region}
                        onChange={props.onChange} />}

                {props.notOk !== "" && <div className="col-12 px-0 countreg-input__alert-text text-left">{props.notOk}</div>}
            </div>
        </div>
    )

});

export default CountryAndRegion;