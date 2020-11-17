import React from "react";
import PropTypes from 'prop-types';

import AdvisorRender from "./AdvisorRender/AdvisorRender";

const AdvisorSort = React.memo(function AdvisorSort(props) {

    const sortList = () => {
        switch (props.filter) {
            case "rating":
                return props.children.sort((a, b) => {
                    if (a.rate === b.rate) { return a.zeros.length - b.zeros.length }
                    return b.rate - a.rate
                });
            default:
                return props.children.sort((a, b) => {
                    if (a.zeros.length === b.zeros.length) { return b.rate - a.rate }
                    return a.zeros.length - b.zeros.length
                });
        }
    }

    return (
        <AdvisorRender
            leftPanel={props.leftPanel}
            rightPanel={props.rightPanel}
            moveTable={props.moveTable}
            pokemonTable={props.pokemonTable}

            rawResult={props.rawResult}
        >
            {sortList()}
        </AdvisorRender>
    )
});

export default AdvisorSort;


AdvisorSort.propTypes = {
    leftPanel: PropTypes.object,
    rightPanel: PropTypes.object,

    moveTable: PropTypes.object,
    pokemonTable: PropTypes.object,

    rawResult: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),
    filter: PropTypes.string,

    children: PropTypes.arrayOf(PropTypes.object),
};