import React from "react";
import PropTypes from 'prop-types';

import DetailedWrapper from "./DetailedWrapper/DetailedWrapper";

const DetailedStatisticsGenerator = React.memo(function DetailedStatisticsGenerator(props) {
    const { value, ...other } = props;

    return (
        Object.entries(value).map(detailed =>
            <DetailedWrapper
                key={detailed[0]}
                value={detailed[1]}
                disabled={{ avg: true, max: true, min: true, }}
                {...other}
            />
        )
    )
});

export default DetailedStatisticsGenerator;

DetailedStatisticsGenerator.propTypes = {
    value: PropTypes.array,

    tables: PropTypes.object,
    moveTable: PropTypes.object,
    snapshot: PropTypes.object,
};