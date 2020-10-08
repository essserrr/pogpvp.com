import React from "react"

import PlayerStatistics from "../../../../PveResListFilter/PveResListSort/PveResListRender/PveResEntry/PlayerStatistics/PlayerStatistics"

import "./PlayerStatisticsWrapper.scss"

class PlayerStatisticsWrapper extends React.PureComponent {

    render() {
        const bossHP = this.props.tables.hp[this.props.snapshot.bossObj.Tier]
        return (
            <div className="row mx-0">
                {this.props.title && <div className="pl-stat-wrapper__title col-12 px-0">
                    {this.props.title}
                </div>}
                <div className="col-12 px-0">
                    <PlayerStatistics
                        bounds={{
                            up: ((bossHP - this.props.value.dAvg) / bossHP * 100).toFixed(1),
                            low: ((bossHP - this.props.value.dAvg) / bossHP * 100).toFixed(1),
                            avg: ((bossHP - this.props.value.dAvg) / bossHP * 100).toFixed(1),

                        }}

                        remain={{
                            avg: (bossHP - this.props.value.dAvg).toFixed(0),
                            nbOfWins: (this.props.value.nbOfWins),
                        }}


                        stats={{ ...this.props.value, dAvg: (this.props.value.dAvg / bossHP * 100).toFixed(1) }}

                        onClick={this.onClick}
                        showCollapse={false}
                        disableCollapse={this.props.disableCollapse}
                    />
                </div>
            </div>
        )
    }

}



export default PlayerStatisticsWrapper;