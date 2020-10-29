import React from "react"

import Stats from "../../PvP/components/Stats/Stats"
import MagicBox from "../../PvP/components/MagicBox/MagicBox"
import CpAndTyping from "../../PvP/components/CpAndTypes/CpAndTypes"
import Checkbox from "../../RaidsList/Checkbox/Checkbox"

import MoveSelect from "App/Components/MoveSelect/MoveSelect"
import WithIcon from "App/Components/WithIcon/WithIcon"
import InputWithError from "App/Components/InputWithError/InputWithError"
import SerachableSelect from 'App/Components/SerachableSelect/SerachableSelect';

import MenuItem from '@material-ui/core/MenuItem';

import LocalizedStrings from "react-localization"
import { locale } from "../../../locale/locale"
import { pveLocale } from "../../../locale/pveLocale"
import { getCookie } from "../../../js/getCookie"

let strings = new LocalizedStrings(locale);
let pveStrings = new LocalizedStrings(pveLocale)

class PvePokemon extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="row mx-0 justify-content-center align-items-center">
                {(this.props.value.showMenu) && <MagicBox
                    title={strings.title.selectMove}
                    onClick={this.props.onClick}
                    attr={this.props.attr}
                    element={
                        <SerachableSelect
                            disableClearable
                            label={"Move name"}

                            name={this.props.value.isSelected}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                        >
                            {this.props.value.isSelected && this.props.value.isSelected.includes("Charge") ? this.props.chargeMoveList : this.props.quickMoveList}
                        </SerachableSelect>}
                />}


                {(this.props.pokemonTable[this.props.value.Name]) &&
                    <div className="col-12 px-0  my-1">
                        <CpAndTyping
                            Lvl={this.props.value.Lvl}
                            Atk={this.props.value.Atk}
                            Def={this.props.value.Def}
                            Sta={this.props.value.Sta}

                            pokemonTable={this.props.pokemonTable}
                            name={this.props.value.Name}
                            tier={this.props.value.Tier}
                            isBoss={this.props.attr === "bossObj"}
                        />
                    </div>}


                <div className="col-12 px-0 my-1">
                    <div className="row mx-0 justify-content-between align-items-center">
                        {this.props.pokList &&
                            <div className={this.props.colSize ? this.props.colSize : "col-6 px-1"}>
                                <SerachableSelect
                                    disableClearable
                                    label={"Pokemon name"}
                                    value={this.props.value.Name}
                                    name="Name"
                                    attr={this.props.attr}
                                    onChange={this.props.onChange}
                                >
                                    {this.props.pokList}
                                </SerachableSelect>
                            </div>}
                        {this.props.attr !== "bossObj" &&
                            <div className={this.props.colSize ? this.props.colSize : "col-6 px-1"}>
                                <Stats
                                    class=" "

                                    Lvl={this.props.value.Lvl}
                                    Atk={this.props.value.Atk}
                                    Def={this.props.value.Def}
                                    Sta={this.props.value.Sta}
                                    attr={this.props.attr}
                                    onChange={this.props.onChange}
                                />
                            </div>}

                        {this.props.attr === "bossObj" &&
                            <div className="col-6 px-1">


                                <WithIcon
                                    tip={<>
                                        Max HP:<br />
                                        {pveStrings.tierlist + " 1 - 600 HP"}<br />
                                        {pveStrings.tierlist + " 3 - 3600 HP"}<br />
                                        {pveStrings.tierlist + " 5 - 15000 HP"}<br />
                                        {pveStrings.mega + " - 15000 HP"}<br />
                                        {pveStrings.tierlist + " 5.5 - 22500 HP"}<br />
                                    </>}
                                >
                                    <InputWithError
                                        select
                                        name="Tier"
                                        value={this.props.value.Tier}
                                        attr={this.props.attr}
                                        label={pveStrings.tier}
                                        onChange={this.props.onChange}
                                    >
                                        <MenuItem value="0">{pveStrings.tierlist + " 1"}</MenuItem>
                                        <MenuItem value="2">{pveStrings.tierlist + " 3"}</MenuItem>
                                        <MenuItem value="4">{pveStrings.tierlist + " 5"}</MenuItem>
                                        <MenuItem value="4">{pveStrings.mega}</MenuItem>
                                        <MenuItem value="5">{pveStrings.tierlist + " 5.5"}</MenuItem>
                                    </InputWithError>
                                </WithIcon>
                            </div>}
                    </div>
                </div>





                <div className={this.props.colSize ? this.props.colSize : "col-6 px-1  my-1"}>
                    <MoveSelect
                        value={this.props.value.QuickMove && this.props.moveTable[this.props.value.QuickMove] !== undefined &&
                            this.props.value.QuickMove}
                        moveType={(this.props.moveTable[this.props.value.QuickMove] !== undefined) ?
                            this.props.moveTable[this.props.value.QuickMove].MoveType : ""}

                        name="QuickMove"
                        attr={this.props.attr}
                        onChange={this.props.onChange}

                        label={strings.title.quickMove}

                        tip={<>
                            {strings.tips.quick}<br />
                            {this.props.value.QuickMove && this.props.moveTable[this.props.value.QuickMove] !== undefined &&
                                <>
                                    {strings.move.damage + (this.props.moveTable[this.props.value.QuickMove].Damage)}<br />
                                    {strings.move.energy + (this.props.moveTable[this.props.value.QuickMove].Energy)}<br />
                                    {"Cooldown: " + (this.props.moveTable[this.props.value.QuickMove].Cooldown / 1000)}<br />
                                    {"DPS: " + (this.props.moveTable[this.props.value.QuickMove].Damage /
                                        (this.props.moveTable[this.props.value.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                                    {"EPS: " + (this.props.moveTable[this.props.value.QuickMove].Energy /
                                        (this.props.moveTable[this.props.value.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                                </>}
                        </>}
                    >
                        {this.props.value.quickMovePool}
                    </MoveSelect>

                </div>

                <div className={this.props.colSize ? this.props.colSize : "col-6 px-1 my-1"}>
                    <MoveSelect
                        value={(this.props.value.ChargeMove && this.props.value.ChargeMove !== "Select..."
                            && this.props.moveTable[this.props.value.ChargeMove] !== undefined) ? this.props.value.ChargeMove : ""}
                        moveType={(this.props.moveTable[this.props.value.ChargeMove] !== undefined) ?
                            this.props.moveTable[this.props.value.ChargeMove].MoveType : ""}

                        name="ChargeMove"
                        attr={this.props.attr}
                        onChange={this.props.onChange}

                        label={strings.title.chargeMove}

                        tip={<>
                            {strings.tips.charge}<br />
                            {(this.props.value.ChargeMove && this.props.value.ChargeMove !== "Select...") &&
                                this.props.moveTable[this.props.value.ChargeMove] !== undefined &&
                                <>
                                    {strings.move.damage + (this.props.moveTable[this.props.value.ChargeMove].Damage)}<br />
                                    {strings.move.energy + (-this.props.moveTable[this.props.value.ChargeMove].Energy)}<br />
                                    {"Cooldown: " + (this.props.moveTable[this.props.value.ChargeMove].Cooldown / 1000)}<br />
                                    {"DPS: " + (this.props.moveTable[this.props.value.ChargeMove].Damage / (this.props.moveTable[this.props.value.ChargeMove].Cooldown / 1000)).toFixed(2)}<br />
                                    {"DPS*DPE: " + (this.props.moveTable[this.props.value.ChargeMove].Damage /
                                        (this.props.moveTable[this.props.value.ChargeMove].Cooldown / 1000) *
                                        this.props.moveTable[this.props.value.ChargeMove].Damage /
                                        -this.props.moveTable[this.props.value.ChargeMove].Energy).toFixed(2)}<br />
                                </>}
                        </>}
                    >
                        {this.props.value.chargeMovePool}
                    </MoveSelect>
                </div>

                {this.props.canBeShadow && <div className={(this.props.colSize ? this.props.colSize : "col-6 px-1 my-1") + (this.props.attr === "editPokemon" ? " order-2" : "")}>
                    <WithIcon
                        tip={strings.tips.shadow}
                    >
                        <InputWithError
                            select
                            name="IsShadow"
                            value={this.props.value.IsShadow}
                            attr={this.props.attr}
                            label={strings.title.type}
                            onChange={this.props.onChange}
                        >
                            <MenuItem value="false" attr={this.props.attr}>{strings.options.type.normal}</MenuItem>
                            <MenuItem value="true" attr={this.props.attr}>{strings.options.type.shadow}</MenuItem>
                        </InputWithError>
                    </WithIcon>
                </div>}




                {this.props.hasSecondCharge && <div
                    className={(this.props.colSize ? this.props.colSize : "col-6 px-1 my-1") + (this.props.attr === "editPokemon" ? " order-1" : "")}>
                    <MoveSelect
                        value={(this.props.value.ChargeMove2 && this.props.value.ChargeMove2 !== "Select..."
                            && this.props.moveTable[this.props.value.ChargeMove2] !== undefined) ? this.props.value.ChargeMove2 : ""}
                        moveType={(this.props.moveTable[this.props.value.ChargeMove2] !== undefined) ?
                            this.props.moveTable[this.props.value.ChargeMove2].MoveType : ""}

                        name="ChargeMove2"
                        attr={this.props.attr}
                        onChange={this.props.onChange}

                        label={strings.title.chargeMove}

                        tip={<>{strings.tips.charge}<br />
                            {(this.props.value.ChargeMove2 && this.props.value.ChargeMove2 !== "Select...") &&
                                this.props.moveTable[this.props.value.ChargeMove2] !== undefined &&
                                <>
                                    {strings.move.damage + (this.props.moveTable[this.props.value.ChargeMove2].Damage)}<br />
                                    {strings.move.energy + (-this.props.moveTable[this.props.value.ChargeMove2].Energy)}<br />
                                    {"Cooldown: " + (this.props.moveTable[this.props.value.ChargeMove2].Cooldown / 1000)}<br />
                                    {"DPS: " + (this.props.moveTable[this.props.value.ChargeMove2].Damage / (this.props.moveTable[this.props.value.ChargeMove2].Cooldown / 1000)).toFixed(2)}<br />
                                    {"DPS*DPE: " + (this.props.moveTable[this.props.value.ChargeMove2].Damage /
                                        (this.props.moveTable[this.props.value.ChargeMove2].Cooldown / 1000) *
                                        this.props.moveTable[this.props.value.ChargeMove2].Damage /
                                        -this.props.moveTable[this.props.value.ChargeMove2].Energy).toFixed(2)}<br />
                                </>}
                        </>}
                    >
                        {this.props.value.chargeMovePool}
                    </MoveSelect>
                </div>}

                {this.props.canBeShadow && this.props.attr === "attackerObj" && <div className="col-6 px-1 my-1">
                    <Checkbox
                        class={"form-check form-check-inline m-0 p-0"}
                        checked={this.props.settingsValue.SupportSlotEnabled !== "false" ? "checked" : false}
                        attr={"pveObj"}
                        name={"SupportSlotEnabled"}
                        label={
                            <div className=" text-center">
                                {pveStrings.supen}
                            </div>
                        }
                        onChange={this.props.onChange}
                    />
                </div>}
            </div>
        )
    }

}

export default PvePokemon