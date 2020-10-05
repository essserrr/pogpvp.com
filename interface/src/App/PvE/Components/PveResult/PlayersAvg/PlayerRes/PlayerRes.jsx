import React from "react"
import PlayerResEntry from "./PlayerResEntry/PlayerResEntry"

class PlayerRes extends React.PureComponent {

    render() {
        return (
            <div className="row mx-0">
                <div className="col-12 px-0">
                    <PlayerResEntry
                        {...this.props}
                        value={this.props.value.overall}
                    />
                </div>
                <div className="col-12 px-0">
                </div>
            </div>
        )
    }

}


export default PlayerRes;