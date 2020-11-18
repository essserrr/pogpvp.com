import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import ContentTitle from "./ContentTitle/ContentTitle";

const UserPageContent = React.memo(function UserPageContent(props) {
    return (
        <Grid container>
            <Grid item xs={12}>
                <ContentTitle>
                    {props.title}
                </ContentTitle>
            </Grid>
            <Grid item xs={12}>
                <Box mt={3}>
                    {props.children}
                </Box>
            </Grid>
        </Grid>
    )
});

export default UserPageContent;

UserPageContent.propTypes = {
    title: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};