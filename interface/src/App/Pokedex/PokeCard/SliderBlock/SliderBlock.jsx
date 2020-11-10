import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";

let strings = new LocalizedStrings(dexLocale);

const useStyles = makeStyles((theme) => ({
    tabs: {
        display: "flex",
        flexWrap: "wrap",
    },
    tab: {
        flexBasis: "0",
        flexGrow: "1",
        maxWidth: "100%",
        minWidth: 0,

        position: "relative",
        lineHeight: "inherit",

        backgroundColor: "transparent",

        fontSize: "0.8rem",
        color: theme.palette.text.primary,
        fontWeight: 400,

        [theme.breakpoints.down('sm')]: {
            fontSize: "0.6rem",
        },

        "&:focus": {
            outline: "none",
        },
    }
}));

const SliderButtons = React.memo(function SliderButtons(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { attrs, active, disabled, onClick } = props;
    const classes = useStyles();

    const activeTab = active.indexOf(true);

    return (
        <Tabs className={classes.tabs}
            value={activeTab === -1 ? false : activeTab}
            onChange={(event, value) => { onClick(event, { attr: attrs[value] }) }}
        >
            <Tab className={classes.tab} disabled={disabled[0]} label={strings.movelist} id={0} aria-controls="0" />

            <Tab className={classes.tab} disabled={disabled[1]} label={strings.evochart} id={1} aria-controls="1" />

            <Tab className={classes.tab} disabled={disabled[2]} label={strings.vunlist} id={2} aria-controls="2" />

            <Tab className={classes.tab} disabled={disabled[3]} label={"CP"} id={3} aria-controls="3" />

            <Tab className={classes.tab} disabled={disabled[4]} label={strings.otherinf} id={4} aria-controls="4" />
        </Tabs>
    )

});

export default SliderButtons;

SliderButtons.propTypes = {
    active: PropTypes.arrayOf(PropTypes.bool),
    attrs: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.arrayOf(PropTypes.bool),
    onClick: PropTypes.func,
};