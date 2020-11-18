import React from "react";
import PropTypes from 'prop-types';

import PokedexListSort from "./PokedexListSort/PokedexListSort";

const PokedexListFilter = React.memo(function PokedexListFilter(props) {
    const { name, filter, children, ...other } = props

    const filterList = () => {
        return Object.entries(children).filter(element => {
            return applyNameFilter(element[0]) && applyColFilter(element[1], filter)
        })
    }

    const applyNameFilter = (currName) => {
        return currName.toLowerCase().indexOf(name.toLowerCase()) > -1
    }

    const applyColFilter = (element, filter) => {
        let corresponds = true

        const typeFilterEnabled = Object.entries(filter).reduce((sum, value) => value[0].includes("type") ? sum || value[1] : sum, false);
        const noneOfTypeMatched = element.Type.reduce((result, type) => result && !filter["type" + type], true)

        if (typeFilterEnabled && noneOfTypeMatched) {
            corresponds *= false
        }

        const genFilterEnabled = Object.entries(filter).reduce((sum, value) => value[0].includes("gen") ? sum || value[1] : sum, false);
        const genNotMatched = !filter["gen" + element.Generation]

        if (genFilterEnabled && genNotMatched) {
            corresponds *= false
        }

        return corresponds
    }

    return (
        <PokedexListSort pokTable={children} {...other}>
            {filterList()}
        </PokedexListSort>
    )
});

export default PokedexListFilter;

PokedexListFilter.propTypes = {
    children: PropTypes.object,

    name: PropTypes.string,
    filter: PropTypes.object,
    sort: PropTypes.object,
    onClick: PropTypes.func,
};