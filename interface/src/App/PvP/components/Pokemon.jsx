import React from "react"

import MenuItem from '@material-ui/core/MenuItem';

import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";

import Stats from "App/Components/Stats/Stats";
import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';
import Stages from "./Stages/Stages"
import InitialStats from "./InitialStats/InitialStats"
import MaximizerNoSubmit from "./MaximizerRadio/MaximizerNoSubmit"
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
            <div className={`pokemon ${this.props.className ? this.props.className : ""}`}>
                {(this.props.showMenu) && <MagicBox
                    title={strings.title.selectMove}
                    onClick={this.props.onClick}
                    attr={this.props.attr}
                    element={
                        <SearchableSelect
                            disableClearable
                            label={"fullLabel"}
                            name={this.props.category}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                        >
                            {this.props.moveList}
                        </SearchableSelect>}
                />}

                {this.props.userPokemon && this.props.userPokemon.length > 0 &&
                    <div className="col-12 px-0 mt-1 mb-2">
                        <PokemonSelect
                            label={strings.userPok}
                            attr={this.props.attr}
                            category="userPokemon"

                            pokemonTable={this.props.pokemonTable}
                            onChange={this.props.onChange}
                        >
                            {this.props.userPokemon}
                        </PokemonSelect>
                    </div>}

                {this.props.pokList &&
                    <SearchableSelect
                        disableClearable
                        label={strings.allPok}

                        value={this.props.value.name}
                        attr={this.props.attr}
                        name="Name"

                        onChange={this.props.onChange}
                    >
                        {this.props.pokList}
                    </SearchableSelect>}

                {(this.props.pokemonTable[this.props.value.name] && this.props.value.name) &&
                    <>
                        <CpAndTyping
                            Lvl={this.props.value.Lvl}
                            Atk={this.props.value.Atk}
                            Def={this.props.value.Def}
                            Sta={this.props.value.Sta}

                            isShadow={this.props.value.IsShadow === "true"}

                            pokemonTable={this.props.pokemonTable}
                            name={this.props.value.name}
                        />

                        <EffectiveStats
                            effAtk={this.props.value.effAtk}
                            effDef={this.props.value.effDef}
                            effSta={this.props.value.effSta}
                            AtkStage={this.props.value.AtkStage}
                            DefStage={this.props.value.DefStage}
                            attr={this.props.attr}
                        />

                        <Stats
                            Lvl={this.props.value.Lvl}
                            Atk={this.props.value.Atk}
                            Def={this.props.value.Def}
                            Sta={this.props.value.Sta}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                        />
                        <MaximizerNoSubmit
                            attr={this.props.attr}
                            action={"defaultStatMaximizer"}
                            value={this.props.value.maximizer}
                            onChange={this.props.onChange}
                        />
                        <InitialStats
                            InitialHP={this.props.value.InitialHP}
                            InitialEnergy={this.props.value.InitialEnergy}
                            attr={this.props.attr}
                            onChange={this.props.onChange}

                            label={strings.title.initialStats}
                            for=""
                        />

                        <Stages
                            Atk={this.props.value.AtkStage}
                            Def={this.props.value.DefStage}
                            attr={this.props.attr}
                            onChange={this.props.onChange}

                            label={strings.title.initialStages}
                            for=""
                        />


                        <Input select name="Shields" value={this.props.value.Shields}
                            attr={this.props.attr} label={strings.title.shields} onChange={this.props.onChange}>
                            <MenuItem value="0">0</MenuItem>
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                        </Input>


                        <WithIcon tip={<>{strings.tips.strategy.greedy}<br /><br />{strings.tips.strategy.shieldSaving}</>}>
                            <Input select name="IsGreedy" value={this.props.value.IsGreedy}
                                attr={this.props.attr} label={strings.title.strategy} onChange={this.props.onChange}>

                                <MenuItem value="true">{optionStrings.options.strategy.greedy}</MenuItem>
                                <MenuItem value="false">{optionStrings.options.strategy.shieldSaving}</MenuItem>

                            </Input>
                        </WithIcon>

                        <WithIcon tip={strings.tips.shadow}>
                            <Input select name="IsShadow" value={this.props.value.IsShadow}
                                attr={this.props.attr} label={strings.title.type} onChange={this.props.onChange}>

                                <MenuItem value="false">{optionStrings.options.type.normal}</MenuItem>
                                <MenuItem value="true">{optionStrings.options.type.shadow}</MenuItem>

                            </Input>
                        </WithIcon>


                        <MoveSelect
                            value={this.props.value.QuickMove && this.props.moveTable[this.props.value.QuickMove] !== undefined && this.props.value.QuickMove}
                            moveType={(this.props.moveTable[this.props.value.QuickMove] !== undefined) ?
                                this.props.moveTable[this.props.value.QuickMove].MoveType : ""}

                            name="QuickMove"
                            attr={this.props.attr}
                            onChange={this.props.onChange}

                            label={strings.title.quickMove}

                            tip={<MoveTip moveName={this.props.value.QuickMove} moveTable={this.props.moveTable} />}
                        >
                            {this.props.value.quickMovePool}
                        </MoveSelect>









                        <MoveSelect
                            value={(this.props.value.ChargeMove1 && this.props.value.ChargeMove1 !== "Select..." &&
                                this.props.moveTable[this.props.value.ChargeMove1] !== undefined) ? this.props.value.ChargeMove1 : ""}
                            moveType={(this.props.moveTable[this.props.value.ChargeMove1] !== undefined) ?
                                this.props.moveTable[this.props.value.ChargeMove1].MoveType : ""}

                            name="ChargeMove1"
                            attr={this.props.attr}
                            onChange={this.props.onChange}

                            label={strings.title.chargeMove}

                            tip={<MoveTip moveName={this.props.value.ChargeMove1} moveTable={this.props.moveTable} />}
                        >
                            {this.props.value.chargeMovePool}
                        </MoveSelect>







                        <MoveSelect
                            value={(this.props.value.ChargeMove2 && this.props.moveTable[this.props.value.ChargeMove2] !== undefined &&
                                this.props.value.ChargeMove2 !== "Select...") ?
                                this.props.value.ChargeMove2 : ""}
                            moveType={(this.props.moveTable[this.props.value.ChargeMove2] !== undefined) ?
                                this.props.moveTable[this.props.value.ChargeMove2].MoveType : ""}

                            name="ChargeMove2"
                            attr={this.props.attr}
                            onChange={this.props.onChange}

                            label={strings.title.chargeMove}

                            tip={<MoveTip moveName={this.props.value.ChargeMove2} moveTable={this.props.moveTable} />}
                        >
                            {this.props.value.chargeMovePool}
                        </MoveSelect>
                    </>}
            </div>
        )
    }

}

export default Pokemon