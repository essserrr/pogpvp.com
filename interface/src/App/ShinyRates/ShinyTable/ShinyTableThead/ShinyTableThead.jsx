import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';

import TheadCell from "./TheadCell/TheadCell";

import { locale } from "locale/ShinyRates/ShinyRates";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const ShinyTableThead = React.memo(function ShinyTableThead(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const { field, order } = props.active

    return (
        <TableHead>
            <TableRow>
                <TheadCell isSelected={field === "Name"} order={order} coltype="string" name="Name"
                    scope="col" align='left' onClick={props.onClick}>
                    {strings.shinyrates.pokname}
                </TheadCell>

                <TheadCell isSelected={field === "Odds"} order={order} coltype="number" name="Odds"
                    align='center' onClick={props.onClick}>
                    {<>{strings.shinyrates.rate1}<wbr />{strings.shinyrates.rate2}</>}
                </TheadCell>

                <TheadCell isSelected={field === "Odds"} order={order} coltype="number" name="Odds"
                    align='center' onClick={props.onClick}>

                    {strings.shinyrates.rateest}
                    <Tooltip placement="top" arrow
                        title={<Typography color="inherit">{strings.shinyrates.tip}</Typography>}>
                        <InfoIcon />
                    </Tooltip>

                </TheadCell>

                <TheadCell isSelected={field === "Checks"} order={order} coltype="number" name="Checks"
                    align='center' onClick={props.onClick}>
                    {strings.shinyrates.checks}
                </TheadCell>

            </TableRow>
        </TableHead>
    )
});

export default ShinyTableThead;

ShinyTableThead.propTypes = {
    onClick: PropTypes.func.isRequired,
    active: PropTypes.object.isRequired,
};