import React from "react"
import StatisticsSet from "./StatisticsSet/StatisticsSet"

import "./PlayerResEntry.scss"

class PlayerResEntry extends React.PureComponent {

    render() {
        return (
            <div className="player-res-entr row mx-0 py-1 my-1 px-2">
                <div className="col-12 px-0">
                    <StatisticsSet
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


export default PlayerResEntry;