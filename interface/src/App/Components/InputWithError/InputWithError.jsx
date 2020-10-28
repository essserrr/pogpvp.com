import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    inputWithError: {
        width: "100%",
    },
}));

const InputWithError = React.memo(function InputWithError(props) {
    const { errorText, helperText, children, attr, ...other } = props;
    const classes = useStyles();

    let selectedText = ""
    if (errorText) {
        selectedText = errorText
    }
    if (helperText) {
        selectedText = helperText
    }
    return (

        <TextField
            helperText={selectedText}
            error={!!errorText}

            className={classes.inputWithError}
            FormHelperTextProps={{
                style: { visibility: !!selectedText ? "visible" : "hidden" }
            }}
            inputProps={{ "data-attr": attr }}

            {...other}
        >
            {!!children ? children : null}
        </TextField>
    )
});

export default InputWithError;

InputWithError.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
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
    className: PropTypes.string,
};