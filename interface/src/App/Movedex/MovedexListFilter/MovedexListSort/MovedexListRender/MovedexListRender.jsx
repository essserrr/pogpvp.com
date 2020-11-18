import React from "react";
import PropTypes from 'prop-types';

import LazyTable from "App/Pokedex/PokedexListFilter/PokedexListSort/PokedexListRender/LazyTable/LazyTable";
import MoveRow from "./MoveRow/MoveRow";
import TableHead from "./TableHead/TableHead";

const MovedexListRender = function MovedexListRender(props) {
    return (
        <LazyTable
            head={<TableHead active={props.sort} onClick={props.onClick} />}
            activeFilter={props.sort}
            elementsOnPage={40}
        >
            {props.children.map(value => <MoveRow key={value[0]} value={value[1]} />)}
        </LazyTable>
    )
};

export default MovedexListRender;

MovedexListRender.propTypes = {
    children: PropTypes.array,

    sort: PropTypes.object,
    onClick: PropTypes.func,
};