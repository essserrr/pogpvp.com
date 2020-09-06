import React from "react"
import LocalizedStrings from "react-localization"

import SelectGroup from "../../../../PvP/components/SelectGroup/SelectGroup"
import Checkbox from "../../../../RaidsList/Checkbox/Checkbox"

import { pveLocale } from "../../../../../locale/pveLocale"
import { getCookie } from "../../../../../js/getCookie"

let strings = new LocalizedStrings(pveLocale);

class CollectionSettings extends React.PureComponent {
    constructor(props) {
        super(props);
        this.pveres = React.createRef();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }


    render() {
        return (
            <div className="row m-0 py-1 align-itmes-center justify-conten-center">
                <div className="col-6 px-0 pr-1 ">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="SortByDamage"
                        value={this.props.value}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={<>
                            <option value="true" key="0">{strings.customsort.dmg}</option>
                            <option value="false" key="1">{strings.customsort.dps}</option>
                        </>}

                        labelWidth="89px"
                        label={strings.aggreasive}

                        for={""}
                    />
                </div>
                <Checkbox
                    class={"form-check form-check-inline m-0 p-0 pl-1"}
                    checked={this.props.settingsValue.SupportSlotEnabled !== "false" ? "checked" : false}
                    attr={"pveObj"}
                    name={"SupportSlotEnabled"}
                    label={
                        <div className=" text-center">
                            {strings.supen}
                        </div>
                    }
                    onChange={this.props.onChange}
                />
            </div>
        )
    }

}


export default CollectionSettings