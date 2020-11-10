import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";

let strings = new LocalizedStrings(dexLocale);

const CommonRaid = React.memo(function CommonRaid(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.tip.pd}</TableCell>
                <TableCell align="center">{props.move.PvpDamage}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.tip.pe}</TableCell>
                <TableCell align="center">{props.move.PvpEnergy}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.tip.dr}</TableCell>
                <TableCell align="center">{props.move.PvpDurationSeconds / 0.5}</TableCell>
            </TableRow>
        </>
    )

});

export default CommonRaid;

CommonRaid.propTypes = {
    move: PropTypes.object.isRequired,
};