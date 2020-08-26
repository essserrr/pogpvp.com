import React from "react"

import UserShinyCard from "../../../../Userpage/UserShinyBroker/UserShinyList/UserShinyCard/UserShinyCard"

import "./UserCardDetails.scss"

class UserCardDetails extends React.PureComponent {
    render() {
        return (
            <div className={"row text-left m-0 mb-2"}>
                <div className="col-12 py-1 px-0">
                    <div className="row mx-0 align-items-center">
                        <span className="user-card-details--label mr-1">Contact details: </span>{this.props.value.Broker.Contacts}
                    </div>
                </div>
                <div className="col-12 py-1 px-0">
                    <div className="row mx-0 align-items-center">
                        <span className="user-card-details--label">Has pokemon: </span>
                        {Object.values(this.props.value.Broker.Have).map((value) =>
                            <UserShinyCard pokemonTable={this.props.pokemonTable} value={value} attr="have" key={`outerHave${value.Name}`} />)}
                    </div>
                </div>
                <div className="col-12 py-1 px-0">
                    <div className="row mx-0 align-items-center">
                        <span className="user-card-details--label">Wants pokemon: </span>
                        {Object.values(this.props.value.Broker.Want).map((value) =>
                            <UserShinyCard pokemonTable={this.props.pokemonTable} value={value} attr="want" key={`outerWant${value.Name}`} />)}
                    </div>
                </div>
            </div>
        );
    }
}


export default UserCardDetails