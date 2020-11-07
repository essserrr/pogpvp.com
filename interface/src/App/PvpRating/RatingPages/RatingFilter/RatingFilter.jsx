import React from "react";
import PropTypes from 'prop-types';

import RenderPvpRating from "./RenderPvpRating/RenderPvpRating";

const RatingFilter = React.memo(function RatingFilter(props) {
    const { children, searchState, name, ...other } = props;

    return (
        <RenderPvpRating {...other}>
            {searchState ? children.filter(elem => elem.Name.toLowerCase().indexOf(name.toLowerCase()) > -1) : children}
        </RenderPvpRating>
    )
});

export default RatingFilter;

RatingFilter.propTypes = {
    name: PropTypes.string,
    searchState: PropTypes.bool,
    children: PropTypes.array,
};
