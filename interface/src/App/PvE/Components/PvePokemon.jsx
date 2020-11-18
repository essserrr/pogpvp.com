import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import Stats from "App/Components/Stats/Stats";
import MagicBox from "App/PvP/components/MagicBox/MagicBox";
import CpAndTyping from "App/Components/CpAndTypes/CpAndTypes";
import Switch from 'App/Components/Switch/Switch';

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

const PvePokemon = React.memo(function PvePokemon(props) {
    labelStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    tipStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container justify="center" alignItems="center" spacing={2}>
            <MagicBox
                open={Boolean(props.value.showMenu)}
                title={`${labelStrings.selectMove}:`}
                attr={props.attr}
                onClick={props.onClick}
            >
                {<SearchableSelect
                    disableClearable
                    label={labelStrings.moveName}

                    name={props.value.isSelected}
                    attr={props.attr}
                    onChange={props.onChange}
                >
                    {props.value.isSelected && props.value.isSelected.includes("Charge") ? props.chargeMoveList : props.quickMoveList}
                </SearchableSelect>}
            </MagicBox>


            {(props.pokemonTable[props.value.Name]) &&
                <Grid item xs={12}>
                    <CpAndTyping
                        Lvl={props.value.Lvl}
                        Atk={props.value.Atk}
                        Def={props.value.Def}
                        Sta={props.value.Sta}

                        isShadow={props.value.IsShadow === "true"}

                        pokemonTable={props.pokemonTable}
                        name={props.value.Name}
                        tier={props.value.Tier}
                        isBoss={props.attr === "bossObj"}
                    />
                </Grid>}

            <Grid item xs={12}>
                <Grid container justify="center" alignItems="center" spacing={2}>
                    {props.pokList &&
                        <Grid item xs={props.colSize ? props.colSize : 6}>
                            <SearchableSelect
                                disableClearable
                                label={labelStrings.selectPok}
                                value={props.value.Name}
                                errorText={props.notOk && !!props.notOk.Name ? props.notOk.Name : ""}

                                name="Name"
                                attr={props.attr}
                                onChange={props.onChange}
                            >
                                {props.pokList}
                            </SearchableSelect>
                        </Grid>}
                    {props.attr !== "bossObj" &&
                        <Grid item xs={props.colSize ? props.colSize : 6}>
                            <Stats
                                Lvl={props.value.Lvl}
                                Atk={props.value.Atk}
                                Def={props.value.Def}
                                Sta={props.value.Sta}
                                attr={props.attr}
                                onChange={props.onChange}
                            />
                        </Grid>}

                    {props.attr === "bossObj" &&
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
                                    value={props.value.Tier}
                                    attr={props.attr}
                                    label={labelStrings.tier}
                                    onChange={props.onChange}
                                >
                                    <MenuItem value="0">{`${optionStrings.tierlist} 1`}</MenuItem>
                                    <MenuItem value="2">{`${optionStrings.tierlist} 3`}</MenuItem>
                                    <MenuItem value="4">{optionStrings.mega}</MenuItem>
                                    <MenuItem value="4">{`${optionStrings.tierlist} 5`}</MenuItem>
                                    <MenuItem value="5">{`${optionStrings.tierlist} 5.5`}</MenuItem>
                                </Input>
                            </WithIcon>
                        </Grid>}
                </Grid>
            </Grid>

            <Grid item xs={props.colSize ? props.colSize : 6}>
                <MoveSelect
                    value={props.value.QuickMove && !!props.moveTable[props.value.QuickMove] &&
                        props.value.QuickMove}
                    errorText={props.notOk && !!props.notOk.QuickMove ? props.notOk.QuickMove : ""}

                    moveType={(props.moveTable[props.value.QuickMove] !== undefined) ?
                        props.moveTable[props.value.QuickMove].MoveType : ""}

                    name="QuickMove"
                    attr={props.attr}
                    onChange={props.onChange}

                    label={labelStrings.quickMove}

                    tip={<QuickMoveTip
                        hasTitle={true}
                        moveName={props.value.QuickMove}
                        moveTable={props.moveTable}
                    />}
                >
                    {props.value.quickMovePool}
                </MoveSelect>
            </Grid>

            <Grid item xs={props.colSize ? props.colSize : 6}>
                <MoveSelect
                    value={(props.value.ChargeMove !== "Select..." && !!props.moveTable[props.value.ChargeMove]) ?
                        props.value.ChargeMove : ""}
                    errorText={props.notOk && !!props.notOk.ChargeMove ? props.notOk.ChargeMove : ""}

                    moveType={(props.moveTable[props.value.ChargeMove] !== undefined) ?
                        props.moveTable[props.value.ChargeMove].MoveType : ""}

                    name="ChargeMove"
                    attr={props.attr}
                    onChange={props.onChange}

                    label={labelStrings.chargeMove}

                    tip={<ChargeMoveTip
                        hasTitle={true}
                        moveName={props.value.ChargeMove}
                        moveTable={props.moveTable}
                    />}
                >
                    {props.value.chargeMovePool}
                </MoveSelect>
            </Grid>

            {props.canBeShadow &&
                <Grid item xs={props.colSize ? props.colSize : 6} style={{ order: props.attr === "editPokemon" ? "2" : "" }}>
                    <WithIcon
                        tip={tipStrings.shadow}
                    >
                        <Input
                            select
                            name="IsShadow"
                            value={props.value.IsShadow}
                            attr={props.attr}
                            label={labelStrings.type}
                            onChange={props.onChange}
                        >
                            <MenuItem value="false">{optionStrings.type.normal}</MenuItem>
                            <MenuItem value="true">{optionStrings.type.shadow}</MenuItem>
                        </Input>
                    </WithIcon>
                </Grid>}

            {props.hasSecondCharge &&
                <Grid item xs={props.colSize ? props.colSize : 6} style={{ order: props.attr === "editPokemon" ? "1" : "" }}>
                    <MoveSelect
                        value={(props.value.ChargeMove2 !== "Select..." && !!props.moveTable[props.value.ChargeMove2]) ?
                            props.value.ChargeMove2 : ""}
                        errorText={props.notOk && !!props.notOk.ChargeMove2 ? props.notOk.ChargeMove2 : ""}

                        moveType={(!!props.moveTable[props.value.ChargeMove2]) ?
                            props.moveTable[props.value.ChargeMove2].MoveType : ""}

                        name="ChargeMove2"
                        attr={props.attr}
                        onChange={props.onChange}

                        label={labelStrings.chargeMove}
                        tip={<ChargeMoveTip
                            hasTitle={true}
                            moveName={props.value.ChargeMove2}
                            moveTable={props.moveTable}
                        />}
                    >
                        {props.value.chargeMovePool}
                    </MoveSelect>
                </Grid>}

            {props.canBeShadow && props.attr === "attackerObj" &&
                <Grid item xs={6}>
                    <Switch
                        checked={props.settingsValue.SupportSlotEnabled !== "false"}
                        onChange={props.onChange}
                        attr={"pveObj"}
                        name={"SupportSlotEnabled"}
                        color="primary"
                        label={labelStrings.supen}
                    />
                </Grid>}
        </Grid>
    )
});


export default PvePokemon;

PvePokemon.propTypes = {
    onClick: PropTypes.func,
    onChange: PropTypes.func,

    attr: PropTypes.string,
    value: PropTypes.object.isRequired,
    notOk: PropTypes.object,

    colSize: PropTypes.number,

    pokList: PropTypes.arrayOf(PropTypes.object),
    chargeMoveList: PropTypes.arrayOf(PropTypes.object),
    quickMoveList: PropTypes.arrayOf(PropTypes.object),

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};
