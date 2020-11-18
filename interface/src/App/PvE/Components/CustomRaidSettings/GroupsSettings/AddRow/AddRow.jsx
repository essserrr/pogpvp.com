import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    addRow: {
        "-webkit-transition": "all 0.1s linear",
        transition: "all 0.1s linear",

        "& button": {
            "&:hover": {
                "& + $line": {
                    visibility: "visible",
                }
            }
        }
    },

    line: {
        visibility: "hidden",
        height: "3px",

        marginLeft: "10px",
        marginRight: "10px",

        borderRadius: "2px",
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.primary.main,

        "-webkit-transition": "all 0.1s linear",
        transition: "all 0.1s linear",
    },
    button: {
        outline: "none !important"
    },
    icon: {
        fontSize: "32px",
    },
}));

const AddRow = React.memo(function AddRow(props) {
    const classes = useStyles();

    return (
        <Grid container alignItems="center" justify="space-between" className={classes.addRow}>
            <IconButton className={classes.button} name={props.name} onClick={(event, ...other) => props.onClick(event, { name: props.name }, ...other)}>
                <AddCircleIcon className={classes.icon} />
            </IconButton>
            <Grid item xs className={classes.line}></Grid>
        </Grid>
    )
});


export default AddRow;

AddRow.propTypes = {
    name: PropTypes.string,
    onClick: PropTypes.func,
};