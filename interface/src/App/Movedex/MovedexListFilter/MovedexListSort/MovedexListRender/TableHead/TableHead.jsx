import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import HeadCell from "App/ShinyRates/ShinyTable/ShinyTableHead/HeadCell/HeadCell";

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movedex";

let strings = new LocalizedStrings(dexLocale);

const useStyles = makeStyles((theme) => ({
    borderLeft: {
        borderLeft: `1px solid ${theme.palette.tableCell.main}`,
    },
}));

const TableHead = React.memo(function TableHead(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    const order = Boolean(props.active.order);
    return (
        <MaterialTableHead>
            <TableRow>
                <HeadCell width="5%" coltype="string" name="Title" scope="col" align='left' onClick={props.onClick}
                    isSelected={props.active.field === "Title"} order={order}
                >
                    {strings.mt.n}
                </HeadCell>

                <HeadCell width="5%" coltype="number" name="MoveType" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "MoveType"} order={order}
                >
                    {strings.mt.tp}
                </HeadCell>

                <HeadCell className={classes.borderLeft} width="5%" coltype="number" name="Damage" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Damage"} order={order}
                >
                    <Tooltip placement="top" arrow title={<Typography>{strings.tip.rd}</Typography>}>
                        <Box>{strings.mt.rd}</Box>
                    </Tooltip>
                </HeadCell>

                <HeadCell width="5%" coltype="number" name="Energy" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Energy"} order={order}
                >
                    <Tooltip placement="top" arrow title={<Typography>{strings.tip.re}</Typography>}>
                        <Box>{strings.mt.re}</Box>
                    </Tooltip>
                </HeadCell>

                <HeadCell width="5%" coltype="number" name="Cooldown" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Cooldown"} order={order}
                >
                    <Tooltip placement="top" arrow title={<Typography>{strings.tip.cd}</Typography>}>
                        <Box>{strings.mt.cd}</Box>
                    </Tooltip>
                </HeadCell>

                <HeadCell className={classes.borderLeft} width="5%" coltype="number" name="PvpDamage" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "PvpDamage"} order={order}
                >
                    <Tooltip placement="top" arrow title={<Typography>{strings.tip.pd}</Typography>}>
                        <Box>{strings.mt.pd}</Box>
                    </Tooltip>
                </HeadCell>

                <HeadCell width="5%" coltype="number" name="PvpEnergy" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "PvpEnergy"} order={order}
                >
                    <Tooltip placement="top" arrow title={<Typography>{strings.tip.pe}</Typography>}>
                        <Box>{strings.mt.pe}</Box>
                    </Tooltip>
                </HeadCell>

                <HeadCell width="5%" coltype="number" name="PvpDurationSeconds" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "PvpDurationSeconds"} order={order}
                >
                    <Tooltip placement="top" arrow title={<Typography>{strings.tip.dr}</Typography>}>
                        <Box>{strings.mt.dr}</Box>
                    </Tooltip>
                </HeadCell>

                <HeadCell width="50%" coltype="string" name="Subject" scope="col" align='center' onClick={props.onClick}
                    isSelected={props.active.field === "Subject"} order={order}
                >
                    <Tooltip placement="top" arrow title={<Typography>{strings.tip.ef}</Typography>}>
                        <Box>{strings.mt.ef}</Box>
                    </Tooltip>
                </HeadCell>
            </TableRow>
        </MaterialTableHead>
    )

});

export default TableHead;

TableHead.propTypes = {
    sort: PropTypes.object,
    onClick: PropTypes.func,
};