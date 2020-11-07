import React from "react";
import PropTypes from 'prop-types';

import RatingFilter from "./RatingFilter/RatingFilter";

const RatingPages = React.memo(function RatingPages(props) {
    const { children, searchState, n, ...other } = props;
    return (
        <RatingFilter searchState={searchState} {...other}>
            {searchState ? children : children.slice(0, n)}
        </RatingFilter>
    )
});

export default RatingPages;

RatingPages.propTypes = {
    n: PropTypes.number,
    searchState: PropTypes.bool,
    children: PropTypes.array,
};
