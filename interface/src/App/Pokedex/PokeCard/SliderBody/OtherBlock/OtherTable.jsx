import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';

import { ReactComponent as Dust } from "icons/stardust.svg";
import { ReactComponent as Candy } from "icons/candy.svg";
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";
import { regionLocale } from "locale/Eggs/regionLocale";

const useStyles = makeStyles((theme) => ({
    table: {
        "& td": {
            padding: `${theme.spacing(1)}px ${theme.spacing(0.5)}px ${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
        },
        "& th": {
            padding: `${theme.spacing(1)}px ${theme.spacing(0.5)}px ${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
            "& .MuiTableSortLabel-icon": {
                marginLeft: 0,
                marginRight: 0,
            }
        },
    },
    icon: {
        width: "18px",
        height: "18px",
        marginRight: `${theme.spacing(0.5)}px`,
    },
}));

let strings = new LocalizedStrings(dexLocale)
let regions = new LocalizedStrings(regionLocale)

const OtherTable = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    regions.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Table>
            <TableBody className={classes.table}>

                {props.value.SecCharge && (props.value.SecCharge.Candy !== 0) &&
                    <TableRow>
                        <TableCell component="th" align="center" scope="row" >
                            {strings.infot.sec}
                        </TableCell>
                        <TableCell align="center">
                            <Candy className={classes.icon} /><Box component="span">{props.value.SecCharge.Candy}</Box>{" + "}
                            <Dust className={classes.icon} /><Box component="span">{props.value.SecCharge.Dust}</Box>
                        </TableCell>
                    </TableRow>}

                {props.value.Purification && (props.value.Purification.Candy !== 0) &&
                    <TableRow>
                        <TableCell component="th" align="center" scope="row" >
                            {strings.infot.pur}
                        </TableCell>
                        <TableCell align="center">
                            <Candy className={classes.icon} /><Box component="span">{props.value.Purification.Candy}</Box>{" + "}
                            <Dust className={classes.icon} /><Box component="span">{props.value.Purification.Dust}</Box>
                        </TableCell>
                    </TableRow>}

                {(props.value.Buddy !== 0) &&
                    <TableRow>
                        <TableCell component="th" align="center" scope="row" >
                            {strings.infot.bud}
                        </TableCell>
                        <TableCell align="center">
                            {props.value.Buddy}
                        </TableCell>
                    </TableRow>}

                {props.value.Region !== 0 &&
                    <TableRow>
                        <TableCell component="th" align="center" scope="row" >
                            {strings.infot.reg}
                        </TableCell>
                        <TableCell align="center">
                            {regions[props.value.Region]}
                        </TableCell>
                    </TableRow>}

            </TableBody>
        </Table>

    )
});

export default OtherTable;

OtherTable.propTypes = {
    value: PropTypes.object.isRequired,
};