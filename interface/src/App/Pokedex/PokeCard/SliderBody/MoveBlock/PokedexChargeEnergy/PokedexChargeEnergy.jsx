import React from "react"
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const useStyles = props => makeStyles(theme => {
    return ({
        energyCell: {
            height: "7px",
            borderRadius: "2px",
            backgroundColor: props.type === 1 ? "rgba(255, 255, 255, 0.432)" : "rgba(0, 0, 0, 0.438)",
        },
        marginLeft: {
            marginLeft: `${theme.spacing(0.5)}px`,
        }
    })
});

const PokedexChargeEnergy = React.memo(function PokedexChargeEnergy(props) {
    const { MoveType, Energy } = props.move;
    const classes = useStyles({ type: MoveType })();;

    return (
        <Tooltip arrow placement="top" title={<Typography>{Energy}</Typography>}>
            <Grid container justify="space-between">

                <Grid item xs className={classes.energyCell} />

                {Math.abs(Energy) < 100 &&
                    <Grid item xs className={`${classes.energyCell} ${classes.marginLeft}`} />}

                {Math.abs(Energy) < 50 &&
                    <Grid item xs className={`${classes.energyCell} ${classes.marginLeft}`} />}

            </Grid>
        </Tooltip>
    )
});

export default PokedexChargeEnergy;

PokedexChargeEnergy.propTypes = {
    move: PropTypes.object,
};