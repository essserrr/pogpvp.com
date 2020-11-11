import React from "react";
import { effectivenessData } from "js/indexFunctions";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { makeStyles } from '@material-ui/core/styles';
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Components/EffTable/EffTable";
import EffIcon from "./EffIcon";

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
}));

let strings = new LocalizedStrings(dexLocale)

const EffTable = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    let effective = []
    let weak = []
    effectivenessData.forEach((elem, i) => {
        let efficiency = 1
        //calculate eff
        switch (props.reverse) {
            case true:
                props.type.forEach((type) => {
                    efficiency *= (effectivenessData[type][i] === 0 ? 1 : effectivenessData[type][i])
                });
                break
            default:
                props.type.forEach((type) => {
                    efficiency *= (elem[type] === 0 ? 1 : elem[type])
                });
        }
        //push icon
        switch (true) {
            case efficiency > 1:
                weak.push(<EffIcon key={i + "eff"} i={i} eff={efficiency.toFixed(3)} />)
                break
            case efficiency < 1:
                effective.push(<EffIcon key={i + "weak"} i={i} eff={efficiency.toFixed(3)} />)
                break
            default:
        }
    });


    return (
        <Table className={classes.table}>
            <TableBody>
                {(props.reverse ? weak.length > 0 : effective.length > 0) &&
                    <TableRow>
                        <TableCell component="th" align="center" scope="row" >
                            <Typography variant="body1">
                                {props.reverse ? strings.dmore : strings.resist}
                            </Typography>
                        </TableCell>
                        <TableCell align="center" >
                            {props.reverse ? weak : effective}
                        </TableCell>
                    </TableRow>}
                {(props.reverse ? effective.length > 0 : weak.length > 0) &&
                    <TableRow>
                        <TableCell component="th" align="center" scope="row" >
                            <Typography variant="body1">
                                {props.reverse ? strings.dless : strings.weak}
                            </Typography>
                        </TableCell>
                        <TableCell align="center" >
                            {props.reverse ? effective : weak}
                        </TableCell>
                    </TableRow>}
            </TableBody>
        </Table>
    )
});

export default EffTable;

EffTable.propTypes = {
    type: PropTypes.arrayOf(PropTypes.number),
    reverse: PropTypes.bool,
};