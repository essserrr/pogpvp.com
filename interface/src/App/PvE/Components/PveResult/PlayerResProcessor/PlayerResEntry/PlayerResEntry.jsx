import React from "react"
import { UnmountClosed } from "react-collapse"

import StatisticsSet from "./StatisticsSet/StatisticsSet"
import DetailedStatisticsGenerator from "./DetailedStatisticsGenerator/DetailedStatisticsGenerator"

import "./PlayerResEntry.scss"

class PlayerResEntry extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showCollapse: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
        })
    }

    render() {
        return (
            <div className="player-res-entr row mx-0 py-1 my-1 px-2">
                <div className="col-12 px-0">
                    <StatisticsSet
                        tables={this.props.tables}
                        snapshot={this.props.snapshot}
                        value={this.props.value.overall}
                        disabled={{ avg: true, max: true, min: false, }}

                        onClick={this.onClick}
                        showCollapse={this.state.showCollapse}
                    />
                </div>
                <UnmountClosed isOpened={this.state.showCollapse}>
                    <div className="player-res-entr__separator col-12 px-0 pt-3">
                        <DetailedStatisticsGenerator
                            tables={this.props.tables}
                            moveTable={this.props.moveTable}
                            snapshot={this.props.snapshot}
                            value={this.props.value.detailed}
                        />
                    </div>
                </UnmountClosed>
            </div>
        )
    }

}


export default PlayerResEntry;
