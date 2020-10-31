import React from "react";
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import Stats from "App/PvP/components/Stats/Stats";
import MagicBox from "App/PvP/components/MagicBox/MagicBox";
import CpAndTyping from "App/Components/CpAndTypes/CpAndTypes";
import Checkbox from "App/RaidsList/Checkbox/Checkbox";

import ChargeMoveTip from "App/PvE/Components/Tips/ChargeMoveTip";
import QuickMoveTip from "App/PvE/Components/Tips/QuickMoveTip";

import MoveSelect from "App/Components/MoveSelect/MoveSelect";
import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";
import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';

import { labels } from "locale/Pve/PokemonLabels";
import { options } from "locale/Pve/Options";
import { generalTips } from "locale/Pve/Tips/GeneralTips";
import { getCookie } from "js/getCookie";

let labelStrings = new LocalizedStrings(labels);
let optionStrings = new LocalizedStrings(options);
let tipStrings = new LocalizedStrings(generalTips);

class PvePokemon extends React.PureComponent {
    constructor(props) {
        super(props);
        labelStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        tipStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }


    render() {
        return (
            <Grid container justify="center" alignItems="center" spacing={2}>
                {(this.props.value.showMenu) && <MagicBox
                    title={labelStrings.selectMove}
                    onClick={this.props.onClick}
                    attr={this.props.attr}
                    element={
                        <SearchableSelect
                            disableClearable
                            label={"Move name"}

                            name={this.props.value.isSelected}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                        >
                            {this.props.value.isSelected && this.props.value.isSelected.includes("Charge") ? this.props.chargeMoveList : this.props.quickMoveList}
                        </SearchableSelect>}
                />}


                {(this.props.pokemonTable[this.props.value.Name]) &&
                    <Grid item xs={12}>
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
                    </Grid>}

                <Grid item xs={12}>
                    <Grid container justify="center" alignItems="center" spacing={2}>
                        {this.props.pokList &&
                            <Grid item xs={this.props.colSize ? this.props.colSize : 6}>
                                <SearchableSelect
                                    disableClearable
                                    label={labelStrings.selectPok}
                                    value={this.props.value.Name}
                                    name="Name"
                                    attr={this.props.attr}
                                    onChange={this.props.onChange}
                                >
                                    {this.props.pokList}
                                </SearchableSelect>
                            </Grid>}
                        {this.props.attr !== "bossObj" &&
                            <Grid item xs={this.props.colSize ? this.props.colSize : 6}>
                                <Stats
                                    Lvl={this.props.value.Lvl}
                                    Atk={this.props.value.Atk}
                                    Def={this.props.value.Def}
                                    Sta={this.props.value.Sta}
                                    attr={this.props.attr}
                                    onChange={this.props.onChange}
                                />
                            </Grid>}

                        {this.props.attr === "bossObj" &&
                            <Grid item xs={6}>
                                <WithIcon
                                    tip={<>
                                        Max HP:<br />
                                        {`${optionStrings.tierlist} 1 - 600 HP`}<br />
                                        {`${optionStrings.tierlist} 3 - 3600 HP`}<br />
                                        {`${optionStrings.tierlist} 5 - 15000 HP`}<br />
                                        {`${optionStrings.mega} - 15000 HP`}<br />
                                        {`${optionStrings.tierlist} 5.5 - 22500 HP`}<br />
                                    </>}
                                >
                                    <Input
                                        select
                                        name="Tier"
                                        value={this.props.value.Tier}
                                        attr={this.props.attr}
                                        label={labelStrings.tier}
                                        onChange={this.props.onChange}
                                    >
                                        <MenuItem value="0">{`${optionStrings.tierlist} 1`}</MenuItem>
                                        <MenuItem value="2">{`${optionStrings.tierlist} 3`}</MenuItem>
                                        <MenuItem value="4">{`${optionStrings.tierlist} 5`}</MenuItem>
                                        <MenuItem value="4">{optionStrings.mega}</MenuItem>
                                        <MenuItem value="5">{`${optionStrings.tierlist} 5.5`}</MenuItem>
                                    </Input>
                                </WithIcon>
                            </Grid>}
                    </Grid>
                </Grid>




                <Grid item xs={this.props.colSize ? this.props.colSize : 6}>
                    <MoveSelect
                        value={this.props.value.QuickMove && this.props.moveTable[this.props.value.QuickMove] !== undefined &&
                            this.props.value.QuickMove}
                        moveType={(this.props.moveTable[this.props.value.QuickMove] !== undefined) ?
                            this.props.moveTable[this.props.value.QuickMove].MoveType : ""}

                        name="QuickMove"
                        attr={this.props.attr}
                        onChange={this.props.onChange}

                        label={labelStrings.quickMove}

                        tip={<QuickMoveTip
                            hasTitle={true}
                            moveName={this.props.value.QuickMove}
                            moveTable={this.props.moveTable}
                        />}
                    >
                        {this.props.value.quickMovePool}
                    </MoveSelect>
                </Grid>

                <Grid item xs={this.props.colSize ? this.props.colSize : 6}>
                    <MoveSelect
                        value={(this.props.value.ChargeMove && this.props.value.ChargeMove !== "Select..."
                            && this.props.moveTable[this.props.value.ChargeMove] !== undefined) ? this.props.value.ChargeMove : ""}
                        moveType={(this.props.moveTable[this.props.value.ChargeMove] !== undefined) ?
                            this.props.moveTable[this.props.value.ChargeMove].MoveType : ""}

                        name="ChargeMove"
                        attr={this.props.attr}
                        onChange={this.props.onChange}

                        label={labelStrings.chargeMove}

                        tip={<ChargeMoveTip
                            hasTitle={true}
                            moveName={this.props.value.ChargeMove}
                            moveTable={this.props.moveTable}
                        />}
                    >
                        {this.props.value.chargeMovePool}
                    </MoveSelect>
                </Grid>

                {this.props.canBeShadow &&

                    <Grid item xs={this.props.colSize ? this.props.colSize : 6} order={this.props.attr === "editPokemon" ? "2" : ""}>
                        <WithIcon
                            tip={tipStrings.shadow}
                        >
                            <Input
                                select
                                name="IsShadow"
                                value={this.props.value.IsShadow}
                                attr={this.props.attr}
                                label={labelStrings.type}
                                onChange={this.props.onChange}
                            >
                                <MenuItem value="false" attr={this.props.attr}>{optionStrings.type.normal}</MenuItem>
                                <MenuItem value="true" attr={this.props.attr}>{optionStrings.type.shadow}</MenuItem>
                            </Input>
                        </WithIcon>
                    </Grid>}




                {this.props.hasSecondCharge &&
                    <Grid item xs={this.props.colSize ? this.props.colSize : 6} order={this.props.attr === "editPokemon" ? "1" : ""}>
                        <MoveSelect
                            value={(this.props.value.ChargeMove2 && this.props.value.ChargeMove2 !== "Select..."
                                && this.props.moveTable[this.props.value.ChargeMove2] !== undefined) ? this.props.value.ChargeMove2 : ""}
                            moveType={(this.props.moveTable[this.props.value.ChargeMove2] !== undefined) ?
                                this.props.moveTable[this.props.value.ChargeMove2].MoveType : ""}

                            name="ChargeMove2"
                            attr={this.props.attr}
                            onChange={this.props.onChange}

                            label={labelStrings.chargeMove}
                            tip={<ChargeMoveTip
                                hasTitle={true}
                                moveName={this.props.value.ChargeMove2}
                                moveTable={this.props.moveTable}
                            />}
                        >
                            {this.props.value.chargeMovePool}
                        </MoveSelect>
                    </Grid>}

                {this.props.canBeShadow && this.props.attr === "attackerObj" &&
                    <Grid item xs={12}>
                        <Checkbox
                            class={"form-check form-check-inline m-0 p-0"}
                            checked={this.props.settingsValue.SupportSlotEnabled !== "false" ? "checked" : false}
                            attr={"pveObj"}
                            name={"SupportSlotEnabled"}
                            label={
                                <div className=" text-center">
                                    {labelStrings.supen}
                                </div>
                            }
                            onChange={this.props.onChange}
                        />
                    </Grid>}
            </Grid>
        )
    }

}

export default PvePokemon