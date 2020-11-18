import React from "react";
import PropTypes from 'prop-types';

import TableBodyRender from "../../TableBodyRender/TableBodyRender";

const AdvisorCombinator = React.memo(function AdvisorCombinator(props) {

    const makeCombinations = () => {
        let rateList = props.leftPanel.listForBattle.map((elem, i) => {
            let j = props.rightPanel.listForBattle.length * i
            let maxj = j + props.rightPanel.listForBattle.length
            let avgRateSum = 0
            let zeros = {}

            for (; j < maxj; j++) {
                //increase sum
                avgRateSum += props.pvpData[0][j].Rate
                //if 2 matchups are bad then it is a lose
                //if pvp is triple we start from 0 loses, other wise from one
                let loses = props.pvpData.length > 1 ? 0 : 1
                //if pvp is triple, we skip 0 entry
                let from = props.pvpData.length > 1 ? 1 : 0
                for (let shieldComb = from; shieldComb < props.pvpData.length; shieldComb++) { if (props.pvpData[shieldComb][j].Rate <= 500) { loses++ } }
                if (loses >= 2) { zeros[props.pvpData[0][j].K] = true }
            }
            return { rate: avgRateSum / props.rightPanel.listForBattle.length, zeros: zeros }
        });

        let parties = []

        for (let i = 0; i < props.leftPanel.listForBattle.length; i++) {
            for (let j = i + 1; j < props.leftPanel.listForBattle.length; j++) {
                for (let k = j + 1; k < props.leftPanel.listForBattle.length; k++) {
                    parties.push({
                        first: i, second: j, third: k,
                        rate: rateList[i].rate + rateList[j].rate + rateList[k].rate,
                        zeros: countWeakSpots(rateList[i].zeros, rateList[j].zeros, rateList[k].zeros)
                    })
                }
            }
        }
        return parties
    }

    const countWeakSpots = (objA, objB, objC) => {
        let counter = []
        for (const [key, value] of Object.entries(objA)) {
            if (value && objB[key] && objC[key]) {
                counter.push(key)
            }
        }
        return counter
    }

    return (
        <TableBodyRender
            list={makeCombinations()}
            isAdvisor={true}

            pvpData={props.pvpData}
            pvpoke={props.pvpoke}
            league={props.league}
            isTriple={props.isTriple}

            pokemonTable={props.pokemonTable}
            moveTable={props.moveTable}

            leftPanel={props.leftPanel}
            rightPanel={props.rightPanel}
        />
    )
});

export default AdvisorCombinator;


AdvisorCombinator.propTypes = {
    pvpData: PropTypes.array,
    pvpok: PropTypes.bool,

    isTriple: PropTypes.bool,

    league: PropTypes.string,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,

    leftPanel: PropTypes.object,
    rightPanel: PropTypes.object,
};
