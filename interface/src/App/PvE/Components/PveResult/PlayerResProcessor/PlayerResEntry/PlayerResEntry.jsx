import React from "react"
import StatisticsSet from "./StatisticsSet/StatisticsSet"
import DetailedStatisticsGenerator from "./DetailedStatisticsGenerator/DetailedStatisticsGenerator"

import "./PlayerResEntry.scss"

class PlayerResEntry extends React.PureComponent {

    render() {
        console.log(this.props)
        return (
            <div className="player-res-entr row mx-0 py-1 my-1 px-2">
                <div className="col-12 px-0">
                    <StatisticsSet
                        tables={this.props.tables}
                        snapshot={this.props.snapshot}
                        value={this.props.value.overall}
                    />
                </div>
                <div className="col-12 px-0 mt-4">
                    <DetailedStatisticsGenerator
                        {...this.props}
                        value={this.props.value.detailed}
                    />
                </div>
            </div>
        )
    }

}


export default PlayerResEntry;