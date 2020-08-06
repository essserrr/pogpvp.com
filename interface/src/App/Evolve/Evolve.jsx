import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import ReactTooltip from "react-tooltip"
import LocalizedStrings from "react-localization";

import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import SearchableSelect from "../PvP/components/SearchableSelect/SearchableSelect"
import Stats from "../PvP/components/Stats/Stats"
import Errors from "../PvP/components/Errors/Errors"
import EvoList from "./EvoList/EvoList"
import Loader from "../PvpRating/Loader"

import { locale } from "../../locale/locale"
import { checkLvl, checkIV, } from "../../js/indexFunctions"
import { getCookie } from "../../js/getCookie"

let strings = new LocalizedStrings(locale);

class Evolve extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            name: strings.title.evolveTool,
            Lvl: "",
            Atk: "",
            Def: "",
            Sta: "",

            pokCanEvolve: [],
            pokemonTable: [],


            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
            })
            //parse answer
            const data = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw data.detail }

            //otherwise set state
            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                pokCanEvolve: this.pokWithEvo(data),
                pokemonTable: data,
            })
        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e)
            })
        }
    }

    pokWithEvo(result) {
        let list = []
        for (const [key, value] of Object.entries(result)) {
            if (value.Evolutions && value.Evolutions.length > 0) {
                list.push({
                    value: key,
                    label: <div style={{ textAlign: "left" }}>
                        <PokemonIconer
                            src={value.Number + (value.Forme !== "" ? "-" + value.Forme : "")}
                            class={"icon24 mr-1"} />{key}
                    </div>,
                });
            }
        }
        return list
    }

    onNameChange(event) {
        this.setState({
            name: event.value,
        });
    }

    onIvChange(event) {
        this.setState({
            [event.target.name]: checkIV(event.target.value) + "",
        });
    }

    onLevelChange(event) {
        this.setState({
            [event.target.name]: checkLvl(event.target.value) + "",
        });
    }

    onChange(event, name) {
        //check if it's name change
        if (event.target === undefined) {
            switch (name.name[1]) {
                default:
                    this.onNameChange(event)
                    break
            }
            return
        }
        //check if it's an iv change
        if (event.target.name === "Sta" || event.target.name === "Def" || event.target.name === "Atk") {
            this.onIvChange(event)
            return
        }
        //check if it's an level change
        if (event.target.name === "Lvl") {
            this.onLevelChange(event)
            return
        }
    }

    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/evolution"
                    header={strings.pageheaders.evolution}
                    descr={strings.pagedescriptions.evolution}
                />
                <div className=" container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews max1200-1 col-sm-12 col-md-10 col-lg-6 mx-0 py-4">
                            {this.state.loading && <Loader
                                color="black"
                                weight="500"
                                locale={strings.tips.loading}
                                loading={this.state.loading}
                            />}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                            {this.state.showResult &&
                                <div className="row justify-content-between p-0 m-0">
                                    <div className="col-12 px-2">
                                        <SearchableSelect
                                            onChange={this.onChange}
                                            list={this.state.pokCanEvolve}
                                            value={this.state.name}
                                        />
                                    </div>
                                    <div className="col-12 col-md-12 px-2 mt-2">
                                        <ReactTooltip effect="solid" />
                                        <Stats
                                            Lvl={this.state.Lvl}
                                            Atk={this.state.Atk}
                                            Def={this.state.Def}
                                            Sta={this.state.Sta}
                                            attr={this.props.attr}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    {this.state.pokemonTable[this.state.name] && <div className="col-12 px-2 mt-2 ">
                                        <EvoList
                                            state={this.state}
                                        />
                                    </div>}
                                </div>
                            }
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default Evolve