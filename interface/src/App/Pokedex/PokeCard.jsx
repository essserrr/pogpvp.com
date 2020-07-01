import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from 'react-localization';

import ReactTooltip from "react-tooltip";
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"
import IconBlock from "./IconBlock/IconBlock"
import StatsBlock from "./StatsBlock/StatsBlock"
import MoveBlock from "./MoveBlock/MoveBlock"
import EffBlock from "./EffBlock/EffBlock"
import CpBlock from "./CpBlock/CpBlock"

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


        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            moveTable: results[0],
            pokeTable: results[1],
            pok: results[1][this.props.match.params.id],
        });
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
                                <IconBlock
                                    value={this.state.pok}
                                    moveTable={this.state.moveTable}
                                    pokeTable={this.state.pokeTable}
                                />
                                <StatsBlock
                                    value={this.state.pok}
                                    moveTable={this.state.moveTable}
                                    pokeTable={this.state.pokeTable}
                                />
                                {(this.state.pok.QuickMoves.length > 0 || this.state.pok.ChargeMoves.length > 0) &&
                                    <MoveBlock
                                        value={this.state.pok}
                                        moveTable={this.state.moveTable}
                                        pokeTable={this.state.pokeTable}
                                        defOpen={false}
                                    />}
                                <EffBlock
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
                                    locale={strings.vunlist + this.state.pok.Title}
                                    defOpen={false}
                                />
                                <CpBlock
                                    defOpen={false}
                                    pok={this.state.pok}
                                    locale={strings.cpcalc}
                                    pokeTable={this.state.pokeTable}
                                />
                            </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default PokeCard
