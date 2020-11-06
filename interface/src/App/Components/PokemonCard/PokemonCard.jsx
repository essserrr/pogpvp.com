import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    pokeCard: {
        border: `1px solid ${fade(theme.palette.text.disabled, 0.25)}`,
        borderRadius: `${theme.spacing(0.5)}px`,
    },
    title: {
        borderBottom: `1px solid ${fade(theme.palette.text.disabled, 0.25)}`
    },
}));

const PokemonCard = React.memo(function (props) {
    const classes = useStyles();
    const { title, icon, body, footer, className, ...other } = props;

    return (
        <Paper elevation={4} className={`${classes.pokeCard} ${className ? className : ""}`} {...other}>
            <Grid container justify="center" alignItems="center">
                <Grid item xs={12} className={`${classes.title} pokeCard-title`}>
                    {title}
                </Grid>

                <Grid item xs="auto" className="pokeCard-icon">
                    {icon}
                </Grid>
                <Grid item xs className="pokeCard-body">
                    {body}
                </Grid>

                {props.footer &&
                    <Grid item xs={12} className="pokeCard-footer">
                        {footer}
                    </Grid>}
            </Grid>
        </Paper>
    )

});

export default PokemonCard;

PokemonCard.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    icon: PropTypes.node,
    body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    footer: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
};