import React from "react";
import { Helmet } from "react-helmet";
import LocalizedStrings from 'react-localization';

import Errors from "../PvP/components/Errors/Errors"
import PokemonCard from "../Evolve/PokemonCard"
import Type from "../PvP/components/CpAndTypes/Type"
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import IconMultiplicator from "./IconMultiplicator"
import Tier from "./Tier"
import Range from "./Range"
import Checkbox from "./Checkbox"
import Loader from "../PvpRating/Loader"

import { locale } from "../../locale/locale"
import { getCookie, typeDecoder, culculateCP, capitalize, weatherDecoder } from "../../js/indexFunctions"

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
        var reason = ""

        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/raids", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            //after opening the page get pokemonBase
        ];
        var responses = await Promise.all(fetches).catch(function (r) {
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
        var results = await Promise.all(parses)

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
        let result = []

        for (var i = 5; i > 0; i--) {
            var bucket = []
            for (var j = 0; j < tierList["Tier " + i].length; j++) {
                var name = tierList["Tier " + i][j].replace("’", "")
                if (!pokTable[name]) {
                    name = capitalize(name)
                }
                bucket.push(
                    <div key={name + "wrap"} className={"col-6 col-md-4 px-1 pt-2"}>
                        <PokemonCard
                            class={"pokCard animShiny m-0 p-0"}

                            name={name}
                            icon={
                                <a title={strings.topcounters + pokTable[name].Title}
                                    href={(navigator.userAgent === "ReactSnap") ? "/" :
                                        "/pve/common/" + strings.options.moveSelect.none + "___35_15_15_15_false/" + (encodeURIComponent(pokTable[name].Title)) + "___" + (i - 1) + "/0_0_0_18_3_false"}
                                >
                                    <PokemonIconer
                                        src={pokTable[name].Number + (pokTable[name].Forme !== "" ? "-" + pokTable[name].Forme : "")}
                                        class={"icon48"} />
                                </a>
                            }
                            body={this.generateBody(name, pokTable)}

                            classHeader={"cardHeader col-12 m-0 p-0 px-1 text-center"}
                            classIcon={"icon48 m-0 p-0 align-self-center"}
                            classBody={"cardBody row m-0 p-1 justify-content-center"}
                        />
                    </div>)

            }
            result.push(bucket)
        }

        return result
    }

    generateBody(name, pokemonTable) {
        if (!pokemonTable[name]) {
            console.log(name + " not found")
            return
        }
        return <>
            <div className="col-12 text-center  m-0 p-0 align-self-start">
                {(pokemonTable[name]["Type"][0] !== undefined) && <Type
                    class={"icon18"}
                    code={pokemonTable[name]["Type"][0]}
                    value={typeDecoder[pokemonTable[name]["Type"][0]]}
                />}
                {(pokemonTable[name]["Type"][1] !== undefined) && <Type
                    class={"ml-2 icon18"}
                    code={pokemonTable[name]["Type"][1]}
                    value={typeDecoder[pokemonTable[name]["Type"][1]]}
                />}
            </div>

            <Range
                title="CP: "
                left={culculateCP(name, 20, 10, 10, 10, pokemonTable)}
                right={culculateCP(name, 20, 15, 15, 15, pokemonTable)}
            />
            <Range
                title={<>
                    {(pokemonTable[name]["Type"][0] !== undefined) && <PokemonIconer
                        folder="/weather/"
                        src={weatherDecoder[pokemonTable[name]["Type"][0]]}
                        class={"icon18"} />}
                    {(pokemonTable[name]["Type"][1] !== undefined) && weatherDecoder[pokemonTable[name]["Type"][1]] !== weatherDecoder[pokemonTable[name]["Type"][0]] && <PokemonIconer
                        folder="/weather/"
                        src={weatherDecoder[pokemonTable[name]["Type"][1]]}
                        class={"icon18"} />}
                    {": "}
                </>}
                left={culculateCP(name, 25, 10, 10, 10, pokemonTable)}
                right={culculateCP(name, 25, 15, 15, 15, pokemonTable)}
            />
        </>
    }



    render() {
        return (
            <>
                <Helmet>
                    <link rel="canonical" href="https://pogpvp.com/raids" />

                    <title>{strings.pageheaders.raids}</title>
                    <meta name="description" content={strings.pagedescriptions.raids} />

                    <meta property="og:title" content={strings.pageheaders.raids} />
                    <meta property="og:url" content="https://pogpvp.com/raids"></meta>
                    <meta property="og:description" content={strings.pagedescriptions.raids} />

                    <meta property="twitter:title" content={strings.pageheaders.raids} />
                    <meta property="twitter:url" content="https://pogpvp.com/raids"></meta>
                    <meta property="twitter:description" content={strings.pagedescriptions.raids} />
                </Helmet>
                <div className=" container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews col-sm-12 col-md-11 col-lg-8 mx-0 py-4">
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

                            {this.state.raidsList && <>
                                {this.state.tier5 && <Tier
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 5"} n={5} />}
                                    list={this.state.raidsList[0]}
                                />}
                                {this.state.tier4 && <Tier
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 4"} n={4} />}
                                    list={this.state.raidsList[1]}
                                />}
                                {this.state.tier3 && <Tier
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 3"} n={3} />}
                                    list={this.state.raidsList[2]}
                                />}
                                {this.state.tier2 && <Tier
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 2"} n={2} />}
                                    list={this.state.raidsList[3]}
                                />}
                                {this.state.tier1 && <Tier
                                    title={<IconMultiplicator title={strings.tierlist.raidtier + " 1"} n={1} />}
                                    list={this.state.raidsList[4]}
                                />}
                            </>}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default RaidsList

