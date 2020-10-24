import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    contentTitle: {
        borderBottom: `1px solid ${theme.palette.text.primary}`,
    },
}));


const ContentTitle = React.memo(function ContentTitle(props) {
    const classes = useStyles();

    return (
        <Grid container className={classes.contentTitle} justify="center">
            <Box fontSize="h6.fontSize" textAlign="center" fontWeight={400}>
                {props.children}
            </Box >
        </Grid>
    )
});

export default ContentTitle;

ContentTitle.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};