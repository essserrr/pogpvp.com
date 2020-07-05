import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from 'react-localization';
import { UnmountClosed } from 'react-collapse';


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
import ButtonsBlock from "../Movedex/ButtonsBlock/ButtonsBlock"

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

            active: {},
        };
        this.onClick = this.onClick.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id === prevProps.match.params.id) {
            return
        }
        //if error input somehow
        if (!this.state.pokTable || this.state.scrollList || this.state.miscTable || this.state.moveTable) {
            this.setState({
                error: "strings.pokerr",
                showResult: false,
                loading: false,
                isError: true,
            });
        }
        if (!this.state.pokTable[this.props.match.params.id]) {
            this.setState({
                error: strings.pokerr,
                showResult: false,
                loading: false,
                isError: true,
            });
            return
        }

        let position = this.findPosition(this.props.match.params.id,
            Number(this.state.pokTable[this.props.match.params.id].Number) - 1, this.state.scrollList)

        this.setState({
            showResult: true,
            isError: false,
            loading: false,

            position: position,

            pok: this.state.pokTable[this.props.match.params.id],
            pokMisc: this.state.miscTable.Misc[this.props.match.params.id],
        });
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
        //if error input somehow
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
            pokTable: results[1],
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

    onClick(event) {
        let attr = event.target.getAttribute('attr')
        this.setState({
            active: {
                [attr]: !this.state.active[attr],
            },
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
                                        prevTitle={this.state.scrollList[this.state.position - 1] ?
                                            <>{strings.dexentr}<br />
                                                {"#" + this.state.scrollList[this.state.position - 1][1].Number + " " +
                                                    this.state.scrollList[this.state.position - 1][0]}</> : null}
                                        nextTitle={this.state.scrollList[this.state.position + 1] ?
                                            <>{strings.dexentr}<br />
                                                {"#" + this.state.scrollList[this.state.position + 1][1].Number + " " +
                                                    this.state.scrollList[this.state.position + 1][0]}</> : null}

                                        prev={this.state.scrollList[this.state.position - 1] ?
                                            "/pokedex/id/" +
                                            encodeURIComponent(this.state.scrollList[this.state.position - 1][0]) : null}
                                        next={this.state.scrollList[this.state.position + 1] ?
                                            "/pokedex/id/" +
                                            encodeURIComponent(this.state.scrollList[this.state.position + 1][0]) : null}
                                    />}

                                <IconBlock
                                    pokMisc={this.state.pokMisc}
                                    value={this.state.pok}
                                    moveTable={this.state.moveTable}
                                    pokTable={this.state.pokTable}
                                />
                                {this.state.pokMisc && this.state.pokMisc.Description !== "" &&
                                    <DescrBlock value={this.state.pokMisc.Description} />}
                                <StatsBlock
                                    value={this.state.pok}
                                    moveTable={this.state.moveTable}
                                    pokTable={this.state.pokTable}
                                />
                                <ButtonsBlock
                                    class="row m-0 my-2 text-center dexButtonGroup justify-content-center"
                                    onClick={this.onClick}
                                    buttons={[{
                                        attr: "moves",
                                        title: strings.movelist,
                                        class: this.state.active.moves ? "col py-1 dexRadio active" : "col py-1 dexRadio",
                                        disabled: !(this.state.pok.QuickMoves.length > 0 || this.state.pok.ChargeMoves.length > 0),
                                    },
                                    {
                                        attr: "evo",
                                        title: strings.evochart,
                                        class: this.state.active.evo ? "col py-1 dexRadio active" : "col py-1 dexRadio",
                                        disabled: !(this.state.pokMisc && this.state.pokMisc.Family),
                                    },
                                    {
                                        attr: "eff",
                                        title: strings.vunlist,
                                        class: this.state.active.eff ? "col py-1 dexRadio active" : "col py-1 dexRadio",
                                    },
                                    {
                                        attr: "cp",
                                        title: "CP",
                                        class: this.state.active.cp ? "col py-1 dexRadio active" : "col py-1 dexRadio",
                                    },
                                    {
                                        attr: "other",
                                        title: strings.otherinf,
                                        class: this.state.active.other ? "col py-1 dexRadio active" : "col py-1 dexRadio",
                                        disabled: !(this.state.pokMisc && (this.state.pokMisc.Buddy !== 0 ||
                                            (this.state.pokMisc.Purification && this.state.pokMisc.Purification.Candy !== 0) ||
                                            this.state.pokMisc.Region !== 0 || (this.state.pokMisc.SecCharge && this.state.pokMisc.SecCharge.Candy !== 0))),
                                    },]}
                                />


                                {(this.state.pok.QuickMoves.length > 0 || this.state.pok.ChargeMoves.length > 0) &&
                                    <UnmountClosed isOpened={this.state.active.moves}>
                                        <div className={"row m-0 p-0"}>
                                            {this.state.pok.QuickMoves.length > 0 &&
                                                <MoveCol value={this.state.pok.QuickMoves} class="p-0 pr-0 pr-sm-2"
                                                    moveTable={this.state.moveTable} title={strings.qm} pok={this.state.pok} />}
                                            {this.state.pok.ChargeMoves.length > 0 &&
                                                <MoveCol value={this.state.pok.ChargeMoves} class="p-0 pl-0 pl-sm-2"
                                                    moveTable={this.state.moveTable} title={strings.chm} pok={this.state.pok} />}
                                        </div>
                                    </UnmountClosed>}

                                {this.state.pokMisc && this.state.pokMisc.Family !== "" &&
                                    <UnmountClosed isOpened={this.state.active.evo}>
                                        <div className={"row m-0 p-0"}>
                                            <EvoBlock
                                                miscTable={this.state.miscTable.Misc}
                                                pokTable={this.state.pokTable}

                                                value={this.state.miscTable.Families[this.state.pokMisc.Family]}
                                                familyName={this.state.pokMisc.Family}
                                            />
                                        </div>
                                    </UnmountClosed>}

                                <UnmountClosed isOpened={this.state.active.eff}>
                                    <div className={"row m-0 p-0"}>
                                        <EffTable
                                            type={this.state.pok.Type}
                                            reverse={this.props.reverse}
                                        />
                                    </div>
                                </UnmountClosed>

                                <UnmountClosed isOpened={this.state.active.cp}>
                                    <div className={"row dexFont m-0 p-0 "}>
                                        <div className="col-12 p-0 text-center">{strings.entparams}</div>
                                        <CpBlock
                                            pok={this.state.pok}
                                            locale={strings.cpcalc}
                                            pokTable={this.state.pokTable}
                                        />
                                    </div>
                                </UnmountClosed>

                                {this.state.pokMisc && (this.state.pokMisc.Buddy !== 0 || (this.state.pokMisc.Purification && this.state.pokMisc.Purification.Candy !== 0) ||
                                    this.state.pokMisc.Region !== 0 || (this.state.pokMisc.SecCharge && this.state.pokMisc.SecCharge.Candy !== 0)) &&
                                    <UnmountClosed isOpened={this.state.active.other}>
                                        <div className={"row m-0 p-0"}>
                                            <OtherTable
                                                value={this.state.pokMisc}
                                            />
                                        </div>
                                    </UnmountClosed>}
                            </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default PokeCard
