import React from "react";
import PropTypes from 'prop-types';

import AdvisorSort from "./AdvisorSort/AdvisorSort";

const AdvisorPages = function AdvisorPages(props) {
    const upperBound = props.children.length >= props.n * 50 ? props.n * 50 : props.children.length;
    return (
        <AdvisorSort
            leftPanel={props.leftPanel}
            rightPanel={props.rightPanel}
            moveTable={props.moveTable}
            pokemonTable={props.pokemonTable}

            rawResult={props.rawResult}
            filter={props.filter}
            list={props.children.slice(0, upperBound)}
        />
    )
};

export default AdvisorPages;

AdvisorPages.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    n: PropTypes.number,

    leftPanel: PropTypes.object,
    rightPanel: PropTypes.object,

    moveTable: PropTypes.object,
    pokemonTable: PropTypes.object,

    rawResult: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),
    filter: PropTypes.string,
};