import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    authInput: {
        width: "100%",
    },
    helperText: {
        "&:not(.Mui-error)": {
            visibility: "hidden",
        }
    }
}));

const AuthInput = React.memo(function (props) {
    const { label, type, name, errorText, onChange, ...other } = props;
    const classes = useStyles();

    return (
        <TextField
            label={label}
            type={type}
            name={name}
            helperText={errorText !== "" ? errorText : "default"}
            error={errorText !== ""}
            onChange={onChange}

            className={classes.authInput}
            FormHelperTextProps={{
                className: classes.helperText,
            }}

            {...other}
        />
    )
})

export default AuthInput;

AuthInput.propTypes = {
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
    onChange: PropTypes.func,
};