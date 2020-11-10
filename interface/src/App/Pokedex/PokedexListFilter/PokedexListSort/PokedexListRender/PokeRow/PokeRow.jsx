import React from "react"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import useAnimation from "css/hoverAnimation";
import Iconer from "App/Components/Iconer/Iconer"
import { getCookie } from "js/getCookie"
import { dexLocale } from "locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const useStyles = makeStyles((theme) => ({
    marginLeft: {
        marginLeft: `${theme.spacing(1)}px`,
    },
    link: {
        fontSize: "1.1em",
        color: theme.palette.text.link,
        "&:hover": {
            textDecoration: "underline",
        },
    },
}));

const PokeRow = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();
    const animation = useAnimation();

    const fileName = `${props.value.Number}${props.value.Forme !== "" ? `-${props.value.Forme}` : ""}`;
    const to = (navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(props.value.Title)

    return (
        <TableRow className={animation.animation}>
            <TableCell align="center">{props.value.Number}</TableCell>

            <TableCell component="th" align="left" scope="row">

                <Iconer fileName={fileName} folderName="/pokemons/" size={36} />

                <Link title={strings.dexentr + props.value.Title} className={classes.link} to={to}>
                    {props.value.Title}
                </Link>

            </TableCell>

            <TableCell align="center">
                <Iconer size={18} folderName="/type/" fileName={String(props.value.Type[0])} />
                {props.value.Type.length > 1 &&
                    <Iconer size={18} folderName="/type/" fileName={String(props.value.Type[1])} />}
            </TableCell>

            <TableCell align="center">{props.value.Generation}</TableCell>
            <TableCell align="center">{props.value.Atk}</TableCell>
            <TableCell align="center">{props.value.Def}</TableCell>
            <TableCell align="center">{props.value.Sta}</TableCell>
            <TableCell align="center">{props.value.CP}</TableCell>
        </TableRow>
    )

});

export default PokeRow;