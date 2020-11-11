import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import EvoCard from "./EvoCard";
import Tier from "App/Evolve/EvoList/EvoTiers/Tier/Tier";
import { ReactComponent as Candy } from "icons/candy.svg";

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";

let strings = new LocalizedStrings(dexLocale);

const useStyles = makeStyles((theme) => ({
    icon: {
        width: 18,
        height: 18,
        marginLeft: `${theme.spacing(0.5)}px`,
        marginRight: `${theme.spacing(1)}px`,
    },
}));

const EvoBlock = React.memo(function EvoBlock(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    let arr = [[]]
    let candies = [0, 0]

    for (const [key, evoStages] of Object.entries(props.value)) {
        if (!evoStages) {
            continue
        }
        evoStages.forEach((stage) => {
            switch (key) {
                case "FirstStage":
                    if (candies[0] < props.miscTable[stage.Name].Evo.Candy) { candies[0] = props.miscTable[stage.Name].Evo.Candy }
                    arr[0].push(<EvoCard key={stage.Name} name={stage.Name} pokTable={props.pokTable} />)
                    break
                case "SecondStage":
                    if (!arr[1]) { arr.push([]) }
                    if (candies[1] < props.miscTable[stage.Name].Evo.Candy) { candies[1] = props.miscTable[stage.Name].Evo.Candy }
                    arr[1].push(<EvoCard key={stage.Name} name={stage.Name} pokTable={props.pokTable} />)
                    break
                default:
            }
        });
    }

    return (
        <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>

                <Grid item xs={12}>
                    <Tier disableFont title={<Typography variant="body1">{`${strings.stage} 1`}</Typography>}>
                        <EvoCard name={props.familyName} pokTable={props.pokTable} />
                    </Tier>
                </Grid>

                {arr.map((elem, i) =>
                    <Grid item xs={12} key={i + "sep"}>
                        <Tier disableFont
                            title={
                                <Typography variant="body1">
                                    <Box component="span" display="flex" alignItems="center">
                                        {candies[i] > 0 &&
                                            <>
                                                {candies[i]}
                                                <Candy className={classes.icon} />
                                            </>}
                                        {`${strings.stage} ${i + 2}`}
                                    </Box>
                                </Typography>}
                        >
                            {elem}
                        </Tier>
                    </Grid>)}
            </Grid>
        </Grid>
    )

});

export default EvoBlock;

EvoBlock.propTypes = {
    miscTable: PropTypes.object,
    pokTable: PropTypes.object,

    value: PropTypes.object,
    familyName: PropTypes.string,
};