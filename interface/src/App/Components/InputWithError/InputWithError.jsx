import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    inputWithError: {
        width: "100%",
    },
    helperText: {
        "&:not(.Mui-error)": {
            visibility: "hidden",
        }
    }
}));

const InputWithError = React.memo(function InputWithError(props) {
    const { errorText, helperText, helperDisabled, ...other } = props;
    const classes = useStyles();

    let selectedText = "default"
    if (errorText) {
        selectedText = errorText
    }
    if (helperText) {
        selectedText = helperText
    }
    if (helperDisabled) {
        selectedText = ""
    }

    return (
        <TextField
            helperText={selectedText}
            error={errorText !== ""}

            className={classes.inputWithError}
            FormHelperTextProps={{
                className: classes.helperText,
            }}

            {...other}
        />
    )
})

export default InputWithError;

InputWithError.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    type: PropTypes.string,
    name: PropTypes.string,
    errorText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    helperText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    onChange: PropTypes.func,
    helperDisabled: PropTypes.bool,
    className: PropTypes.string,
};