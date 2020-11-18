import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Effect from "./Effect/Effect";

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";

let strings = new LocalizedStrings(dexLocale)

const ChargeMovePvp = React.memo(function ChargeMovePvp(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row" >{strings.movecard.dpe}</TableCell>
                <TableCell align="center">{(props.move.PvpDamage / Math.abs(props.move.PvpEnergy)).toFixed(2)}</TableCell>
            </TableRow>
            {props.move.Subject ? <Effect move={props.move} /> : null}
        </>
    )

});

export default ChargeMovePvp;

ChargeMovePvp.propTypes = {
    move: PropTypes.object.isRequired,
};