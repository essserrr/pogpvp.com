import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";

let strings = new LocalizedStrings(dexLocale);

const QuickMovePvp = React.memo(function QuickMovePvp(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.movecard.dpt}</TableCell>
                <TableCell align="center">
                    {(props.move.PvpDamage / (props.move.PvpDurationSeconds / 0.5)).toFixed(2)}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.movecard.ept}</TableCell>
                <TableCell align="center">
                    {(props.move.PvpEnergy / (props.move.PvpDurationSeconds / 0.5)).toFixed(2)}
                </TableCell>
            </TableRow>
        </>
    )

});

export default QuickMovePvp;

QuickMovePvp.propTypes = {
    move: PropTypes.object.isRequired,
};