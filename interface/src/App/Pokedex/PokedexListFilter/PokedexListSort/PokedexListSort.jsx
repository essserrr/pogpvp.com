import React from "react";
import PropTypes from 'prop-types';

import PokedexListRender from "./PokedexListRender/PokedexListRender";

const PokedexListSort = React.memo(function PokedexListSort(props) {
    const { sort, children, ...other } = props

    const sortNumber = () => {
        switch (sort.order) {
            case true:
                return props.children.sort((a, b) => {
                    return b[1][sort.field] - a[1][sort.field]
                })
            default:
                return props.children.sort((a, b) => {
                    return a[1][sort.field] - b[1][sort.field]
                })
        }
    }

    const sortString = () => {
        switch (sort.order) {
            case true:
                return props.children.sort((a, b) => {
                    if (a[1][sort.field] > b[1][sort.field]) { return -1; }
                    if (b[1][sort.field] > a[1][sort.field]) { return 1; }
                    return 0;
                })
            default:
                return props.children.sort((a, b) => {
                    if (a[1][sort.field] < b[1][sort.field]) { return -1; }
                    if (b[1][sort.field] < a[1][sort.field]) { return 1; }
                    return 0;
                })
        }
    }


    const sortTypeArr = () => {
        switch (sort.order) {
            case true:
                return props.children.sort((a, b) => {
                    if (b[1][sort.field][0] === a[1][sort.field][0]) {
                        if (b[1][sort.field].length > 1 && a[1][sort.field].length > 1) { return b[1][sort.field][1] - a[1][sort.field][1]; }
                        if (b[1][sort.field].length > 1) { return 1 }
                        return -1
                    }
                    return b[1][sort.field][0] - a[1][sort.field][0];
                })
            default:
                return props.children.sort((a, b) => {
                    if (b[1][sort.field][0] === a[1][sort.field][0]) {
                        if (b[1][sort.field].length > 1 && a[1][sort.field].length > 1) { return a[1][sort.field][1] - b[1][sort.field][1]; }
                        if (a[1][sort.field].length > 1) { return 1 }
                        return -1
                    }
                    return a[1][sort.field][0] - b[1][sort.field][0];
                })
        }

    }


    return (
        <PokedexListRender sort={sort} {...other}>
            {sort.type === "number" ? sortNumber() :
                (sort.type === "array" ? sortTypeArr() : sortString())}
        </PokedexListRender>
    )
});


export default PokedexListSort;

PokedexListSort.propTypes = {
    pokTable: PropTypes.object,
    children: PropTypes.array,

    sort: PropTypes.object,
    onClick: PropTypes.func,
};