import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";


let strings = new LocalizedStrings(dexLocale);

const CommonPve = React.memo(function CommonPve(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.tip.rd}</TableCell>
                <TableCell align="center">{props.move.Damage}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.tip.re}</TableCell>
                <TableCell align="center">{props.energy}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.tip.cd}</TableCell>
                <TableCell align="center">{props.move.Cooldown / 1000}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.movecard.dwstart}</TableCell>
                <TableCell align="center">{props.move.DamageWindow / 1000}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.movecard.dwdur}</TableCell>
                <TableCell align="center">{props.move.DodgeWindow / 1000}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.movecard.dps}</TableCell>
                <TableCell align="center">{
                    (props.move.Damage / (props.move.Cooldown / 1000)).toFixed(2)}</TableCell>
            </TableRow>
        </>
    )

});

export default CommonPve;

CommonPve.propTypes = {
    move: PropTypes.object.isRequired,
};