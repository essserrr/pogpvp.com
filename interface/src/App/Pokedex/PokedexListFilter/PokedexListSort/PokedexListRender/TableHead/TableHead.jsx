import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import MaterialTableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import HeadCell from "App/ShinyRates/ShinyTable/ShinyTableHead/HeadCell/HeadCell";
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokedex";

let strings = new LocalizedStrings(dexLocale);

const TableHead = React.memo(function TableHead(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    const order = Boolean(props.active.order);
    return (
        <MaterialTableHead>
            <TableRow>
                <HeadCell coltype="number" name="Number" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Number"} order={order}
                >
                    {"ID"}
                </HeadCell>

                <HeadCell coltype="string" name="Title" scope="col" align='left' onClick={props.onClick}
                    isSelected={props.active.field === "Title"} order={order}
                >
                    {strings.mt.n}
                </HeadCell>


                <HeadCell coltype="array" name="Type" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Type"} order={order}
                >
                    {strings.mt.tp}
                </HeadCell>

                <HeadCell coltype="number" name="Generation" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Generation"} order={order}
                >
                    {strings.mt.gen}
                </HeadCell>

                <HeadCell coltype="number" name="Atk" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Atk"} order={order}
                >
                    {strings.Atk}
                </HeadCell>

                <HeadCell coltype="number" name="Def" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Def"} order={order}
                >
                    {strings.Def}
                </HeadCell>

                <HeadCell coltype="number" name="Sta" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Sta"} order={order}
                >
                    {strings.Sta}
                </HeadCell>

                <HeadCell coltype="number" name="CP" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "CP"} order={order}
                >
                    {"CP"}
                </HeadCell>
            </TableRow>
        </MaterialTableHead>
    )

});

export default TableHead;

TableHead.propTypes = {
    active: PropTypes.object,
    onClick: PropTypes.func,
};