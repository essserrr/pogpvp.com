import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TheadCell from "App/ShinyRates/ShinyTable/ShinyTableThead/TheadCell/TheadCell";
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokedex";

let strings = new LocalizedStrings(dexLocale);

const TableThead = React.memo(function TableThead(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    const order = Boolean(props.active.order);
    return (
        <TableHead>
            <TableRow>
                <TheadCell coltype="number" name="Number" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Number"} order={order}
                >
                    {"ID"}
                </TheadCell>

                <TheadCell coltype="string" name="Title" scope="col" align='left' onClick={props.onClick}
                    isSelected={props.active.field === "Title"} order={order}
                >
                    {strings.mt.n}
                </TheadCell>


                <TheadCell coltype="array" name="Type" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Type"} order={order}
                >
                    {strings.mt.tp}
                </TheadCell>

                <TheadCell coltype="number" name="Generation" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Generation"} order={order}
                >
                    {strings.mt.gen}
                </TheadCell>

                <TheadCell coltype="number" name="Atk" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Atk"} order={order}
                >
                    {strings.Atk}
                </TheadCell>

                <TheadCell coltype="number" name="Def" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Def"} order={order}
                >
                    {strings.Def}
                </TheadCell>

                <TheadCell coltype="number" name="Sta" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Sta"} order={order}
                >
                    {strings.Sta}
                </TheadCell>

                <TheadCell coltype="number" name="CP" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "CP"} order={order}
                >
                    {"CP"}
                </TheadCell>
            </TableRow>
        </TableHead>
    )

});

export default TableThead;

TableThead.propTypes = {
    active: PropTypes.object,
    onClick: PropTypes.func,
};