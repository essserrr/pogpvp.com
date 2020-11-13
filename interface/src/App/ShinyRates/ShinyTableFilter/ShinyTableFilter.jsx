import React from "react";
import PropTypes from 'prop-types';

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
    filter: PropTypes.object.isRequired,
    pokTable: PropTypes.object.isRequired,

    onClick: PropTypes.func,

    children: PropTypes.object,
};


