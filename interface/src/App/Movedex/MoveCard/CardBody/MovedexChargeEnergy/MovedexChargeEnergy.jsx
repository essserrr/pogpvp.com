import React from "react";
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => makeStyles(theme => {
    return ({
        energyColor: {
            color: theme.palette.types[`type${props.type}`].text,
            backgroundColor: theme.palette.types[`type${props.type}`].background,
        },
        energyContainer: {
            width: "100px",
        },
        energyElement: {
            height: "10px",
            borderRadius: "2px",
        },
        marginLeft: {
            marginLeft: "4px",
        },
    })
});

const MovedexChargeEnergy = React.memo(function (props) {
    const { Energy, MoveType } = props.move;
    const classes = useStyles({ type: MoveType })();

    return (
        <Tooltip placement="top" arrow title={<Typography>{Energy}</Typography>}>

            <Grid className={classes.energyContainer} container justify="space-between" wrap="nowrap">
                <Grid className={`${classes.energyElement} ${classes.energyColor}`} item xs />
                {Math.abs(Energy) < 100 &&
                    <Grid className={`${classes.energyElement} ${classes.energyColor} ${classes.marginLeft}`} item xs />}
                {Math.abs(Energy) < 50 &&
                    <Grid className={`${classes.energyElement} ${classes.energyColor} ${classes.marginLeft}`} item xs />}

            </Grid>

        </Tooltip>
    )

});

export default MovedexChargeEnergy;

MovedexChargeEnergy.propTypes = {
    move: PropTypes.object.isRequired,
};