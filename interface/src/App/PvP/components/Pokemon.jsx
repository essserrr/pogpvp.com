import React from "react"
import Stats from "./Stats/Stats"
import SearchableSelect from "./SearchableSelect/SearchableSelect"
import SelectGroup from "./SelectGroup/SelectGroup"
import Stages from "./Stages/Stages"
import InitialStats from "./InitialStats/InitialStats"
import MaximizerNoSubmit from "./MaximizerRadio/MaximizerNoSubmit"
import CpAndTyping from "App/Components/CpAndTypes/CpAndTypes"
import EffectiveStats from "./EffectiveStats/EffectiveStats"
import MagicBox from "./MagicBox/MagicBox"
import PokemonSelect from "../../Userpage/CustomPokemon/PartyBox/PokemonSelect/PokemonSelect"

import MoveSelect from "App/Components/MoveSelect/MoveSelect";

import LocalizedStrings from "react-localization"
import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/getCookie"
import { options } from "locale/Components/Options/locale";

import "./Pokemon.scss"

let strings = new LocalizedStrings(locale);
let optionStrings = new LocalizedStrings(options);

class Pokemon extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        this.state = {
            shieldsList: [
                <option value="0" key="0">0</option>,
                <option value="1" key="1">1</option>,
                <option value="2" key="2">2</option>
            ],
            stagesList: [
                <option value="4" key="4">4</option>,
                <option value="3" key="3">3</option>,
                <option value="2" key="2">2</option>,
                <option value="1" key="1">1</option>,
                <option value="0" key="0">0</option>,
                <option value="-1" key="-1">-1</option>,
                <option value="-2" key="-2">-2</option>,
                <option value="-3" key="-3">-3</option>,
                <option value="-4" key="-4">-4</option>,
            ],
            stratigiesList: [
                <option value="true" key="Greedy">{optionStrings.options.strategy.greedy}</option>,
                <option value="false" key="Shieldsaving">{optionStrings.options.strategy.shieldSaving}</option>,
            ],
            typeList: [
                <option value="false" key="Normal">{optionStrings.options.type.normal}</option>,
                <option value="true" key="Shadow">{optionStrings.options.type.shadow}</option>,
            ],
        };
    }

    render() {
        return (
            <div className={`pokemon ${this.props.className ? this.props.className : ""}`}>
                {(this.props.showMenu) && <MagicBox
                    title={strings.title.selectMove}
                    onClick={this.props.onClick}
                    attr={this.props.attr}
                    element={<SearchableSelect
                        list={this.props.moveList}
                        attr={this.props.attr}
                        category={this.props.category}
                        onChange={this.props.onChange}
                    />}
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
                        label={strings.allPok}

                        value={this.props.value.name}
                        list={this.props.pokList}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                    />}

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

                            labelWidth={strings.stats.lvl === "Ур" ? "100px" : "84px"}
                            label={strings.title.initialStats}
                            for=""
                        />

                        <Stages
                            Atk={this.props.value.AtkStage}
                            Def={this.props.value.DefStage}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                            options={this.state.stagesList}

                            labelWidth={strings.stats.lvl === "Ур" ? "100px" : "84px"}
                            label={strings.title.initialStages}
                            for=""
                        />

                        <SelectGroup
                            name="Shields"
                            value={this.props.value.Shields}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                            options={this.state.shieldsList}

                            labelWidth={strings.stats.lvl === "Ур" ? "100px" : "84px"}
                            label={strings.title.shields}
                            for=""
                        />

                        <SelectGroup
                            name="IsGreedy"
                            value={this.props.value.IsGreedy}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                            options={this.state.stratigiesList}

                            labelWidth={strings.stats.lvl === "Ур" ? "100px" : "84px"}
                            label={strings.title.strategy}

                            place={this.props.attr === "attacker" ? "right" : (this.props.attr === "defender" ? "left" : "top")}
                            for={((this.props.attr === "attacker") ? "strategyA" : "strategyD")}
                            tip={<>
                                {strings.tips.strategy.greedy}
                                <br />
                                <br />
                                {strings.tips.strategy.shieldSaving}
                            </>}
                            tipClass="infoTip"
                        />

                        <SelectGroup
                            name="IsShadow"
                            value={this.props.value.IsShadow}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                            options={this.state.typeList}

                            labelWidth={strings.stats.lvl === "Ур" ? "100px" : "84px"}
                            label={strings.title.type}


                            place={"top"}
                            for={"shadow" + this.props.attr}

                            tip={strings.tips.shadow}
                            tipClass="infoTip"
                        />

                        <MoveSelect
                            value={this.props.value.QuickMove && this.props.moveTable[this.props.value.QuickMove] !== undefined && this.props.value.QuickMove}
                            moveType={(this.props.moveTable[this.props.value.QuickMove] !== undefined) ?
                                this.props.moveTable[this.props.value.QuickMove].MoveType : ""}

                            name="QuickMove"
                            attr={this.props.attr}
                            onChange={this.props.onChange}

                            label={strings.title.quickMove}

                            tip={<>{strings.tips.quick}<br />
                                {this.props.value.QuickMove && <>
                                    {strings.move.damage + (this.props.moveTable[this.props.value.QuickMove].PvpDamage)}<br />
                                    {strings.move.energy + (this.props.moveTable[this.props.value.QuickMove].PvpEnergy)}
                                    {(this.props.moveTable[this.props.value.QuickMove].Probability !== 0) && (<>
                                        <br />{strings.move.probability + this.props.moveTable[this.props.value.QuickMove].Probability}
                                        <br />{strings.move.target + this.props.moveTable[this.props.value.QuickMove].Subject}
                                        <br />{strings.move.stat + this.props.moveTable[this.props.value.QuickMove].Stat}
                                        <br />{strings.move.stage + this.props.moveTable[this.props.value.QuickMove].StageDelta}
                                    </>)}
                                </>}</>}
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

                            tip={<>{strings.tips.charge}<br />
                                {(this.props.value.ChargeMove1 && this.props.value.ChargeMove1 !== "Select...") &&
                                    this.props.moveTable[this.props.value.ChargeMove1] !== undefined &&
                                    <>
                                        {strings.move.damage + (this.props.moveTable[this.props.value.ChargeMove1].PvpDamage)}<br />
                                        {strings.move.energy + (-this.props.moveTable[this.props.value.ChargeMove1].PvpEnergy)}
                                        {(this.props.moveTable[this.props.value.ChargeMove1].Probability !== 0) && (<>
                                            <br />{strings.move.probability + this.props.moveTable[this.props.value.ChargeMove1].Probability}
                                            <br />{strings.move.target + this.props.moveTable[this.props.value.ChargeMove1].Subject}
                                            <br />{strings.move.stat + this.props.moveTable[this.props.value.ChargeMove1].Stat}
                                            <br />{strings.move.stage + this.props.moveTable[this.props.value.ChargeMove1].StageDelta}
                                        </>)}
                                    </>}</>}
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

                            tip={
                                <>{strings.tips.charge}<br />
                                    {(this.props.value.ChargeMove2 && this.props.value.ChargeMove2 !== "Select...") &&
                                        this.props.moveTable[this.props.value.ChargeMove2] !== undefined &&
                                        <>
                                            {strings.move.damage + (this.props.moveTable[this.props.value.ChargeMove2].PvpDamage)}<br />
                                            {strings.move.energy + (-this.props.moveTable[this.props.value.ChargeMove2].PvpEnergy)}
                                            {(this.props.moveTable[this.props.value.ChargeMove2].Probability !== 0) && (<>
                                                <br />{strings.move.probability + this.props.moveTable[this.props.value.ChargeMove2].Probability}
                                                <br />{strings.move.target + this.props.moveTable[this.props.value.ChargeMove2].Subject}
                                                <br />{strings.move.stat + this.props.moveTable[this.props.value.ChargeMove2].Stat}
                                                <br />{strings.move.stage + this.props.moveTable[this.props.value.ChargeMove2].StageDelta}
                                            </>)}
                                        </>}</>}
                        >
                            {this.props.value.chargeMovePool}
                        </MoveSelect>
                    </>}
            </div>
        )
    }

}

export default Pokemon