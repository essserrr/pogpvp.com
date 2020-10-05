import React from "react"

import PveResultFullStatistics from "../../../../PveResListFilter/PveResListSort/PveResListRender/PveResEntry/PveResultFullStatistics/PveResultFullStatistics"

class AvgResult extends React.PureComponent {

    render() {
        const bossHP = this.props.tables.hp[this.props.snapshot.bossObj.Tier]

        return (
            <div className="row mx-0">
                <div className="col-12 px-0">
                    {this.props.title}
                </div>
                <div className="col-12 px-0">
                    <PveResultFullStatistics
                        bounds={{
                            up: ((bossHP - this.props.value.dmg) / bossHP * 100).toFixed(1),
                            low: ((bossHP - this.props.value.dmg) / bossHP * 100).toFixed(1),
                            avg: ((bossHP - this.props.value.dmg) / bossHP * 100).toFixed(1),

                        }}

                        remain={{
                            avg: (bossHP - this.props.value.dmg).toFixed(0),
                            nbOfWins: 0,
                        }}


                        stats={{}}

                        onClick={this.onClick}
                        showCollapse={false}

                    />
                </div>
            </div>
        )
    }

}



export default AvgResult;