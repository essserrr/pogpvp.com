import React from "react"
import LocalizedStrings from "react-localization"

import UserPokCard from "../../../../../Userpage/CustomPokemon/PokemonBox/UserPokemonList/UserPokCard/UserPokCard"
import DropWithArrow from "../../../../../PvpRating//DropWithArrow/DropWithArrow"
import PreviewIcon from "./PreviewIcon/PreviewIcon"

import { pveLocale } from "../../../../../../locale/pveLocale"
import { getCookie } from "../../../../../../js/getCookie"

let strings = new LocalizedStrings(pveLocale)

class PlateGroup extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            showCollapse: false,
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
        })
    }

    render() {
        return (
            <div className="col-12 px-0 my-1">
                <DropWithArrow
                    onShow={this.onClick}
                    show={this.state.showCollapse}
                    title={
                        <dvi className="row mx-0 align-items-center">
                            <div style={{ textTransform: "capitalize" }} className="col-auto px-0 mr-2">{`${strings.party} ${this.props.subGroup + 1}`}</div>
                            {this.props.party.map((value, index) =>
                                <PreviewIcon
                                    key={index + "prevIcon"} index={index + "prevIcon"} attr={this.props.attr}
                                    Name={value.Name} IsShadow={value.IsShadow}
                                    pokemonTable={this.props.pokemonTable}
                                />
                            )}
                        </dvi>}
                    elem={this.props.party.map((value, index) =>
                        <UserPokCard
                            key={index}
                            index={index}
                            style={{ minWidth: "178px" }}

                            attr={this.props.attr}
                            i={this.props.i}

                            moveTable={this.props.moveTable}
                            pokemonTable={this.props.pokemonTable}

                            forCustomPve={true}

                            Name={value.Name} QuickMove={value.Quick} ChargeMove={value.Charge} ChargeMove2={value.Charge2}
                            Lvl={value.Lvl} Atk={value.Atk} Def={value.Def} Sta={value.Sta} IsShadow={value.IsShadow}
                        />)}

                    faOpened="align-self-center fas fa-angle-up fa-lg "
                    faClosed="align-self-center fas fa-angle-down fa-lg"
                    outClass="row justify-content-between m-0 pb-1 clickable"
                    inClass="row justify-content-center m-0" />





            </div >
        );
    }
};

export default PlateGroup;


