import React from "react"

import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";

import Stats from "App/Components/Stats/Stats";
import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';
import Stages from "./Stages/Stages"
import InitialStats from "./InitialStats/InitialStats"
import Maximizer from "./Maximizer/Maximizer"
import CpAndTyping from "App/Components/CpAndTypes/CpAndTypes"
import EffectiveStats from "./EffectiveStats/EffectiveStats"
import MagicBox from "./MagicBox/MagicBox"
import PokemonSelect from "../../Userpage/CustomPokemon/PartyBox/PokemonSelect/PokemonSelect"
import MoveTip from "./MoveTip/MoveTip";

import MoveSelect from "App/Components/MoveSelect/MoveSelect";

import LocalizedStrings from "react-localization"
import { pvp } from "locale/Pvp/Pvp";
import { getCookie } from "js/getCookie";
import { options } from "locale/Components/Options/locale";

import "./Pokemon.scss"

let strings = new LocalizedStrings(pvp);
let optionStrings = new LocalizedStrings(options);

class Pokemon extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    }

    render() {

        return (
            <Grid container className={`pokemon ${this.props.className ? this.props.className : ""}`} spacing={1}>

                <MagicBox open={Boolean(this.props.showMenu)} onClick={this.props.onClick} attr={this.props.attr}>
                    <SearchableSelect disableClearable label={"fullLabel"} name={this.props.category}
                        attr={this.props.attr} onChange={this.props.onChange}>
                        {this.props.moveList}
                    </SearchableSelect>
                </MagicBox>

                {this.props.userPokemon && this.props.userPokemon.length > 0 &&
                    <Grid item xs={12}>
                        <PokemonSelect label={strings.userPok} pokemonTable={this.props.pokemonTable}
                            attr={this.props.attr} name="userPokemon" onChange={this.props.onChange}>
                            {this.props.userPokemon}
                        </PokemonSelect>
                    </Grid>}

                {this.props.pokList &&
                    <Grid item xs={12}>
                        <SearchableSelect disableClearable label={strings.allPok}
                            value={this.props.value.name} attr={this.props.attr} name="Name" onChange={this.props.onChange}>
                            {this.props.pokList}
                        </SearchableSelect>
                    </Grid>}

                {(this.props.pokemonTable[this.props.value.name] && this.props.value.name) &&
                    <>
                        <Grid item xs={12}>
                            <CpAndTyping
                                Lvl={this.props.value.Lvl}
                                Atk={this.props.value.Atk}
                                Def={this.props.value.Def}
                                Sta={this.props.value.Sta}

                                isShadow={this.props.value.IsShadow === "true"}

                                pokemonTable={this.props.pokemonTable}
                                name={this.props.value.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <EffectiveStats
                                effAtk={this.props.value.effAtk}
                                effDef={this.props.value.effDef}
                                effSta={this.props.value.effSta}
                                AtkStage={Number(this.props.value.AtkStage)}
                                DefStage={Number(this.props.value.DefStage)}
                                attr={this.props.attr}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Stats
                                Lvl={String(this.props.value.Lvl)}
                                Atk={String(this.props.value.Atk)}
                                Def={String(this.props.value.Def)}
                                Sta={String(this.props.value.Sta)}
                                attr={this.props.attr}
                                onChange={this.props.onChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Maximizer
                                attr={this.props.attr}
                                category={"defaultStatMaximizer"}
                                value={this.props.value.maximizer}
                                onChange={this.props.onChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <InitialStats
                                InitialHP={this.props.value.InitialHP}
                                InitialEnergy={this.props.value.InitialEnergy}
                                attr={this.props.attr}
                                onChange={this.props.onChange}

                                label={strings.title.initialStats}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Stages
                                Atk={Number(this.props.value.AtkStage)}
                                Def={Number(this.props.value.DefStage)}
                                attr={this.props.attr}
                                onChange={this.props.onChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Input select name="Shields" value={this.props.value.Shields}
                                attr={this.props.attr} label={strings.title.shields} onChange={this.props.onChange}>
                                <MenuItem value="0">0</MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                            </Input>
                        </Grid>

                        <Grid item xs={12}>
                            <WithIcon tip={<>{strings.tips.strategy.greedy}<br /><br />{strings.tips.strategy.shieldSaving}</>}>
                                <Input select name="IsGreedy" value={this.props.value.IsGreedy}
                                    attr={this.props.attr} label={strings.title.strategy} onChange={this.props.onChange}>
                                    <MenuItem value="true">{optionStrings.options.strategy.greedy}</MenuItem>
                                    <MenuItem value="false">{optionStrings.options.strategy.shieldSaving}</MenuItem>
                                </Input>
                            </WithIcon>
                        </Grid>

                        <Grid item xs={12}>
                            <WithIcon tip={strings.tips.shadow}>
                                <Input select name="IsShadow" value={this.props.value.IsShadow}
                                    attr={this.props.attr} label={strings.title.type} onChange={this.props.onChange}>
                                    <MenuItem value="false">{optionStrings.options.type.normal}</MenuItem>
                                    <MenuItem value="true">{optionStrings.options.type.shadow}</MenuItem>
                                </Input>
                            </WithIcon>
                        </Grid>

                        <Grid item xs={12}>
                            <MoveSelect name="QuickMove" attr={this.props.attr} onChange={this.props.onChange}
                                value={this.props.value.QuickMove &&
                                    this.props.moveTable[this.props.value.QuickMove] !== undefined && this.props.value.QuickMove}
                                moveType={this.props.moveTable[this.props.value.QuickMove] !== undefined ?
                                    this.props.moveTable[this.props.value.QuickMove].MoveType : ""}

                                label={strings.title.quickMove}
                                tip={<MoveTip moveName={this.props.value.QuickMove} moveTable={this.props.moveTable} />}
                            >
                                {this.props.value.quickMovePool}
                            </MoveSelect>
                        </Grid>

                        <Grid item xs={12}>
                            <MoveSelect
                                value={(this.props.value.ChargeMove1 && this.props.value.ChargeMove1 !== "Select..." &&
                                    this.props.moveTable[this.props.value.ChargeMove1] !== undefined) ? this.props.value.ChargeMove1 : ""}
                                moveType={(this.props.moveTable[this.props.value.ChargeMove1] !== undefined) ?
                                    this.props.moveTable[this.props.value.ChargeMove1].MoveType : ""}

                                name="ChargeMove1" attr={this.props.attr} onChange={this.props.onChange}

                                label={strings.title.chargeMove}
                                tip={<MoveTip moveName={this.props.value.ChargeMove1} moveTable={this.props.moveTable} />}
                            >
                                {this.props.value.chargeMovePool}
                            </MoveSelect>
                        </Grid>

                        <Grid item xs={12}>
                            <MoveSelect
                                value={(this.props.value.ChargeMove2 && this.props.moveTable[this.props.value.ChargeMove2] !== undefined &&
                                    this.props.value.ChargeMove2 !== "Select...") ? this.props.value.ChargeMove2 : ""}
                                moveType={(this.props.moveTable[this.props.value.ChargeMove2] !== undefined) ?
                                    this.props.moveTable[this.props.value.ChargeMove2].MoveType : ""}

                                name="ChargeMove2" attr={this.props.attr} onChange={this.props.onChange}

                                label={strings.title.chargeMove}
                                tip={<MoveTip moveName={this.props.value.ChargeMove2} moveTable={this.props.moveTable} />}
                            >
                                {this.props.value.chargeMovePool}
                            </MoveSelect>
                        </Grid>
                    </>}
            </Grid>
        )
    }

}

export default Pokemon