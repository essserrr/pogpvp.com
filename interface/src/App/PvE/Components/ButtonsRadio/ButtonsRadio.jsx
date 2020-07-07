import React, { PureComponent } from "react";
import SingleButton from "./SingleButton"

import LocalizedStrings from "react-localization";
import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie } from "../../../../js/indexFunctions"

let pvestrings = new LocalizedStrings(pveLocale);

class ButtonsRadio extends PureComponent {
    constructor(props) {
        super(props);
        pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }


    render() {
        return (
            <div className={this.props.class} data-toggle="buttons">
                <SingleButton
                    name="damage"
                    label={pvestrings.damage}
                    id="damage"
                    class="raidButton"

                    checked={this.props.param === "damage"}
                    onChange={this.props.onChange}
                />
                <SingleButton
                    name="dps"
                    label={"DPS"}
                    id="dps"
                    class="raidButton"

                    checked={this.props.param === "dps"}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}

export default ButtonsRadio;
