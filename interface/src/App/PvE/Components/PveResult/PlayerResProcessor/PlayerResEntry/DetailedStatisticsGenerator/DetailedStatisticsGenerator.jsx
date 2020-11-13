import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import DetailedWrapper from "./DetailedWrapper/DetailedWrapper";

const DetailedStatisticsGenerator = React.memo(function DetailedStatisticsGenerator(props) {
    const { value, ...other } = props;

    return (
        <Grid container spacing={1}>
            {Object.entries(value).map(detailed =>
                <Grid item xs={12} key={detailed[0]}>
                    <DetailedWrapper
                        value={detailed[1]}
                        disabled={{ avg: true, max: true, min: true, }}
                        {...other}
                    />
                </Grid>)}
        </Grid>
    )
});

export default DetailedStatisticsGenerator;

DetailedStatisticsGenerator.propTypes = {
    value: PropTypes.object,

    tables: PropTypes.object,
    moveTable: PropTypes.object,
    snapshot: PropTypes.object,
};