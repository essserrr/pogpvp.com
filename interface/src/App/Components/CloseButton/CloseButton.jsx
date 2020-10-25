import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        "&:hover": {
            fill: theme.palette.error.main
        }
    },
}));

const CloseButton = React.memo(function CloseButton(props) {
    const classes = useStyles();

    return (
        <CloseIcon className={classes.closeButton} name="closeButton" {...props} />
    );
});

export default CloseButton;

CloseButton.propTypes = {
    onClick: PropTypes.func,
};