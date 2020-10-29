import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
    serachableSelect: {
        width: "100%",
    },
}));

const SerachableSelect = React.memo(function SerachableSelect(props) {
    const { helperText, children, label, type, name, category, attr, onChange, ...other } = props;
    const classes = useStyles();
    return (
        <Autocomplete
            className={classes.serachableSelect}
            options={props.children}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.title}
            name={name}
            onChange={(event, ...otherOptions) => onChange(event, { type: type, name: name, category: category, attr: attr, }, ...otherOptions)}
            renderInput={(params) => <TextField {...params} label={label} helperText={helperText} />}

            {...other}
        />
    )
});

export default SerachableSelect;

SerachableSelect.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
    ]),
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    type: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    attr: PropTypes.string,

    helperText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    onChange: PropTypes.func,
    className: PropTypes.string,
};