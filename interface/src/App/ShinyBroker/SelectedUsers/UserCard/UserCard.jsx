import React from "react"
import { UnmountClosed } from "react-collapse"
import UserCardDetails from "./UserCardDetails/UserCardDetails"

import "./UserCard.scss"

class UserCard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showCollapse: true,
            element: <UserCardDetails
                value={this.props.value}
                pokemonTable={this.props.pokemonTable}
            />,

        }
        this.onClick = this.onClick.bind(this)
    }


    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
            element: <UserCardDetails
                value={this.props.value}
                pokemonTable={this.props.pokemonTable}
            />,
        })
    }

    render() {

        return (
            <div className="usercard-broker row mx-0 px-2 align-items-center justify-content-between text-center">
                <div className="usercard-broker__line col-2 py-1 px-1 text-left">{this.props.value.Username}</div>
                <div className="usercard-broker__line col-3 px-1">{this.props.value.Broker.Country}</div>
                <div className="usercard-broker__line col-2 px-1">{this.props.value.Broker.Region}</div>
                <div className="usercard-broker__line col-2 px-1">{this.props.value.Broker.City}</div>
                <div className="usercard-broker__line col-1 px-1">{Object.values(this.props.value.Broker.Have).length}</div>
                <div className="usercard-broker__line col-1 px-1">{Object.values(this.props.value.Broker.Want).length}</div>


                <div className="usercard-broker__line col-1 px-1">
                    <div onClick={this.onClick} className={"row justify-content-end mx-4 pb-1 clickable"}>
                        <i className={this.state.showCollapse ? "align-self-center fas fa-angle-up fa-lg " : "align-self-center fas fa-angle-down fa-lg"}></i>
                    </div>
                </div>

                <div className="col-12 px-1">
                    <UnmountClosed isOpened={this.state.showCollapse}>
                        {this.state.element}
                    </UnmountClosed>
                </div>

            </div>
        );
    }
}


export default UserCard