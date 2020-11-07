import React from "react";
import PropTypes from 'prop-types';

const FilteredEggsList = React.memo(function FilteredEggsList(props) {

    const isFiltered = (elem) => {
        if (!props.filter) { return true }
        const filterProduct = Object.entries(props.filter).reduce((sum, value) => { return value[0].includes("eggs") ? sum && !value[1] : sum }, true)

        if (filterProduct) { return true }
        return props.filter[elem.key]
    }


    return (
        props.children.filter(elem => isFiltered(elem))
    )
});

export default FilteredEggsList;

FilteredEggsList.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
};