import React from "react";
import PropTypes from 'prop-types';

import MovedexListSort from "./MovedexListSort/MovedexListSort";

const MovedexListFilter = React.memo(function MovedexListFilter(props) {
    const { name, filter, ...other } = props

    const applyNameFilter = (currName) => {
        return currName.toLowerCase().indexOf(name.toLowerCase()) > -1
    }

    const applyColFilter = (element, filter) => {
        let corresponds = true

        const categoryFilterEnabled = Object.entries(filter).reduce((sum, value) => value[0].includes("show") ? sum || value[1] : sum, false);

        if (categoryFilterEnabled) {
            const moveCategoryFilter = element.MoveCategory === "Charge Move" ? "showCharge" : "showQuick";
            corresponds = corresponds && filter[moveCategoryFilter]
        }

        const typeFilterEnabled = Object.entries(filter).reduce((sum, value) => value[0].includes("type") ? sum || value[1] : sum, false);

        if (typeFilterEnabled && !filter[`type${element.MoveType}`]) { corresponds = corresponds && false };

        return corresponds
    }


    return (
        <MovedexListSort {...other} >
            {Object.entries(props.children).filter(element => {
                return applyNameFilter(element[0]) && applyColFilter(element[1], filter)
            })}
        </MovedexListSort>
    )
});

export default MovedexListFilter;

MovedexListFilter.propTypes = {
    children: PropTypes.object,

    name: PropTypes.string,
    filter: PropTypes.object,
    sort: PropTypes.object,
    onClick: PropTypes.func,
};