import React from "react";
import PropTypes from 'prop-types';

const FilteredRaidList = React.memo(function FilteredRaidList(props) {

    const isFiltered = (elem) => {
        if (!props.filter) {
            return true
        }
        if (!props.filter.tier1 && !props.filter.tier2 && !props.filter.tier3 && !props.filter.tier4
            && !props.filter.tier5 && !props.filter.megaRaids) {
            return true
        }
        return props.filter[elem.key]
    }

    return (
        props.children.filter(elem => isFiltered(elem))
    )
});

export default FilteredRaidList;

FilteredRaidList.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
};
