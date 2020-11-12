import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import HpBar from "../PhBar/HpBar"
import HpRemaining from "../HpRemaining/HpRemaining"
import FightStats from "../FightStats/FightStats"
import PlayersImpact from "../PlayersImpact/PlayersImpact"

const PlayerStatistics = React.memo(function PlayerStatistics(props) {
    return (
        <Grid container justify="flex-end" alignItems="flex-end" wrap="nowrap">

            <Grid item xs>
                <Grid item xs={12}>
                    <HpBar {...props.bounds} />
                </Grid>

                <Grid item xs={12}>
                    <HpRemaining {...props.remain} />
                </Grid>

                <Grid item xs={12}>
                    <FightStats {...props.stats} />

                    {props.impact && props.impact.length > 0 &&
                        <PlayersImpact impact={props.impact} bossHP={props.bossHP} />}
                </Grid>
            </Grid>

            {!props.disableCollapse &&
                <Grid item xs={"auto"}>
                    <IconButton onClick={props.onClick}
                        style={{ outline: "none", width: '28px', height: '28px' }}>
                        {props.showCollapse ?
                            <KeyboardArrowUpIcon style={{ fontSize: '28px' }} />
                            :
                            <KeyboardArrowDownIcon style={{ fontSize: '28px' }} />}
                    </IconButton>
                </Grid>}
        </Grid>
    )
});

export default PlayerStatistics;

PlayerStatistics.propTypes = {
    bounds: PropTypes.object,
    remain: PropTypes.object,
    stats: PropTypes.object,

    onClick: PropTypes.func,
    showCollapse: PropTypes.bool,
};