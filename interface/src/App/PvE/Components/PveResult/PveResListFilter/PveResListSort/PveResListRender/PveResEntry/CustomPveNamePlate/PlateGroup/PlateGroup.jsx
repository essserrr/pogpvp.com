import React from "react"
import LocalizedStrings from "react-localization"

import UserPokCard from "../../../../../../../../../Userpage/CustomPokemon/PokemonBox/UserPokemonList/UserPokCard/UserPokCard"
import DropWithArrow from "../../../../../../../../../PvpRating//DropWithArrow/DropWithArrow"
import PreviewIcon from "./PreviewIcon/PreviewIcon"

import { pveLocale } from "../../../../../../../../../../locale/pveLocale"
import { getCookie } from "../../../../../../../../../../js/getCookie"

let strings = new LocalizedStrings(pveLocale)

class PlateGroup extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }


    render() {
        return (
            <div className="col-12 px-0 my-1">
                <DropWithArrow
                    title={
                        <div className="row mx-0 align-items-center">
                            <div style={{ textTransform: "capitalize" }} className="col-auto px-0 mr-2">{`${strings.party} ${this.props.subGroup + 1}`}</div>
                            {this.props.party.map((value, index) =>
                                <PreviewIcon
                                    key={index + "prevIcon"} index={index + "prevIcon"} attr={this.props.attr}
                                    Name={value.Name} IsShadow={value.IsShadow}
                                    pokemonTable={this.props.pokemonTable}
                                />
                            )}
                        </div>}>

                    {this.props.party.map((value, index) =>
                        <UserPokCard
                            key={index}
                            index={(this.props.subGroup * 6) + index}
                            style={{ minWidth: "178px" }}

                            attr={this.props.attr}
                            i={this.props.i}

                            moveTable={this.props.moveTable}
                            pokemonTable={this.props.pokemonTable}

                            forCustomPve={true}

                            Name={value.Name} QuickMove={value.Quick} ChargeMove={value.Charge} ChargeMove2={value.Charge2}
                            Lvl={value.Lvl} Atk={value.Atk} Def={value.Def} Sta={value.Sta} IsShadow={value.IsShadow}

                            onPokemonEdit={this.props.defineBreakpoints}
                        />)}

                </DropWithArrow>



            </div >
        );
    }
};

export default PlateGroup;


