import React from "react"

import HpBar from "../PhBar/HpBar"
import HpRemaining from "../HpRemaining/HpRemaining"
import FightStats from "../FightStats/FightStats"
import PlayersImpact from "../PlayersImpact/PlayersImpact"

class PlayerStatistics extends React.PureComponent {
    render() {
        return (
            <div className="row mx-0 justify-content-between">
                <div className="col-12 px-0">
                    <HpBar
                        {...this.props.bounds}
                    />
                </div>
                <div className="col-12 px-0">
                    <HpRemaining
                        {...this.props.remain}
                    />
                </div>
                <div className="col px-0">
                    <FightStats
                        {...this.props.stats}
                    />
                    {this.props.impact && this.props.impact.length > 0 &&
                        <PlayersImpact
                            impact={this.props.impact}
                            bossHP={this.props.bossHP}
                        />}
                </div>

                {!this.props.disableCollapse && <div onClick={this.props.onClick} className="clickable align-self-end ">
                    <i className={this.props.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg"}></i>
                </div>}
            </div>
        );
    }
};

export default PlayerStatistics;


