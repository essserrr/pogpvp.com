import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Iconer from "App/Components/Iconer/Iconer";
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movedex";

let strings = new LocalizedStrings(dexLocale);

const useStyles = makeStyles((theme) => ({
    tr: {
        position: "relative",
        "-webkit-transition": 'all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)',
        transition: "all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)",
        "&::after": {
            content: '""',
            borderRadius: "5px",
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
            opacity: 0,
            "-webkit-transition": 'all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)',
            transition: "all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)",
        },

        "&:hover": {
            transform: "scale(1.02, 1.02)",
            "-webkit-transform": "scale(1.02, 1.02)",
        },
        "&:hover::after": {
            opacity: 1,
            display: "block",
        }
    },
    td: {
        padding: `${theme.spacing(1)}px`,
    },
    borderLeft: {
        borderLeft: `1px solid ${theme.palette.tableCell.main}`,
    },
    link: {
        fontSize: "1.1em",
        color: theme.palette.text.link,
        "&:hover": {
            textDecoration: "underline",
        },
    },
}));

const MoveRow = React.memo(function MoveRow(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    let effect = ""
    if (props.value.Subject !== "") {
        effect += (props.value.Probability * 100) + strings.ch

        props.value.Stat.forEach(function (elem) {
            effect += " " + strings[elem]
        });

        effect += strings.by + props.value.StageDelta
        effect += strings.of + strings[props.value.Subject]
    }
    const to = (navigator.userAgent === "ReactSnap") ? "/" : "/movedex/id/" + encodeURIComponent(props.value.Title);
    const title = `${strings.dexentr} ${props.value.Title}`;


    return (
        <TableRow className={classes.tr}>
            <TableCell className={classes.td} width="5%" component="th" scope="row" align='left'>
                <Link className={classes.link} title={title} to={to}>
                    {props.value.Title}
                </Link>
            </TableCell>

            <TableCell className={classes.td} width="5%" align='center'>
                <Iconer size={18} folderName="/type/" fileName={String(props.value.MoveType)} />
            </TableCell>

            <TableCell className={`${classes.td} ${classes.borderLeft}`} width="5%" align='center'>{props.value.Damage}</TableCell>
            <TableCell className={classes.td} width="5%" align='center'>{props.value.Energy}</TableCell>
            <TableCell className={classes.td} width="5%" align='center'>{props.value.Cooldown / 1000}</TableCell>

            <TableCell className={`${classes.td} ${classes.borderLeft}`} width="5%" align='center'>{props.value.PvpDamage}</TableCell>
            <TableCell className={classes.td} width="5%" align='center'>{props.value.PvpEnergy}</TableCell>
            <TableCell className={classes.td} width="5%" align='center'>{props.value.PvpDurationSeconds / 0.5}</TableCell>
            <TableCell className={classes.td} width="60%" align='center'>{effect}</TableCell>
        </TableRow>
    )

});

export default MoveRow;

MoveRow.propTypes = {
    value: PropTypes.object.isRequired,
};