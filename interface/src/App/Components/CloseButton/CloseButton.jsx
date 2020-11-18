import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        cursor: "pointer",
        "&:hover": {
            fill: theme.palette.error.main
        }
    },
    iconButton: {
        outline: "none !important",
        width: 28,
        height: 28,
    },
}));

const CloseButton = React.memo(function CloseButton(props) {
    const classes = useStyles();
    const { onClick, ...other } = props;

    return (
        <IconButton className={classes.iconButton} onClick={onClick}>
            <CloseIcon className={classes.closeButton} name="closeButton" {...other} />
        </IconButton>
    );
});

export default CloseButton;

CloseButton.propTypes = {
    onClick: PropTypes.func,
};