import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TheadCell from "App/ShinyRates/ShinyTable/ShinyTableThead/TheadCell/TheadCell";

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movedex";

let strings = new LocalizedStrings(dexLocale);

const TableThead = React.memo(function TableThead(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    const order = Boolean(props.active.order);
    return (
        <TableHead>
            <TableRow>
                <TheadCell coltype="string" name="Title" scope="col" align='left' onClick={props.onClick}
                    isSelected={props.active.field === "Title"} order={order}
                >
                    {strings.mt.n}
                </TheadCell>

                <TheadCell coltype="number" name="MoveType" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "MoveType"} order={order}
                >
                    {strings.mt.tp}
                </TheadCell>

                <TheadCell coltype="number" name="Damage" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Damage"} order={order}
                >
                    {strings.mt.rd}
                </TheadCell>

                <TheadCell coltype="number" name="Energy" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Energy"} order={order}
                >
                    {strings.mt.re}
                </TheadCell>

                <TheadCell coltype="number" name="Cooldown" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Cooldown"} order={order}
                >
                    {strings.mt.cd}
                </TheadCell>

                <TheadCell coltype="number" name="PvpDamage" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "PvpDamage"} order={order}
                >
                    {strings.mt.pd}
                </TheadCell>

                <TheadCell coltype="number" name="PvpEnergy" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "PvpEnergy"} order={order}
                >
                    {strings.mt.pe}
                </TheadCell>

                <TheadCell coltype="number" name="PvpDurationSeconds" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "PvpDurationSeconds"} order={order}
                >
                    {strings.mt.dr}
                </TheadCell>

                <TheadCell coltype="string" name="Subject" scope="col" align='left' onClick={props.onClick}
                    isSelected={props.active.field === "Subject"} order={order}
                >
                    {strings.mt.ef}
                </TheadCell>
            </TableRow>
        </TableHead>
    )

});

export default TableThead;

TableThead.propTypes = {
    sort: PropTypes.object,
    onClick: PropTypes.func,
};