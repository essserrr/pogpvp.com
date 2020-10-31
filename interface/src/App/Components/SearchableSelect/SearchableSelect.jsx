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
    const { helperText, children, label, type, name, category, attr, onChange, ...other } = props;
    const classes = useStyles();
    return (
        <Autocomplete
            className={classes.SearchableSelect}
            name={name}

            options={props.children}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.title}

            onChange={(event, ...otherOptions) => onChange(event, { type: type, name: name, category: category, attr: attr, }, ...otherOptions)}
            renderInput={(params) => <TextField {...params} label={label} helperText={helperText} />}

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

    helperText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    onChange: PropTypes.func,
    className: PropTypes.string,
};