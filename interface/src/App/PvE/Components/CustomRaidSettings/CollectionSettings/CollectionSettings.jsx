import React from "react"
import LocalizedStrings from "react-localization"

import Checkbox from "../../../../RaidsList/Checkbox/Checkbox"

import { pveLocale } from "../../../../../locale/pveLocale"
import { getCookie } from "../../../../../js/getCookie"

let pvestrings = new LocalizedStrings(pveLocale);

class CollectionSettings extends React.PureComponent {
    constructor(props) {
        super(props);
        this.pveres = React.createRef();
        pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
        };
    }


    render() {
        return (

            <div className="row m-0 justify-content-center p-2">
                <Checkbox
                    class={"form-check form-check-inline m-0 p-0"}
                    checked={this.props.settingsValue.SupportSlotEnabled !== "false" ? "checked" : false}
                    attr={"pveObj"}
                    name={"SupportSlotEnabled"}
                    label={
                        <div className=" text-center">
                            {pvestrings.supen}
                        </div>
                    }
                    onChange={this.props.onChange}
                />
            </div>
        )
    }

}


export default CollectionSettings