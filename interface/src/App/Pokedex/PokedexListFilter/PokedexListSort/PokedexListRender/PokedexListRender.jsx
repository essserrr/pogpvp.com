import React from "react";
import PropTypes from 'prop-types';

import LazyTable from "./LazyTable/LazyTable";
import PokeRow from "./PokeRow/PokeRow";
import TableHead from "./TableHead/TableHead";

import { calculateCP } from "js/cp/calculateCP";

const maxLevel = 40;

const PokedexListRender = function PokedexListRender(props) {
    return (
        <LazyTable
            head={<TableHead active={props.sort} onClick={props.onClick} />}
            activeFilter={props.sort}
            elementsOnPage={40}
        >
            {props.children.map((value) => {
                value[1].CP = calculateCP(value[1].Title, maxLevel, 15, 15, 15, props.pokTable)
                return <PokeRow key={value[0]} value={value[1]} />
            })}
        </LazyTable>
    )
};

export default PokedexListRender;

PokedexListRender.propTypes = {
    children: PropTypes.array,
    pokTable: PropTypes.object,
    sort: PropTypes.object,
    onClick: PropTypes.func,
};