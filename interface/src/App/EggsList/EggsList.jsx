import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from 'react-localization';
import ReactTooltip from "react-tooltip"

import Errors from "../PvP/components/Errors/Errors"
import PokemonCard from "../Evolve/PokemonCard"
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import Tier from "../RaidsList/Tier"
import Range from "../RaidsList/Range"
import Checkbox from "../RaidsList/Checkbox"
import Type from "../PvP/components/CpAndTypes/Type"
import Loader from "../PvpRating/Loader"

import { getCookie, typeDecoder, culculateCP, capitalize } from "../../js/indexFunctions"
import { locale } from "../../locale/locale"
import { regionLocale } from "../../locale/regionLocale"
import { ReactComponent as Egg2km } from "../../icons/egg2km.svg";
import { ReactComponent as Egg5km } from "../../icons/egg5km.svg";
import { ReactComponent as Egg10km } from "../../icons/egg10km.svg";
import { ReactComponent as Egg7km } from "../../icons/egg7km.svg";

let strings = new LocalizedStrings(locale);
let regions = new LocalizedStrings(regionLocale);

class EggsList extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        regions.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
            isError: false,
            error: "",
            loading: false,

            km10: true,
            km7: true,
            km5: true,
            km2: true,
            km525: true,
            km1050: true,

            regionals: false,
        };
        this.onChange = this.onChange.bind(this);
        this.onShowRegionals = this.onShowRegionals.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        var reason = ""
        //get pok and eggs db
        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/eggs", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
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
            eggsList: this.returnRaidsList(results[1], results[0], false),
            eggsListRaw: results,
        });
    }

    onChange(event) {
        this.setState({
            [event.target.name]: !Boolean(this.state[event.target.name]),
        })
    }

    onShowRegionals(event) {
        this.setState({
            [event.target.name]: !Boolean(this.state[event.target.name]),
            eggsList: this.returnRaidsList(this.state.eggsListRaw[1], this.state.eggsListRaw[0], !Boolean(this.state[event.target.name])),
        })
    }


    returnRaidsList(tierList, pokTable, showReg) {
        let result = []

        let matrix = [
            "10KM Eggs",
            "7KM Gift Eggs",
            "5KM Eggs",
            "2KM Eggs",
            "10KM Eggs (50KM)",
            "5KM Eggs (25KM)",
        ]
        //for every matrix entry
        for (var i = 0; matrix.length > i; i++) {
            var bucket = []
            for (var j = 0; j < tierList[matrix[i]].length; j++) {
                //format title string
                var name = tierList[matrix[i]][j].replace("’", "")
                if (!pokTable[name]) {
                    name = capitalize(name)
                }
                //skip reginals if regionals are not selected
                if (!showReg && regionals[name]) {
                    continue
                }

                bucket.push(
                    <div key={name + "wrap"} className={"col-4 col-md-3 px-1 pt-2"}>
                        <PokemonCard
                            class={"pokEggCard  m-0 p-0 pb-1"}
                            name={
                                <div className="text-center">
                                    <>{name}</>
                                    {regionals[name] &&
                                        <i data-tip data-for={name} className="fas fa-info-circle ml-1">
                                            {regionals[name] && <ReactTooltip
                                                className={"infoTip"}
                                                id={name} effect='solid'
                                                place={"top"}
                                                multiline={true}
                                            >
                                                {regions[regionals[name]]}
                                            </ReactTooltip>}
                                        </i>
                                    }

                                </div>
                            }
                            icon={
                                <a
                                    title={strings.dexentr + name}
                                    href={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" +
                                        encodeURIComponent(name)}
                                >
                                    <PokemonIconer
                                        src={pokTable[name].Number + (pokTable[name].Forme !== "" ? "-" + pokTable[name].Forme : "")}
                                        class={"icon48"} />
                                </a>}
                            body={this.generateBody(name, pokTable)
                            }

                            classBodyWrap="row justify-content-center justify-content-sm-between m-0 p-0"
                            classHeader={"cardHeader col-12 m-0 p-0 px-1 mb-1 text-center"}
                            classIcon={"icon48 m-0 p-0 ml-0 ml-sm-1 align-self-center"}
                            classBody={"eggCardBody  row  m-0 py-1 justify-content-left"}
                        />
                    </div>)
            }
            result.push(bucket)
        }
        return result
    }




    generateBody(name, pokemonTable) {
        //if there is an error, report it
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
                innerClass="col-12 text-center p-0 m-0 align-self-end"
                left={culculateCP(name, 15, 10, 10, 10, pokemonTable)}
                right={culculateCP(name, 15, 15, 15, 15, pokemonTable)}
            />
        </>
    }

    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/eggs"
                    header={strings.pageheaders.eggs}
                    descr={strings.pagedescriptions.eggs}
                />
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
                            {this.state.eggsList && <div className="row mx-1 justify-content-center font-weight-bolder">
                                <div className="pr-3">
                                    {strings.tierlist.eggs + ":"}
                                </div>
                                <Checkbox
                                    onChange={this.onChange}
                                    value={this.state.km10}
                                    checked={this.state.km10 ? "checked" : false}
                                    name={"km10"}
                                    label="10 km"
                                />
                                <Checkbox
                                    onChange={this.onChange}
                                    value={this.state.km7}
                                    checked={this.state.km7 ? "checked" : false}
                                    name={"km7"}
                                    label="7 km"
                                />
                                <Checkbox
                                    onChange={this.onChange}
                                    value={this.state.km5}
                                    checked={this.state.km5 ? "checked" : false}
                                    name={"km5"}
                                    label="5 km"
                                />
                                <Checkbox
                                    onChange={this.onChange}
                                    value={this.state.km2}
                                    checked={this.state.km2 ? "checked" : false}
                                    name={"km2"}
                                    label="2 km"
                                />
                                <Checkbox
                                    onChange={this.onChange}
                                    value={this.state.km1050}
                                    checked={this.state.km1050 ? "checked" : false}
                                    name={"km1050"}
                                    label="10 km (50 km)"
                                />
                                <Checkbox
                                    onChange={this.onChange}
                                    value={this.state.km525}
                                    checked={this.state.km525 ? "checked" : false}
                                    name={"km525"}
                                    label="5 km (25 km)"
                                />
                            </div>}
                            {this.state.eggsList && <div className="row mt-1 mx-1 justify-content-center font-weight-bolder">
                                <Checkbox
                                    onChange={this.onShowRegionals}
                                    value={this.state.regionals}
                                    checked={this.state.regionals ? "checked" : false}
                                    name={"regionals"}
                                    label={strings.tierlist.regionals}
                                />
                            </div>}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                            {this.state.eggsList && <>
                                {this.state.km10 && <Tier
                                    title={<><Egg10km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 10 km"}</>}
                                    list={this.state.eggsList[0]}
                                />}
                                {this.state.km7 && <Tier
                                    title={<><Egg7km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 7 km"}</>}
                                    list={this.state.eggsList[1]}
                                />}
                                {this.state.km5 && <Tier
                                    title={<><Egg5km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 5 km"}</>}
                                    list={this.state.eggsList[2]}
                                />}
                                {this.state.km2 && <Tier
                                    title={<><Egg2km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 2 km"}</>}
                                    list={this.state.eggsList[3]}
                                />}
                                {this.state.km1050 && <Tier
                                    title={<><Egg10km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 10 km (50 km Adveture Sync)"}</>}
                                    list={this.state.eggsList[4]}
                                />}
                                {this.state.km525 && <Tier
                                    title={<><Egg5km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 5 km (25 km Adveture Sync)"}</>}
                                    list={this.state.eggsList[5]}
                                />}
                            </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default EggsList






const regionals = {
    "Farfetchd": 3,
    "Kangaskhan": 4,
    "Mr. Mime": 5,
    "Tauros": 6,

    "Heracross": 7,
    "Corsola": 17,

    "Volbeat": 1,
    "Illumise": 2,
    "Torkoal": 16,
    "Zangoose": 1,
    "Seviper": 2,
    "Lunatone": 1,
    "Solrock": 2,
    "Tropius": 15,
    "Relicanth": 18,

    "Pachirisu": 19,
    "Shellos": 12,
    "Mime Jr.": 5,
    "Chatot": 9,
    "Carnivine": 14,
    "Uxie": 13,
    "Mesprit": 8,
    "Azelf": 10,

    "Pansage": 13,
    "Pansear": 8,
    "Panpour": 10,
    "Throh": 2,
    "Sawk": 1,
    "Basculin": 12,
    "Maractus": 7,
    "Sigilyph": 11,
    "Heatmor": 2,
    "Durant": 1,
}


