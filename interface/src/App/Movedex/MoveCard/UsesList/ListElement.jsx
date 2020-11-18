import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";

const useStyles = makeStyles((theme) => ({
    link: {
        fontSize: "1.1em",
        fontWeight: 400,
        color: theme.palette.text.link,
        "&:hover": {
            textDecoration: "underline",
        },
    },
    margin: {
        marginLeft: `${theme.spacing(1)}px`
    }
}));

let strings = new LocalizedStrings(dexLocale);

const ListElement = React.memo(function ListElement(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const classes = useStyles();

    const fileName = `${props.value.Number}${props.value.Forme !== "" ? `-${props.value.Forme}` : ""}`;
    const to = (navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(props.name);

    return (
        <Grid item xs={6} sm={4} md={3} container alignItems="center">
            <Iconer size={36} folderName="/pokemons/" fileName={fileName} />

            <Link className={`${classes.link} ${classes.margin}`} title={`${strings.dexentr} ${props.name}`} to={to}>
                {props.name}
            </Link>
        </Grid>
    )

});

export default ListElement;

ListElement.propTypes = {
    name: PropTypes.string,
    value: PropTypes.object,
};