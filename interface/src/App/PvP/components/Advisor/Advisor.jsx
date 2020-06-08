import React from "react";
import LocalizedStrings from 'react-localization';
import PokemonIconer from "../PokemonIconer/PokemonIconer"
import PokemonCard from "../../..//Evolve/PokemonCard"
import { ReactComponent as Shadow } from "../../../../icons/shadow.svg";
import { locale } from "../../../..//locale/locale"
import { typeDecoder, checkShadow, getCookie, capitalize } from "../../..//../js/indexFunctions"


let strings = new LocalizedStrings(locale);



class Advisor extends React.PureComponent {

    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.focusDiv = this.focusDiv.bind(this);
        this.returnRatingList = this.returnRatingList.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };

    focusDiv() {
        this.refs.matrixres.focus();
    };

    returnRatingList() {
        let result = []
        console.log(this.props.list)
        console.log(this.props.leftPanel.listForBattle)

        for (var i = 0; i < this.props.list.length; i++) {
            let first = this.props.leftPanel.listForBattle[this.props.list[i].first]
            let second = this.props.leftPanel.listForBattle[this.props.list[i].second]
            let third = this.props.leftPanel.listForBattle[this.props.list[i].third]

            result.push(
                <div key={i} className={"col-12 px-1 pt-1"}>
                    <PokemonCard
                        class={"cardBig m-0 p-0"}

                        name={<div className="d-flex justify-content-between">
                            <div className="pl-2">{"#" + (i + 1)}</div>
                            <div className=" text-center">
                                {(first.IsShadow === "true") && <abbr title={strings.options.type.shadow} className="initialism">
                                    <Shadow className="allign-self-center icon24 ml-1 pb-1" />
                                </abbr>}
                                <>{first.name}</>{" + "}
                                {(second.IsShadow === "true") && <abbr title={strings.options.type.shadow} className="initialism">
                                    <Shadow className="allign-self-center icon24 ml-1 pb-1" />
                                </abbr>}
                                <>{second.name}</>{" + "}
                                {(third.IsShadow === "true") && <abbr title={strings.options.type.shadow} className="initialism">
                                    <Shadow className="allign-self-center icon24 ml-1 pb-1" />
                                </abbr>}
                                <>{third.name}</>
                            </div>
                            <div></div>
                        </div>}
                        icon={<>
                            <PokemonIconer
                                src={this.props.pokemonTable[first.name].Number + (this.props.pokemonTable[first.name].Forme !== "" ? "-" + this.props.pokemonTable[first.name].Forme : "")}
                                class={"icon36"} />
                            <PokemonIconer
                                src={this.props.pokemonTable[second.name].Number + (this.props.pokemonTable[second.name].Forme !== "" ? "-" + this.props.pokemonTable[second.name].Forme : "")}
                                class={"icon36"} />
                            <PokemonIconer
                                src={this.props.pokemonTable[third.name].Number + (this.props.pokemonTable[third.name].Forme !== "" ? "-" + this.props.pokemonTable[third.name].Forme : "")}
                                class={"icon36"} />
                        </>
                        }


                        body={
                            <div className="row justify-content-between m-0 p-0">
                                <div className="col-6 bigText text-center m-0 p-0">
                                    Bad matchups: {this.props.list[i].zeros.length}
                                </div>
                                <div className="col-6 bigText text-center m-0 p-0">
                                    Avg. rating: {(this.props.list[i].rate / 3).toFixed(1)}
                                </div>

                            </div>
                        }
                        footer

                        classHeader={"bigCardHeader col-12 m-0 p-0 px-1"}
                        classIcon={"col-auto mx-2 mt-2 p-0 align-self-center"}
                        classBody={"bigCardBody bigWidth  col-auto align-self-center m-0 p-1 p-0 "}
                        classFooter="col-12 m-0  mb-2"
                    />
                </div>)
        }
        return result

    }

    render() {
        return (
            <div tabIndex="0" ref="matrixres">
                {this.returnRatingList()}
            </div>
        );
    }
};

export default Advisor;
