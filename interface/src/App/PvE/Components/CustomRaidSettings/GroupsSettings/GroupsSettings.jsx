import React from "react"

import CustomPvePlayer from "./CustomPvePlayer/CustomPvePlayer"

class GroupsSettings extends React.PureComponent {
    render() {
        return (
            <div className="row m-0 align-itmes-center justify-conten-center">
                <div className="col-12 px-0 my-1">
                    {this.props.value.map((player, playerNumber) =>
                        <CustomPvePlayer
                            playerNumber={playerNumber}
                            group1={player[0]} group2={player[1]} group3={player[2]}
                            userParties={this.props.userParties} onChange={this.props.onChange}
                        />
                    )}
                </div>
            </div>
        )
    }

}


export default GroupsSettings