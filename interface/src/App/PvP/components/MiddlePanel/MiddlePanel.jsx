import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { FaCalculator } from 'react-icons/fa';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import Result from "../Result";
import Button from "App/Components/Button/Button";
import PvpReconstruction from "../PvpReconstruction/PvpReconstruction";
import Indicators from "../Indicators/Indicators";
import URI from "../URI/URI";

import { getCookie } from "js/getCookie";
import { pvp } from "locale/Pvp/Pvp";

let strings = new LocalizedStrings(pvp);

const MiddlePanel = React.memo(function MiddlePanel(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container spacing={1} style={{ height: "100%" }} alignItems="flex-end">

            {props.showResult &&
                <Box clone order={{ xs: 2, md: 1 }} alignSelf="flex-start">
                    <Grid item xs={12}>
                        <GreyPaper elevation={4} enablePadding paddingMult={1}>

                            <Grid container justify="center" spacing={2}>

                                <Box clone order={{ xs: 2, md: 1 }}>
                                    <Grid item xs={12}>
                                        <Result isSingle={true}>
                                            {props.result}
                                        </Result>
                                    </Grid>
                                </Box>

                                {props.url &&
                                    <Box clone order={{ xs: 1, md: 2 }}>
                                        <Grid item xs={12}>
                                            <URI value={props.url} />
                                        </Grid>
                                    </Box>}

                            </Grid>

                        </GreyPaper>
                    </Grid>
                </Box>}

            < Box clone order={{ xs: 1, md: 2 }} alignSelf="flex-end" >
                <Grid item xs={12} container alignItems="center">

                    <Grid item xs={12} container alignItems="center" wrap="nowrap">

                        {props.attacker.name && props.pokemonTable[props.attacker.name] &&
                            <Grid item xs="auto">
                                <Indicators
                                    value={props.attacker}
                                    pokemonTable={props.pokemonTable}
                                    attr="Attacker"

                                    effDef={props.defender.effDef}
                                    chargeMove1={props.moveTable[props.attacker.ChargeMove1]}
                                    chargeMove2={props.moveTable[props.attacker.ChargeMove2]}

                                    attackerTypes={props.pokemonTable[props.attacker.name].Type}
                                    defenderTypes={props.pokemonTable[props.defender.name] ? props.pokemonTable[props.defender.name].Type : ""}
                                />
                            </Grid>}

                        <Grid item xs container justify="center">
                            <Button
                                loading={props.loading}
                                title={strings.buttons.calculate}
                                onClick={props.submitForm}
                                endIcon={<FaCalculator />}
                            />
                        </Grid>

                        {props.defender.name && props.pokemonTable[props.defender.name] &&
                            <Grid item xs="auto">
                                <Indicators
                                    value={props.defender}
                                    pokemonTable={props.pokemonTable}
                                    attr="Defender"

                                    effDef={props.attacker.effDef}
                                    chargeMove1={props.moveTable[props.defender.ChargeMove1]}
                                    chargeMove2={props.moveTable[props.defender.ChargeMove2]}

                                    attackerTypes={props.pokemonTable[props.defender.name].Type}
                                    defenderTypes={(props.pokemonTable[props.attacker.name]) ? props.pokemonTable[props.attacker.name].Type : ""}
                                />
                            </Grid>}

                    </Grid>

                    {props.isError &&
                        <Box clone mt={1}>
                            <Grid item xs={12}>
                                <Alert variant="filled" severity="error">{props.error}</Alert >
                            </Grid>
                        </Box>}

                    {props.showResult &&
                        <Box clone mt={1}>
                            <Grid item xs={12} container alignItems="center" wrap="nowrap">
                                <PvpReconstruction
                                    onMouseEnter={props.onMouseEnter}
                                    constructorOn={props.constructorOn}
                                    value={props.result}
                                    moveTable={props.moveTable} />
                            </Grid>
                        </Box>}
                </Grid>
            </Box >
        </Grid >
    )
});

export default MiddlePanel;

MiddlePanel.propTypes = {
    attacker: PropTypes.object,
    defender: PropTypes.object,
    result: PropTypes.object,

    moveTable: PropTypes.object,
    pokemonTable: PropTypes.object,

    url: PropTypes.string,
    error: PropTypes.string,

    loading: PropTypes.bool,
    isError: PropTypes.bool,
    showResult: PropTypes.bool,

    constructorOn: PropTypes.func,
    onMouseEnter: PropTypes.func,
    submitForm: PropTypes.func,
};