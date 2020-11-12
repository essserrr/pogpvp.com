import React from "react"

import CustomPvePlayer from "./CustomPvePlayer/CustomPvePlayer"
import AddRow from "./AddRow/AddRow"

class GroupsSettings extends React.PureComponent {
    render() {
        return (
            <div className="row m-0 align-items-center justify-content-center">
                <div className="col-12 px-0">
                    {this.props.value.map((player, playerNumber) =>
                        <div className="col-12 px-0 pt-2" key={playerNumber}>
                            <CustomPvePlayer
                                playerNumber={playerNumber}
                                group1={player[0]} group2={player[1]} group3={player[2]}
                                userParties={this.props.userParties} onChange={this.props.onChange}
                            />
                        </div>
                    )}
                </div>
                {this.props.value.length < 5 &&
                    <div className="col-12 px-0 mt-3">
                        <AddRow
                            name="addPlayer"
                            onClick={this.props.onChange}
                        />
                    </div>}
            </div>
        )
    }

}


export default GroupsSettings