import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import DefaultIconStyle from "App/Components/WithIcon/DefaultIconStyle";
import HeadCell from "./HeadCell/HeadCell";

import { locale } from "locale/ShinyRates/ShinyRates";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const ShinyTableHead = React.memo(function ShinyTableHead(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const { field, order } = props.active

    return (
        <TableHead>
            <TableRow>
                <HeadCell isSelected={field === "Name"} order={order} coltype="string" name="Name"
                    scope="col" align='left' onClick={props.onClick}>
                    {strings.shinyrates.pokname}
                </HeadCell>

                <HeadCell isSelected={field === "Odds"} order={order} coltype="number" name="Odds"
                    align='center' onClick={props.onClick}>
                    {<>{strings.shinyrates.rate1}<wbr />{strings.shinyrates.rate2}</>}
                </HeadCell>

                <HeadCell isSelected={field === "Odds"} order={order} coltype="number" name="Odds"
                    align='center' onClick={props.onClick}>

                    {strings.shinyrates.rateest}
                    <Tooltip placement="top" arrow
                        title={<Typography color="inherit">{strings.shinyrates.tip}</Typography>}>
                        <DefaultIconStyle>
                            <HelpOutlineIcon />
                        </DefaultIconStyle>
                    </Tooltip>

                </HeadCell>

                <HeadCell isSelected={field === "Checks"} order={order} coltype="number" name="Checks"
                    align='center' onClick={props.onClick}>
                    {strings.shinyrates.checks}
                </HeadCell>

            </TableRow>
        </TableHead>
    )
});

export default ShinyTableHead;

ShinyTableHead.propTypes = {
    onClick: PropTypes.func.isRequired,
    active: PropTypes.object.isRequired,
};