import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization";
import Errors from "../PvP/components/Errors/Errors"
import PokemonCard from "../Evolve/PokemonCard/PokemonCard"
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import IconMultiplicator from "./IconMultiplicator/IconMultiplicator"
import Tier from "./Tier/Tier"
import Checkbox from "./Checkbox/Checkbox"
import Loader from "../PvpRating/Loader"
import CardBody from "./CardBody/CardBody"

import { locale } from "../../locale/locale"
import { getCookie, capitalizeFirst } from "../../js/indexFunctions"

let strings = new LocalizedStrings(locale);


class RaidsList extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
            isError: false,
            error: "",
            loading: false,

            tier5: true,
            tier4: true,
            tier3: true,
            tier2: true,
            tier1: true,
        };
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })

        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/raids", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
            }),
            //after opening the page get pokemonBase
        ];
        let reason = ""
        let responses = await Promise.all(fetches).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(reason)
            });
            return
        }
        let parses = [
            responses[0].json(),
            responses[1].json(),
        ]

        let results = await Promise.all(parses)
        for (let i = 0; i < responses.length; i++) {
            if (!responses[i].ok) {
                this.setState({
                    error: results[i].detail,
                    showResult: false,
                    loading: false,
                    isError: true,
                });
                return;
            }
        }
        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            raidsList: this.returnRaidsList(results[1], results[0]),
        });
    }

    onChange(event) {
        this.setState({
            [event.target.name]: !Boolean(this.state[event.target.name]),
        })
    }

    //generator functions
    returnRaidsList(tierList, pokTable) {
        let raidList = []
        for (let i = 5; i > 0; i--) {
            raidList.push(
                tierList["Tier " + i].reduce((result, elem) => {
                    let name = elem.replace("’", "")
                    if (!pokTable[name]) {
                        name = capitalizeFirst(name)
                    }
                    if (!pokTable[name]) {
                        console.log(name + " not found")
                        return result
                    }
                    result.push(
                        <div key={name + "wrap"} className={"col-6 col-md-4 d-flex px-1 pt-2 justify-content-center"}>
                            <PokemonCard
                                class={"col-12 pokCard p-0 animShiny"}
                                name={name}
                                icon={
                                    <a title={strings.topcounters + pokTable[name].Title}
                                        href={(navigator.userAgent === "ReactSnap") ? "/" :
                                            "/pve/common/" + strings.options.moveSelect.none + "___35_15_15_15_false/" +
                                            (encodeURIComponent(pokTable[name].Title)) + "___" + (i - 1) + "/0_0_0_18_3_false"}
                                        className="align-self-center"
                                    >
                                        <PokemonIconer
                                            src={pokTable[name].Number + (pokTable[name].Forme !== "" ? "-" + pokTable[name].Forme : "")}
                                            class={"icon48"} />
                                    </a>}
                                body={<CardBody
                                    name={name}
                                    pokTable={pokTable}
                                />}

                                classHeader={"cardHeader fBolder col-12 px-1 text-center"}
                                classBody={"cardBody text-center col p-1 justify-content-center"}
                            />
                        </div>)
                    return result
                }, []))
        }
        return raidList
    }


    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/raids"
                    header={strings.pageheaders.raids}
                    descr={strings.pagedescriptions.raids}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews col-sm-12 col-md-11 col-lg-8 py-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.raidsList && <div className="row mx-1 justify-content-center font-weight-bolder">
                                <div className="pr-3">
                                    {strings.tierlist.raidtier + ":"}
                                </div>
                                <Checkbox
                                    onChange={this.onChange}
                                    checked={this.state.tier5 ? "checked" : false}
                                    name={"tier5"}
                                    label="5"
                                />
                                <Checkbox
                                    onChange={this.onChange}
                                    checked={this.state.tier4 ? "checked" : false}
                                    name={"tier4"}
                                    label="4"
                                />
                                <Checkbox
                                    onChange={this.onChange}
                                    checked={this.state.tier3 ? "checked" : false}
                                    name={"tier3"}
                                    label="3"
                                />
                                <Checkbox
                                    onChange={this.onChange}
                                    checked={this.state.tier2 ? "checked" : false}
                                    name={"tier2"}
                                    label="2"
                                />
                                <Checkbox
                                    onChange={this.onChange}
                                    checked={this.state.tier1 ? "checked" : false}
                                    name={"tier1"}
                                    label="1"
                                />
                            </div>}
                            {this.state.isError && <Errors class="alert alert-danger p-2" value={this.state.error} />}
                            {this.state.raidsList && <>
                                {this.state.tier5 && <Tier
                                    class="separator capsSeparator"
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 5"} n={5} />}
                                    list={this.state.raidsList[0]}
                                />}
                                {this.state.tier4 && <Tier
                                    class="separator capsSeparator"
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 4"} n={4} />}
                                    list={this.state.raidsList[1]}
                                />}
                                {this.state.tier3 && <Tier
                                    class="separator capsSeparator"
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 3"} n={3} />}
                                    list={this.state.raidsList[2]}
                                />}
                                {this.state.tier2 && <Tier
                                    class="separator capsSeparator"
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 2"} n={2} />}
                                    list={this.state.raidsList[3]}
                                />}
                                {this.state.tier1 && <Tier
                                    class="separator capsSeparator"
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 1"} n={1} />}
                                    list={this.state.raidsList[4]}
                                />}
                            </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default RaidsList

