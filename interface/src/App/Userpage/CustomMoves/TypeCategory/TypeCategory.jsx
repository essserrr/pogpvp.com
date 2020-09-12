import React from "react"
import LocalizedStrings from "react-localization"

import SelectGroup from "../../../PvP/components/SelectGroup/SelectGroup"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale)

class TypeCategory extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <>
                <div className="col-12 col-md-6 px-1">
                    <SelectGroup
                        labelWidth="125px"
                        label={strings.moveconstr.category}

                        attr={""}
                        name="MoveCategory"

                        options={<>
                            <option value="Fast Move" >{strings.moveconstr.catopt.q}</option>
                            <option value="Charge Move" >{strings.moveconstr.catopt.ch}</option>
                        </>}
                        value={this.props.moveCategory}

                        onChange={this.props.onChange}

                        for={""}
                    />
                </div>
                <div className="col-12 col-md-6 px-1">
                    <SelectGroup
                        labelWidth="125px"
                        label={strings.moveconstr.type}

                        attr={""}
                        name="MoveType"

                        options={<>
                            <option value="0" >Bug</option>
                            <option value="1" >Dark</option>
                            <option value="2" >Dragon</option>
                            <option value="3" >Electric</option>
                            <option value="4" >Fairy</option>
                            <option value="5" >Fighting</option>
                            <option value="6" >Fire</option>
                            <option value="7" >Flying</option>
                            <option value="8" >Ghost</option>
                            <option value="9" >Grass</option>
                            <option value="10" >Ground</option>
                            <option value="11" >Ice</option>
                            <option value="12" >Normal</option>
                            <option value="13" >Poison</option>
                            <option value="14" >Psychic</option>
                            <option value="15" >Rock</option>
                            <option value="16" >Steel</option>
                            <option value="17" >Water</option>
                        </>}


                        value={this.props.moveType}

                        onChange={this.props.onChange}

                        for={""}
                    />
                </div>
            </>
        );
    }
}

export default TypeCategory
