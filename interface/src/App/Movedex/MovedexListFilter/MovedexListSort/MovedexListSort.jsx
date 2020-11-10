import React from "react";
import PropTypes from 'prop-types';

import MovedexListRender from "./MovedexListRender/MovedexListRender";

const MovedexListSort = React.memo(function MovedexListSort(props) {
    const { sort, children, ...other } = props

    const sortNumber = () => {
        switch (sort.order) {
            case true:
                return children.sort((a, b) => {
                    return b[1][sort.field] - a[1][sort.field]
                })
            default:
                return children.sort((a, b) => {
                    return a[1][sort.field] - b[1][sort.field]
                })
        }
    }

    const sortString = () => {
        switch (sort.order) {
            case true:
                return children.sort((a, b) => {
                    if (a[1][sort.field] > b[1][sort.field]) { return -1; }
                    if (b[1][sort.field] > a[1][sort.field]) { return 1; }
                    return 0;
                })
            default:
                return children.sort((a, b) => {
                    if (a[1][sort.field] < b[1][sort.field]) { return -1; }
                    if (b[1][sort.field] < a[1][sort.field]) { return 1; }
                    return 0;
                })
        }
    }


    return (
        <MovedexListRender sort={sort} {...other}>
            {sort.type === "number" ? sortNumber() : sortString()}
        </MovedexListRender>
    )
});

export default MovedexListSort;

MovedexListSort.propTypes = {
    children: PropTypes.array,

    sort: PropTypes.object,
    onClick: PropTypes.func,
};