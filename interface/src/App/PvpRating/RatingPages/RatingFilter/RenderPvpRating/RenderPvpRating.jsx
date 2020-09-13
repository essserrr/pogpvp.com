import React from "react"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import PokemonIconer from "../../../../PvP/components/PokemonIconer/PokemonIconer"
import Collapsable from "./Collapsable/Collapsable"
import PokemonCard from "../../../../Evolve/PokemonCard/PokemonCard"
import CardBody from "./CardBody/CardBody"

import { ReactComponent as Shadow } from "../../../../../icons/shadow.svg"
import { checkShadow } from "../../../../../js/indexFunctions"
import { getCookie } from "../../../../../js/getCookie"

import { locale } from "../../../../../locale/locale"

import "./RenderPvpRating.scss"

let strings = new LocalizedStrings(locale)

class RenderPvpRating extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }


    render() {
        return (
            this.props.list.reduce((result, elem, i) => {
                let pokName = checkShadow(elem.Name, this.props.pokemonTable)
                if (!pokName) {
                    return result
                }
                result.push(
                    <PokemonCard
                        key={elem.Name}
                        class={"pvprating-render__card col-12 p-0 mt-2"}
                        name={
                            <div className="d-flex justify-content-between pl-2">
                                {"#" + (i + 1)}
                                <div className="text-center">
                                    {pokName + ((pokName !== elem.Name) ? " (" + strings.options.type.shadow + ")" : "")}
                                </div>
                                <div />
                            </div>}
                        icon={
                            <Link className="pvprating-render--relative ml-2 mr-4 mt-2 align-self-center"
                                title={strings.dexentr + pokName}
                                to={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(pokName)}>
                                {(pokName !== elem.Name) &&
                                    <Shadow className="pvprating-render__icon--medium pvprating-render--absolute" />}
                                <PokemonIconer
                                    src={this.props.pokemonTable[pokName].Number +
                                        (this.props.pokemonTable[pokName].Forme !== "" ? "-" + this.props.pokemonTable[pokName].Forme : "")}
                                    class={"pvprating-render__icon--big"} />
                            </Link>}
                        body={<CardBody
                            name={pokName}
                            pokemonTable={this.props.pokemonTable}
                            maxWeighted={this.props.list[0].AvgRateWeighted}
                            entry={elem}
                        />}
                        footer={<Collapsable
                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.moveTable}
                            ratingList={this.props.originalList}

                            container={elem}
                            league={this.props.league}
                            combination={this.props.combination}
                        />}

                        classHeader={"pvprating-render__card-header col-12 p-0 px-1"}
                        classBody={"col align-self-center p-1 p-0 "}
                        classBodyWrap={"row justify-content-between m-0"}
                        classFooter="col-12 p-0  mb-2"
                    />)
                return result;
            }, [])
        );
    }
}


export default RenderPvpRating