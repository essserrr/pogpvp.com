import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";
import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import Stats from "App/Components/Stats/Stats";
import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';
import Stages from "./Stages/Stages";
import InitialStats from "./InitialStats/InitialStats";
import Maximizer from "./Maximizer/Maximizer";
import CpAndTyping from "App/Components/CpAndTypes/CpAndTypes";
import EffectiveStats from "./EffectiveStats/EffectiveStats";
import MagicBox from "./MagicBox/MagicBox";
import PokemonSelect from "App/Userpage/CustomPokemon/PartyBox/PokemonSelect/PokemonSelect";
import MoveTip from "./MoveTip/MoveTip";
import MoveSelect from "App/Components/MoveSelect/MoveSelect";

import { pvp } from "locale/Pvp/Pvp";
import { getCookie } from "js/getCookie";
import { options } from "locale/Components/Options/locale";

let strings = new LocalizedStrings(pvp);
let optionStrings = new LocalizedStrings(options);

const Pokemon = React.memo(function Pokemon(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    return (
        <GreyPaper elevation={4} enablePadding paddingMult={0.5}>
            <Grid container spacing={1}>

                <MagicBox open={Boolean(props.showMenu)} onClick={props.onClick} attr={props.attr}>
                    <SearchableSelect disableClearable label={strings.title.selectMove} name={props.category}
                        attr={props.attr} onChange={props.onChange}>
                        {props.moveList}
                    </SearchableSelect>
                </MagicBox>

                {props.userPokemon && props.userPokemon.length > 0 &&
                    <Grid item xs={12}>
                        <PokemonSelect label={strings.userPok} pokemonTable={props.pokemonTable}
                            attr={props.attr} name="userPokemon" onChange={props.onChange}>
                            {props.userPokemon}
                        </PokemonSelect>
                    </Grid>}

                {props.pokList &&
                    <Grid item xs={12}>
                        <SearchableSelect disableClearable label={strings.allPok}
                            value={props.value.name} attr={props.attr} name="Name" onChange={props.onChange}>
                            {props.pokList}
                        </SearchableSelect>
                    </Grid>}

                {(props.pokemonTable[props.value.name] && props.value.name) &&
                    <>
                        <Grid item xs={12}>
                            <CpAndTyping
                                Lvl={props.value.Lvl}
                                Atk={props.value.Atk}
                                Def={props.value.Def}
                                Sta={props.value.Sta}

                                isShadow={props.value.IsShadow === "true"}

                                pokemonTable={props.pokemonTable}
                                name={props.value.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <EffectiveStats
                                effAtk={props.value.effAtk}
                                effDef={props.value.effDef}
                                effSta={props.value.effSta}
                                AtkStage={Number(props.value.AtkStage)}
                                DefStage={Number(props.value.DefStage)}
                                attr={props.attr}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Stats
                                Lvl={String(props.value.Lvl)}
                                Atk={String(props.value.Atk)}
                                Def={String(props.value.Def)}
                                Sta={String(props.value.Sta)}
                                attr={props.attr}
                                onChange={props.onChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Maximizer
                                attr={props.attr}
                                category={"defaultStatMaximizer"}
                                value={props.value.maximizer}
                                onChange={props.onChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <InitialStats
                                InitialHP={props.value.InitialHP}
                                InitialEnergy={props.value.InitialEnergy}
                                attr={props.attr}
                                onChange={props.onChange}

                                label={strings.title.initialStats}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Stages
                                Atk={Number(props.value.AtkStage)}
                                Def={Number(props.value.DefStage)}
                                attr={props.attr}
                                onChange={props.onChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Input select name="Shields" value={props.value.Shields}
                                attr={props.attr} label={strings.title.shields} onChange={props.onChange}>
                                <MenuItem value="0">0</MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                            </Input>
                        </Grid>

                        <Grid item xs={12}>
                            <WithIcon tip={<>{strings.tips.strategy.greedy}<br /><br />{strings.tips.strategy.shieldSaving}</>}>
                                <Input select name="IsGreedy" value={props.value.IsGreedy}
                                    attr={props.attr} label={strings.title.strategy} onChange={props.onChange}>
                                    <MenuItem value="true">{optionStrings.options.strategy.greedy}</MenuItem>
                                    <MenuItem value="false">{optionStrings.options.strategy.shieldSaving}</MenuItem>
                                </Input>
                            </WithIcon>
                        </Grid>

                        <Grid item xs={12}>
                            <WithIcon tip={strings.tips.shadow}>
                                <Input select name="IsShadow" value={props.value.IsShadow}
                                    attr={props.attr} label={strings.title.type} onChange={props.onChange}>
                                    <MenuItem value="false">{optionStrings.options.type.normal}</MenuItem>
                                    <MenuItem value="true">{optionStrings.options.type.shadow}</MenuItem>
                                </Input>
                            </WithIcon>
                        </Grid>

                        <Grid item xs={12}>
                            <MoveSelect name="QuickMove" attr={props.attr} onChange={props.onChange}
                                value={props.value.QuickMove &&
                                    props.moveTable[props.value.QuickMove] !== undefined && props.value.QuickMove}
                                moveType={props.moveTable[props.value.QuickMove] !== undefined ?
                                    props.moveTable[props.value.QuickMove].MoveType : ""}

                                label={strings.title.quickMove}
                                tip={<MoveTip moveName={props.value.QuickMove} moveTable={props.moveTable} />}
                            >
                                {props.value.quickMovePool}
                            </MoveSelect>
                        </Grid>

                        <Grid item xs={12}>
                            <MoveSelect
                                value={(props.value.ChargeMove1 && props.value.ChargeMove1 !== "Select..." &&
                                    props.moveTable[props.value.ChargeMove1] !== undefined) ? props.value.ChargeMove1 : ""}
                                moveType={(props.moveTable[props.value.ChargeMove1] !== undefined) ?
                                    props.moveTable[props.value.ChargeMove1].MoveType : ""}

                                name="ChargeMove1" attr={props.attr} onChange={props.onChange}

                                label={strings.title.chargeMove}
                                tip={<MoveTip moveName={props.value.ChargeMove1} moveTable={props.moveTable} />}
                            >
                                {props.value.chargeMovePool}
                            </MoveSelect>
                        </Grid>

                        <Grid item xs={12}>
                            <MoveSelect
                                value={(props.value.ChargeMove2 && props.moveTable[props.value.ChargeMove2] !== undefined &&
                                    props.value.ChargeMove2 !== "Select...") ? props.value.ChargeMove2 : ""}
                                moveType={(props.moveTable[props.value.ChargeMove2] !== undefined) ?
                                    props.moveTable[props.value.ChargeMove2].MoveType : ""}

                                name="ChargeMove2" attr={props.attr} onChange={props.onChange}

                                label={strings.title.chargeMove}
                                tip={<MoveTip moveName={props.value.ChargeMove2} moveTable={props.moveTable} />}
                            >
                                {props.value.chargeMovePool}
                            </MoveSelect>
                        </Grid>
                    </>}
            </Grid>
        </GreyPaper>
    )
});

export default Pokemon;

Pokemon.propTypes = {
    value: PropTypes.object,
    attr: PropTypes.string,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
    moveList: PropTypes.arrayOf(PropTypes.object),
    pokList: PropTypes.arrayOf(PropTypes.object),
    userPokemon: PropTypes.arrayOf(PropTypes.object),

    showMenu: PropTypes.bool,
    category: PropTypes.bool,

    onChange: PropTypes.func,
    statMaximizer: PropTypes.func,
    onClick: PropTypes.func,
};