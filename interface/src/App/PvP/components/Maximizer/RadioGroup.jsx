import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import MaterialRadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';

import LocalizedStrings from "react-localization";
import { maximizer } from "locale/Pvp/Maximizer/Maximizer";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(maximizer);

const useStyles = makeStyles((theme) => ({
    menu: {
        margin: "0px",
        "& .MuiRadio-root": {
            marginRight: `${theme.spacing(0.25)}px`,
            padding: `0px`,
            width: "18px",
            height: "18px",
            "& .MuiSvgIcon-root": {
                width: "18px",
                height: "18px",
            },
        },
        "& .MuiFormControlLabel-label": {
            font: theme.typography.body1.font,
        },

    },
}));

const RadioGroup = React.memo(function RadioGroup(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const { attr, name, category, type, children, value, onChange, ...other } = props;
    const classes = useStyles();

    return (
        <MaterialRadioGroup row name={name} value={value}
            onChange={(event, ...other) => onChange(event, { attr: attr, name: name, category: category, type: type }, ...other)}
            {...other}
        >
            <Grid container justify="space-between">
                {children.map((value, key) =>
                    React.cloneElement(value, {
                        key: key,
                        className: classes.menu,
                    })
                )}
            </Grid>
        </MaterialRadioGroup>
    )
});

export default RadioGroup;

RadioGroup.propTypes = {
    attr: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,

    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),

    onChange: PropTypes.func,
};