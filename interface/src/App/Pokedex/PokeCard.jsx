import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from 'react-localization';

import ReactTooltip from "react-tooltip";
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"
import IconBlock from "./IconBlock/IconBlock"
import StatsBlock from "./StatsBlock/StatsBlock"
import MoveCol from "./MoveBlock/MoveCol"
import EffTable from "./EffBlock/EffTable"
import CpBlock from "./CpBlock/CpBlock"
import OtherTable from "./OtherBlock/OtherTable"
import DescrBlock from "./DescrBlock/DescrBlock"
import EvoBlock from "./EvoBlock/EvoBlock"
import NavigationBlock from "./NavigationBlock/NavigationBlock"

import CollBlock from "./CollBlock/CollBlock"


import { dexLocale } from "../../locale/dexLocale"
import { getCookie } from "../../js/indexFunctions"


let strings = new LocalizedStrings(dexLocale);

class PokeCard extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        var reason = ""
        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/moves", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/misc", {
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
            responses[2].json(),
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
        //if error imput somehow
        if (!results[1][this.props.match.params.id]) {
            this.setState({
                error: strings.pokerr,
                showResult: false,
                loading: false,
                isError: true,
            });
            return
        }


        let scrollList = this.makeList(results[1])

        let position = this.findPosition(this.props.match.params.id, Number(results[1][this.props.match.params.id].Number) - 1,
            scrollList)

        this.setState({
            showResult: true,
            isError: false,
            loading: false,

            scrollList: scrollList,
            position: position,

            moveTable: results[0],
            pokeTable: results[1],
            miscTable: results[2],

            pok: results[1][this.props.match.params.id],
            pokMisc: results[2].Misc[this.props.match.params.id],
        });
    }

    findPosition(name, number, list) {
        for (let i = number; i < list.length; i++) {
            if (name === list[i][0]) {
                return i
            }
        }
        console.log(name + " not found")
    }

    makeList(base) {
        return Object.entries(base).sort(function (a, b) {
            if (Number(a[1].Number) === Number(b[1].Number)) {
                return Number(a[1].Forme) - Number(b[1].Forme)
            }
            return Number(a[1].Number) - Number(b[1].Number)
        })
    }

    render() {
        return (
            <>
                <SiteHelm
                    url={"https://pogpvp.com/movedex/" + encodeURIComponent(this.props.match.params.id)}
                    header={this.props.match.params.id + strings.mdsdescr + " | PogPvP.com"}
                    descr={this.props.match.params.id + strings.mdsdescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="dexCard bigWidth col-12 col-md-10 col-lg-7 p-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                            {this.state.showResult && this.state.pok && <>
                                {this.state.scrollList && !(this.state.position === undefined) &&
                                    <NavigationBlock
                                        list={this.state.scrollList}
                                        position={this.state.position}
                                    />}

                                <IconBlock
                                    value={this.state.pok}
                                    moveTable={this.state.moveTable}
                                    pokeTable={this.state.pokeTable}
                                />
                                {this.state.pokMisc && this.state.pokMisc.Description !== "" &&
                                    <DescrBlock value={this.state.pokMisc.Description} />}
                                <StatsBlock
                                    value={this.state.pok}
                                    moveTable={this.state.moveTable}
                                    pokeTable={this.state.pokeTable}
                                />
                                {(this.state.pok.QuickMoves.length > 0 || this.state.pok.ChargeMoves.length > 0) &&
                                    <CollBlock
                                        defOpen={false}
                                        locale={strings.movelist}
                                        elem={<>
                                            {this.state.pok.QuickMoves.length > 0 &&
                                                <MoveCol value={this.state.pok.QuickMoves} class="p-0 pr-0 pr-sm-2"
                                                    moveTable={this.state.moveTable} title={strings.qm} pok={this.state.pok} />}
                                            {this.state.pok.ChargeMoves.length > 0 &&
                                                <MoveCol value={this.state.pok.ChargeMoves} class="p-0 pl-0 pl-sm-2"
                                                    moveTable={this.state.moveTable} title={strings.chm} pok={this.state.pok} />}
                                        </>} />}


                                {this.state.pokMisc && this.state.pokMisc.Family !== "" &&
                                    <CollBlock
                                        locale={strings.evochart}
                                        defOpen={false}
                                        elem={<EvoBlock
                                            miscTable={this.state.miscTable.Misc}
                                            pokeTable={this.state.pokeTable}

                                            value={this.state.miscTable.Families[this.state.pokMisc.Family]}
                                            familyName={this.state.pokMisc.Family}
                                        />}
                                    />}


                                <CollBlock
                                    locale={strings.vunlist}
                                    defOpen={false}
                                    elem={
                                        <EffTable
                                            type={this.state.pok.Type}
                                            title={<>
                                                <PokemonIconer
                                                    src={this.state.pok.Number +
                                                        (this.state.pok.Forme !== "" ? "-" + this.state.pok.Forme : "")}
                                                    class={"icon36"}
                                                    for={this.state.pok.Title}
                                                />
                                                <ReactTooltip
                                                    className={"infoTip"}
                                                    id={this.state.pok.Title} effect='solid'
                                                    place={"top"}
                                                    multiline={true}
                                                >
                                                    {this.state.pok.Title}
                                                </ReactTooltip>
                                            </>}
                                            reverse={this.props.reverse}
                                        />} />

                                <CpBlock
                                    defOpen={false}
                                    pok={this.state.pok}
                                    locale={strings.cpcalc}
                                    pokeTable={this.state.pokeTable}
                                />
                                {this.state.pokMisc && (this.state.pokMisc.Buddy !== 0 || (this.state.pokMisc.Purification && this.state.pokMisc.Purification.Candy !== 0) ||
                                    this.state.pokMisc.Region !== 0 || (this.state.pokMisc.SecCharge && this.state.pokMisc.SecCharge.Candy !== 0)) &&
                                    <CollBlock
                                        defOpen={false}
                                        locale={strings.otherinf}
                                        elem={<OtherTable
                                            value={this.state.pokMisc}
                                        />} />}
                            </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default PokeCard
