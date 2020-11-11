import React from "react";
import LocalizedStrings from "react-localization";
import { useMediaQuery } from 'react-responsive';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import StatsTriangle from "../StatsTriangle/StatsTriangle";
import CP from "App/Components/CpAndTypes/CP";
import Iconer from "App/Components/Iconer/Iconer";
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";

import "./MainBlock.scss";

let strings = new LocalizedStrings(dexLocale);

const useStyles = makeStyles((theme) => ({
    dFlex: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        height: "fit-content",
        marginRight: `${theme.spacing(3)}px`,
        [theme.breakpoints.down('xs')]: {
            marginRight: 0,
        },
    },

    icon: {
        flex: "1",
        maxWidth: "210px",
        maxHeight: "210px",
        objectFit: "contain",
    },
    cardTitle: {
        fontFamily: '"Baloo Bhaina", cursive',
        fontSize: "1.5em",
        fontWeight: "700",
    },
    cardText: {
        fontSize: "1.1em",
        fontWeight: "400",
    },
    downSMTextAlign: {
        [theme.breakpoints.down('xs')]: {
            textAlign: "center",
        },
    },
    downSMJustify: {
        [theme.breakpoints.down('xs')]: {
            justifyContent: "center",
        },
    }
}));

const MainBlock = React.memo(function MainBlock(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    const isSM = useMediaQuery({ query: '(max-width: 576px)' })
    const fileName = `${props.value.Number}${props.value.Forme !== "" ? `-${props.value.Forme}` : ""}`
    const title = `# ${props.value.Number} ${props.value.Title}`;

    return (
        <Grid container justify="center" spacing={2}>
            {isSM &&
                <Grid container item xs={12} justify="center">
                    <Typography className={classes.cardTitle}>{title}</Typography>
                </Grid>}

            <Grid className={`${classes.dFlex} ${classes.iconContainer}`} item xs={12} sm="auto">
                <Iconer className={classes.icon} fileName={fileName} folderName={"/art/"} />
            </Grid>

            <Grid item xs>
                {!isSM &&
                    <Grid container>
                        <Typography className={classes.cardTitle}>{title}</Typography>
                    </Grid>}
                <Grid className={classes.downSMTextAlign} container alignItems="center">

                    <Grid item xs container spacing={1}>

                        {props.pokMisc && props.pokMisc.ShortDescr !== "" &&
                            <Grid item xs={12}>
                                <Box className={classes.cardText} fontWeight="bold !important">
                                    {props.pokMisc.ShortDescr}
                                </Box>
                            </Grid>}

                        <Grid className={`${classes.downSMJustify} ${classes.cardText}`} item xs={12} container alignItems="center">
                            <Box component="span" className={classes.cardText}>{`${strings.mt.tp}:`}</Box>

                            <Box component="span" ml={1}>
                                <Iconer size={24} folderName="/type/" fileName={String(props.value.Type[0])} />
                            </Box>

                            {props.value.Type.length > 1 &&
                                <Box component="span" ml={1}>
                                    <Iconer size={24} folderName="/type/" fileName={String(props.value.Type[1])}
                                    />
                                </Box>}
                        </Grid>

                        <Grid item xs={12} className={classes.cardText}>
                            {"Max CP: "}
                            <Box component="span" fontWeight="bold">
                                <CP name={props.value.Title} Lvl={40} Atk={15} Def={15} Sta={15} pokemonTable={props.pokTable} />
                            </Box>
                        </Grid>

                        <Grid item xs={12} className={classes.cardText}>
                            {`${strings.generation} ${props.value.Generation}`}
                        </Grid>

                    </Grid>

                    <Grid item xs={"auto"} sm>
                        <StatsTriangle value={props.value}
                            boxWidth={170} boxHeight={120} length={120}
                            strokeMain={1.5} strokeSec={0.5}
                        />
                    </Grid>

                </Grid>

            </Grid>
        </Grid>
    )

});

export default MainBlock;

MainBlock.propTypes = {
    value: PropTypes.object,
    pokMisc: PropTypes.object,

    moveTable: PropTypes.object.isRequired,
    pokTable: PropTypes.object.isRequired,
};