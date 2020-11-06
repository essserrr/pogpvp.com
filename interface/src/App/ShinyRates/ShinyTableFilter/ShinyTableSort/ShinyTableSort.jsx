import React from "react";
import propTypes from 'prop-types';

import ShinyTable from "../../ShinyTable/ShinyTable";

const ShinyTableSort = React.memo(function ShinyTableSort(props) {

    const sortNumber = () => {
        switch (props.filter.order) {
            case true:
                return props.children.sort((a, b) => { return a[1][props.filter.field] - b[1][props.filter.field] })
            default:
                return props.children.sort((a, b) => { return b[1][props.filter.field] - a[1][props.filter.field] })
        }
    }

    const sortString = () => {
        switch (props.filter.order) {
            case true:
                return props.children.sort((a, b) => {
                    if (a[1][props.filter.field] < b[1][props.filter.field]) { return -1; }
                    if (b[1][props.filter.field] < a[1][props.filter.field]) { return 1; }
                    return 0;
                })
            default:
                return props.children.sort((a, b) => {
                    if (a[1][props.filter.field] > b[1][props.filter.field]) { return -1; }
                    if (b[1][props.filter.field] > a[1][props.filter.field]) { return 1; }
                    return 0;
                })
        }
    }

    return (
        <ShinyTable
            onClick={props.onClick}
            active={props.filter}
            pokTable={props.pokTable}
        >
            {props.filter.type === "number" ? sortNumber() : sortString()}
        </ShinyTable>
    )
});

export default ShinyTableSort;

ShinyTableSort.propTypes = {
    filter: propTypes.object.isRequired,
    pokTable: propTypes.object.isRequired,

    onClick: propTypes.func,

    children: propTypes.arrayOf(propTypes.array),
};

