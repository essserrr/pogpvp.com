import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
    SearchableSelect: {
        width: "100%",
    },
}));

const SearchableSelect = React.memo(function SearchableSelect(props) {
    const { helperText, errorText, children, label, type, name, category, attr, onChange, ...other } = props;
    const classes = useStyles();


    let selectedText = ""
    if (errorText) {
        selectedText = errorText
    }
    if (helperText) {
        selectedText = helperText
    }
    return (
        <Autocomplete
            className={classes.SearchableSelect}
            name={name}

            options={props.children}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.title}

            onChange={(event, ...otherOptions) => onChange(event, { type: type, name: name, category: category, attr: attr, }, ...otherOptions)}
            renderInput={(params) => <TextField {...params} label={label} helperText={selectedText} error={!!errorText} />}

            {...other}
        />
    )
});

export default SearchableSelect;

SearchableSelect.propTypes = {
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

    helperText: PropTypes.string,
    errorText: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
};