import React from "react"
import LocalizedStrings from "react-localization"
import { UnmountClosed } from "react-collapse"

import GroupsSettings from "./GroupsSettings/GroupsSettings"
import CollectionSettings from "./CollectionSettings/CollectionSettings"
import DoubleSlider from "../../../Movedex/DoubleSlider/DoubleSlider"

import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie } from "../../../../js/getCookie"


let pveStrings = new LocalizedStrings(pveLocale);

class CustomRaidSettings extends React.PureComponent {
    constructor(props) {
        super();
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }


    render() {
        return (

            <div className="row m-0 justify-content-center px-1">
                {this.props.title && <div className="col-12 px-0 text-center my-1"><h5 className="fBolder m-0 p-0">{this.props.title}</h5></div>}

                <div className="col-12 px-0">
                    <DoubleSlider
                        onClick={this.props.onChange}

                        attr1="userCollection"
                        title1={pveStrings.selfFromColl}
                        active1={this.props.value.FindInCollection}

                        attr2="userGroups"
                        title2={pveStrings.selfFromGtoup}
                        active2={!this.props.value.FindInCollection}
                    />
                </div>

                <div className="col-12 px-0">
                    <UnmountClosed isOpened={this.props.value.FindInCollection}>
                        <div className="col-12 px-0 mt-2">
                            <CollectionSettings
                                attr={this.props.attr}

                                value={this.props.value.SortByDamage}
                                settingsValue={this.props.settingsValue}

                                onChange={this.props.onChange}
                            />
                        </div>
                    </UnmountClosed>
                </div>

                <div className="col-12 px-0">
                    <UnmountClosed isOpened={!this.props.value.FindInCollection}>
                        <div className="col-12 px-0">
                            <GroupsSettings
                                attr={this.props.attr}

                                userParties={this.props.userParties}
                                value={this.props.value.UserPlayers}

                                onChange={this.props.onChange}
                            />
                        </div>
                    </UnmountClosed>
                </div>
            </div>
        )
    }

}


export default CustomRaidSettings