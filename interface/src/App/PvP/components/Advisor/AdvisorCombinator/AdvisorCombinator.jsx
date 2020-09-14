import React from "react"

import TableBodyRender from "./TableBodyRender/TableBodyRender"

class AdvisorCombinator extends React.PureComponent {

    makeCombinations() {
        let rateList = this.props.leftPanel.listForBattle.map((elem, i) => {
            let j = this.props.rightPanel.listForBattle.length * i
            let maxj = j + this.props.rightPanel.listForBattle.length
            let singleRate = 0
            let zeros = {}

            for (; j < maxj; j++) {
                singleRate += this.props.pvpData[0][j].Rate
                if (this.props.pvpData[0][j].Rate <= 500) {
                    zeros[this.props.pvpData[0][j].K] = true
                }
            }
            return { rate: singleRate / this.props.rightPanel.listForBattle.length, zeros: zeros }
        });

        let parties = []

        for (let i = 0; i < this.props.leftPanel.listForBattle.length; i++) {
            for (let j = i + 1; j < this.props.leftPanel.listForBattle.length; j++) {
                for (let k = j + 1; k < this.props.leftPanel.listForBattle.length; k++) {
                    parties.push({
                        first: i, second: j, third: k,
                        rate: rateList[i].rate + rateList[j].rate + rateList[k].rate,
                        zeros: this.countWeakSpots(rateList[i].zeros, rateList[j].zeros, rateList[k].zeros)
                    })
                }
            }
        }
        return parties
    }

    countWeakSpots(objA, objB, objC) {
        let counter = []
        for (const [key, value] of Object.entries(objA)) {
            if (value && objB[key] && objC[key]) {
                counter.push(key)
            }
        }
        return counter
    }

    render() {
        return (
            <TableBodyRender
                list={this.makeCombinations()}

                pvpData={this.props.pvpData}
                pvpoke={this.props.pvpoke}
                league={this.props.league}
                isTriple={this.props.isTriple}

                pokemonTable={this.props.pokemonTable}
                moveTable={this.props.moveTable}

                leftPanel={this.props.leftPanel}
                rightPanel={this.props.rightPanel}
            />
        );
    }
};

export default AdvisorCombinator;
