import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import UserPokCard from "App/Userpage/CustomPokemon/PokemonBox/UserPokemonList/UserPokCard/UserPokCard";
import DropWithArrow from "App/PvpRating//DropWithArrow/DropWithArrow";
import PreviewIcon from "./PreviewIcon/PreviewIcon";

import { pveLocale } from "locale/Pve/CustomPve/CustomPve";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(pveLocale);

const PlateGroup = React.memo(function PlateGroup(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container>
            <DropWithArrow
                title={
                    <div className="row mx-0 align-items-center">
                        <div style={{ textTransform: "capitalize" }} className="col-auto px-0 mr-2">{`${strings.party} ${props.subGroup + 1}`}</div>

                        {props.party.map((value, index) =>
                            <PreviewIcon key={index + "prevIcon"} Name={value.Name} IsShadow={value.IsShadow} pokemonTable={props.pokemonTable} />
                        )}
                    </div>}>
                <Grid container justify="space-around">

                    {props.party.map((value, index) =>
                        <UserPokCard
                            key={index}
                            index={(props.subGroup * 6) + index}
                            style={{ minWidth: "178px" }}

                            attr={props.attr}
                            i={props.i}

                            moveTable={props.moveTable}
                            pokemonTable={props.pokemonTable}

                            forCustomPve={true}

                            Name={value.Name} QuickMove={value.Quick} ChargeMove={value.Charge} ChargeMove2={value.Charge2}
                            Lvl={value.Lvl} Atk={value.Atk} Def={value.Def} Sta={value.Sta} IsShadow={value.IsShadow}

                            onPokemonEdit={props.defineBreakpoints}
                        />)}

                </Grid>
            </DropWithArrow>
        </Grid>
    )
});

export default PlateGroup;

PreviewIcon.propTypes = {
    attr: PropTypes.string,
    i: PropTypes.number,
    subGroup: PropTypes.number,

    moveTable: PropTypes.object,
    pokemonTable: PropTypes.object,

    party: PropTypes.arrayOf(PropTypes.object),

    defineBreakpoints: PropTypes.func,
};