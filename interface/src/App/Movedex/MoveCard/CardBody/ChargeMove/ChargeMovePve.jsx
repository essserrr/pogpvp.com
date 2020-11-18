import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";

let strings = new LocalizedStrings(dexLocale);

const ChargeMovePve = React.memo(function ChargeMovePve(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.movecard.dpe}</TableCell>
                <TableCell align="center">{(props.move.Damage / Math.abs(props.move.Energy)).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.movecard.dpsdpe}</TableCell>
                <TableCell align="center">
                    {((props.move.Damage / (props.move.Cooldown / 1000)) * (props.move.Damage / Math.abs(props.move.Energy))).toFixed(2)}
                </TableCell>
            </TableRow>
        </>
    )

});

export default ChargeMovePve;

ChargeMovePve.propTypes = {
    move: PropTypes.object.isRequired,
};