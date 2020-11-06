import React from "react";
import propTypes from 'prop-types';

import ShinyTableSort from "./ShinyTableSort/ShinyTableSort";

const ShinyTableFilter = React.memo(function ShinyTableFilter(props) {
    return (
        <ShinyTableSort
            filter={props.filter}
            pokTable={props.pokTable}

            onClick={props.onClick}
        >
            {Object.entries(props.children).filter(element =>
                element[0].toLowerCase().indexOf(props.value.toLowerCase()) !== -1)}
        </ShinyTableSort>
    )
});

export default ShinyTableFilter;

ShinyTableFilter.propTypes = {
    filter: propTypes.object.isRequired,
    pokTable: propTypes.object.isRequired,

    onClick: propTypes.func,

    children: propTypes.object,
};


