import React from "react"

import PveResListRender from "./PveResListRender/PveResListRender"

class PveResListSort extends React.Component {

    sortByDamage() {
        return this.props.list.sort((a, b) => {
            let sumDamageA = 0
            let sumDamageB = 0
            a.Result.forEach((elem) => { sumDamageA += elem.DAvg })
            b.Result.forEach((elem) => { sumDamageB += elem.DAvg })
            return sumDamageB - sumDamageA
        })
    }

    sortByDps(timer) {
        return this.props.list.sort((a, b) => {
            let sumDamageA = 0
            let sumDamageB = 0

            let timerA = 0
            let timerB = 0

            a.Result.forEach((elem) => {
                sumDamageA += elem.DAvg
                timerA += elem.TAvg
            })
            b.Result.forEach((elem) => {
                sumDamageB += elem.DAvg
                timerB += elem.TAvg
            })

            let dpsA = (sumDamageA / a.Result.length / (timer - timerA / a.Result.length / 1000)).toFixed(1)
            let dpsB = (sumDamageB / b.Result.length / (timer - timerB / b.Result.length / 1000)).toFixed(1)

            if (dpsB - dpsA === 0) { return sumDamageB - sumDamageA }
            return dpsB - dpsA
        })
    }


    render() {
        let list = []
        switch (this.props.needsAvg) {
            case true:
                list = this.props.list
                break
            default:
                list = this.props.sort === "dps" ? this.sortByDps(this.props.snapshot.bossObj.Tier > 3 ? 300 : 180,) : this.sortByDamage()
        }

        return (
            <PveResListRender
                n={this.props.n}
                customResult={this.props.customResult}

                snapshot={this.props.snapshot}
                tables={this.props.tables}

                pokemonTable={this.props.pokemonTable}
                moveTable={this.props.moveTable}
                pokList={this.props.pokList}
                chargeMoveList={this.props.chargeMoveList}
                quickMoveList={this.props.quickMoveList}

                showBreakpoints={this.props.showBreakpoints}
                loadMore={this.props.loadMore}

                list={list}
            />
        );
    }
}

export default PveResListSort