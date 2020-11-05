import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomPokemons/CustomPokemons";

let strings = new LocalizedStrings(userLocale)

const useStyles = makeStyles((theme) => ({
    pokBoxTitle: {
        fontWeight: "400",
        fontSize: "13pt",
    },
    filter: {
        cursor: "pointer",
    },
    iconButton: {
        outline: "none !important",
        width: 28,
        height: 28,
    },
}));

const PokemonBoxTitle = React.memo(function PokemonBoxTitle(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Grid container justify="space-between" alignItems="center" className={classes.pokBoxTitle}>
            <Grid item>
                {`${strings.userpok.have} (${props.have}/${props.limit})`}
            </Grid>

            <Grid item xs="auto" onClick={props.onClick} className={classes.filter}>
                <Grid container alignItems="center">
                    <Box>{strings.userpok.filt}</Box>

                    <Box marginX={1}>
                        {props.showCollapse ?
                            <IconButton className={classes.iconButton}>
                                <KeyboardArrowUpIcon style={{ fontSize: '28px' }} />
                            </IconButton>

                            :
                            <IconButton className={classes.iconButton}>
                                <KeyboardArrowDownIcon style={{ fontSize: '28px' }} />
                            </IconButton>
                        }
                    </Box>
                </Grid>
            </Grid>

        </Grid >
    )
});

export default PokemonBoxTitle;

PokemonBoxTitle.propTypes = {
    onClick: PropTypes.func,
    showCollapse: PropTypes.bool,

    have: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    limit: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};
