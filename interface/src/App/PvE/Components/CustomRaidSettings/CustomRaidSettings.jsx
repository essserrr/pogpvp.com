import React from "react"
import LocalizedStrings from "react-localization"

import CollectionSettings from "./CollectionSettings/CollectionSettings"
import DoubleSlider from "../../../Movedex/DoubleSlider/DoubleSlider"

import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie } from "../../../../js/getCookie"


let pvestrings = new LocalizedStrings(pveLocale);

class CustomRaidSettings extends React.PureComponent {
    constructor(props) {
        super(props);
        pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
        };
    }


    render() {
        return (

            <div className="row m-0 justify-content-center p-2">
                {this.props.title && <div className="col-12 px-0 text-center my-1"><h5 className="fBolder m-0 p-0">{this.props.title}</h5></div>}
                <div className="col-12 mb-1 px-3">
                    <DoubleSlider
                        onClick={this.props.onChange}

                        attr1="userCollection"
                        title1={pvestrings.selfFromColl}
                        active1={this.props.value.FindInCollection}

                        attr2="userGroups"
                        title2={pvestrings.selfFromGtoup}
                        active2={!this.props.value.FindInCollection}
                    />
                </div>

                {this.props.value.FindInCollection && <CollectionSettings
                    settingsValue={this.props.settingsValue}
                    onChange={this.props.onChange}
                />}
            </div>
        )
    }

}


export default CustomRaidSettings