import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PlayerStatistics from "App/PvE/Components/PveResult/PveResListFilter/PveResListSort/PveResListRender/PveResEntry/PlayerStatistics/PlayerStatistics";

const PlayerStatisticsWrapper = React.memo(function PlayerStatisticsWrapper(props) {

    const bossHP = props.tables.hp[props.snapshot.bossObj.Tier]

    return (
        <Grid container>
            {props.title &&
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <b>{props.title}</b>
                    </Typography>
                </Grid>}

            <Grid item xs={12}>
                <PlayerStatistics
                    bounds={{
                        up: ((bossHP - props.value.dAvg) / bossHP * 100).toFixed(1),
                        low: ((bossHP - props.value.dAvg) / bossHP * 100).toFixed(1),
                        avg: ((bossHP - props.value.dAvg) / bossHP * 100).toFixed(1),

                    }}

                    remain={{
                        avg: (bossHP - props.value.dAvg).toFixed(0),
                        nbOfWins: (props.value.nbOfWins),
                    }}

                    stats={{ ttwAvg: props.value.ttwAvg, dAvg: (props.value.dAvg / bossHP * 100).toFixed(1) }}

                    impact={props.value.playerImpact}
                    bossHP={bossHP}

                    onClick={props.onClick}
                    showCollapse={props.showCollapse}
                    disableCollapse={props.disableCollapse}
                />
            </Grid>
        </Grid>
    )
});

export default PlayerStatisticsWrapper;

PlayerStatisticsWrapper.propTypes = {
    value: PropTypes.object,
    title: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),
    disableCollapse: PropTypes.bool,

    tables: PropTypes.object,
    snapshot: PropTypes.object,

    onClick: PropTypes.func,
    showCollapse: PropTypes.bool,
};