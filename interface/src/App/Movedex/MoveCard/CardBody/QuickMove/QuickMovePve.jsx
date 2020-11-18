import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";

let strings = new LocalizedStrings(dexLocale);

const QuickMovePve = React.memo(function QuickMovePve(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <TableRow>
            <TableCell component="th" scope="row" >{strings.movecard.eps}</TableCell>
            <TableCell align="center">
                {(Math.abs(props.move.Energy) / (props.move.Cooldown / 1000)).toFixed(2)}
            </TableCell>
        </TableRow>
    )

});

export default QuickMovePve;

QuickMovePve.propTypes = {
    move: PropTypes.object.isRequired,
};