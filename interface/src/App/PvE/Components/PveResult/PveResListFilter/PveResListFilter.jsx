import React from "react";
import PropTypes from 'prop-types';

import PveResListSort from "./PveResListSort/PveResListSort";

const PveResListFilter = React.memo(function PveResListFilter(props) {
    const { filter, children, ...other } = props;

    const applyUniqueFilter = () => {
        let list = {}
        return children.filter(elem => {
            const lastPokIndex = elem.Party.length - 1
            //check entry in local dict
            switch (list[`${elem.Party[lastPokIndex].Name}${String(elem.Party[lastPokIndex].IsShadow)}`]) {
                case true:
                    //if it exists, exclude pokemon
                    return false
                default:
                    //if it not exists, include it in both result and dict
                    list[`${elem.Party[lastPokIndex].Name}${String(elem.Party[lastPokIndex].IsShadow)}`] = true
                    return true
            }
        })
    }

    return (
        <PveResListSort {...other}>
            {filter.unique ? applyUniqueFilter() : children}
        </PveResListSort>
    )
});

export default PveResListFilter;

PveResListFilter.propTypes = {
    needsAvg: PropTypes.bool,
    n: PropTypes.number,
    customResult: PropTypes.bool,

    snapshot: PropTypes.object,
    tables: PropTypes.object,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,

    filter: PropTypes.object,
    sort: PropTypes.string,

    showBreakpoints: PropTypes.func,
    loadMore: PropTypes.func,
};