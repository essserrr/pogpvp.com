import React from "react"
import LocalizedStrings from "react-localization"

import UserShinyCard from "../../../../Userpage/UserShinyBroker/UserShinyList/UserShinyCard/UserShinyCard"

import { getCookie } from "../../../../../js/getCookie"
import { userLocale } from "../../../../../locale/userLocale"

import "./UserCardDetails.scss"

let strings = new LocalizedStrings(userLocale)

class UserCardDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className={"row text-left m-0 mb-2"}>
                <div className="col-12 py-1 px-0">
                    <div className="row mx-0 align-items-center">
                        <span className="user-card-details--label mr-1">{strings.shbroker.int.detcont}</span>{this.props.value.Broker.Contacts}
                    </div>
                </div>
                <div className="col-12 py-1 px-0">
                    <div className="row mx-0 align-items-center">
                        <span className="user-card-details--label">{strings.shbroker.int.dethave}</span>
                        {this.props.value.Broker.Have && Object.values(this.props.value.Broker.Have).map((value) =>
                            <UserShinyCard pokemonTable={this.props.pokemonTable} value={value} attr="have" key={`outerHave${value.Name}`} />)}
                    </div>
                </div>
                <div className="col-12 py-1 px-0">
                    <div className="row mx-0 align-items-center">
                        <span className="user-card-details--label">{strings.shbroker.int.detwant}</span>
                        {this.props.value.Broker.Want && Object.values(this.props.value.Broker.Want).map((value) =>
                            <UserShinyCard pokemonTable={this.props.pokemonTable} value={value} attr="want" key={`outerWant${value.Name}`} />)}
                    </div>
                </div>
            </div>
        );
    }
}


export default UserCardDetails