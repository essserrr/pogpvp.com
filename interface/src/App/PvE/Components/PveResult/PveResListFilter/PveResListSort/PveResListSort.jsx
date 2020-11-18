import React from "react";
import PropTypes from 'prop-types';

import PveResListRender from "./PveResListRender/PveResListRender";

const PveResListSort = React.memo(function PveResListSort(props) {
    const { needsAvg, sort, children, ...other } = props;

    const sortByDamage = () => {
        return children.sort((a, b) => {
            let sumDamageA = 0
            let sumDamageB = 0
            a.Result.forEach((elem) => { sumDamageA += elem.DAvg })
            b.Result.forEach((elem) => { sumDamageB += elem.DAvg })
            return sumDamageB - sumDamageA
        })
    }

    const sortByDps = (timer) => {
        return children.sort((a, b) => {
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

    return (
        <PveResListRender {...other}>
            {needsAvg ?
                children
                :
                sort === "dps" ? sortByDps(props.snapshot.bossObj.Tier > 3 ? 300 : 180,) : sortByDamage()}
        </PveResListRender>
    )
});

export default PveResListSort;

PveResListSort.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),

    needsAvg: PropTypes.bool,
    n: PropTypes.number,
    customResult: PropTypes.bool,

    snapshot: PropTypes.object,
    tables: PropTypes.object,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,

    sort: PropTypes.string,

    showBreakpoints: PropTypes.func,
    loadMore: PropTypes.func,
};