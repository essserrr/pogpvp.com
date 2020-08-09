import React from "react";
import LabelPrepend from "../SelectGroup/LabelPrepend"
import SingleSelect from "../SelectGroup/SingleSelect"

import LocalizedStrings from "react-localization";
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

let strings = new LocalizedStrings(locale);
strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


const Stages = React.memo(function (props) {
    return (
        <div className="input-group input-group-sm mt-2">
            <LabelPrepend
                labelWidth={props.labelWidth}
                label={props.label}

                tipClass="infoTip"
                for={props.attr + "stagestip"}
                place={"top"}
                tip={strings.tips.stages}
            />
            <SingleSelect
                name="AtkStage"
                attr={props.attr}
                value={props.Atk}

                onChange={props.onChange}
                options={props.options}
            />
            <SingleSelect
                name="DefStage"
                attr={props.attr}
                value={props.Def}
                onChange={props.onChange}
                options={props.options}
            />
        </div>
    )
});






export default Stages;