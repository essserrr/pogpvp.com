import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";

let strings = new LocalizedStrings(dexLocale);

const Effect = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    let effect = ""
    if (props.move.Subject !== "") {
        effect += (props.move.Probability * 100) + strings.ch

        props.move.Stat.forEach(function (elem) {
            effect += " " + strings[elem]
        });

        effect += strings.by + props.move.StageDelta
        effect += strings.of + strings[props.move.Subject]
    }

    return (
        <TableRow>
            <TableCell component="th" scope="row" >{strings.tip.ef}</TableCell>
            <TableCell align="center">{effect}</TableCell>
        </TableRow>
    )

});

export default Effect;

Effect.propTypes = {
    move: PropTypes.object.isRequired,
};