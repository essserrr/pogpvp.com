import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
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
    }
}));

const PokemonBoxTitle = React.memo(function PokemonBoxTitle(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Grid container justify="space-between" alignContent="center" className={classes.pokBoxTitle}>
            <Grid item>
                {`${strings.userpok.have} (${props.have}/${props.limit})`}
            </Grid>

            <Grid item xs="auto" onClick={props.onClick} className={classes.filter}>
                <Grid container alignContent="center">
                    <Box>{strings.userpok.filt}</Box>

                    <Box marginX={1}>
                        {props.showCollapse ?
                            <ExpandLessIcon style={{ fontSize: '28px' }} />
                            :
                            <ExpandMoreIcon style={{ fontSize: '28px' }} />
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
