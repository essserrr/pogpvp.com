import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization";
import { UnmountClosed } from "react-collapse";
import { connect } from "react-redux"

import { getMoveBase } from "../../AppStore/Actions/getMoveBase"
import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"
import IconBlock from "./IconBlock/IconBlock"
import MoveCol from "./MoveBlock/MoveCol"
import EffTable from "./EffBlock/EffTable"
import CpBlock from "./CpBlock/CpBlock"
import OtherTable from "./OtherBlock/OtherTable"
import DescrBlock from "./DescrBlock/DescrBlock"
import EvoBlock from "./EvoBlock/EvoBlock"
import NavigationBlock from "./NavigationBlock/NavigationBlock"
import SliderBlock from "./SliderBlock/SliderBlock"
import RedirectBlock from "./RedirectBlock/RedirectBlock"

import { dexLocale } from "../../locale/dexLocale"
import { getCookie } from "../../js/getCookie"


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
                error: strings.pokerr,
                showResult: false,
                loading: false,
                isError: true,
            });
        }
        let id = decodeURIComponent(this.props.match.params.id)
        if (!this.state.pokTable[id]) {
            this.setState({
                error: strings.pokerr,
                showResult: false,
                loading: false,
                isError: true,
            });
            return
        }

        let position = this.findPosition(id, Number(this.state.pokTable[id].Number) - 1, this.state.scrollList)

        this.setState({
            showResult: true,
            isError: false,
            loading: false,

            position: position,

            pok: this.state.pokTable[id],
            pokMisc: this.state.miscTable.Misc[id],
        });
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        try {
            let fetches = [
                this.props.getPokemonBase(),
                this.props.getMoveBase(),
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/misc", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }),
            ];

            let responses = await Promise.all(fetches)

            let result = await responses[2].json()

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (i === 2 ? result.detail : responses[i].detail) }
            }

            //if error input somehow
            let id = decodeURIComponent(this.props.match.params.id)
            if (!this.props.bases.pokemonBase[id]) { throw strings.pokerr }

            //otherwise process results
            let scrollList = this.makeList(this.props.bases.pokemonBase)
            let position = this.findPosition(id, Number(this.props.bases.pokemonBase[id].Number) - 1, scrollList)

            this.setState({
                showResult: true,
                isError: false,
                loading: false,

                scrollList: scrollList,
                position: position,

                moveTable: this.props.bases.moveBase,
                pokTable: this.props.bases.pokemonBase,
                miscTable: result,

                pok: this.props.bases.pokemonBase[id],
                pokMisc: result.Misc[id],
            });

        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e)
            })
        }
    }

    findPosition(name, number, list) {
        for (let i = number; i < list.length; i++) {
            if (name === list[i][0]) {
                return i
            }
        }
        console.log(`Critical: ""${name}" not found in the database`)
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
        let attr = event.target.getAttribute("attr")
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
                    header={decodeURIComponent(this.props.match.params.id) + strings.mdsdescr + " | PogPvP.com"}
                    descr={decodeURIComponent(this.props.match.params.id) + strings.mdsdescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="dexCard mx-3 mb-2 max650 col-12 col-md-10 col-lg-8 p-2 p-md-4">
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
                                <RedirectBlock
                                    value={this.state.pok}
                                    moveTable={this.state.moveTable}
                                    pokTable={this.state.pokTable}
                                />
                                <SliderBlock
                                    onClick={this.onClick}
                                    active={this.state.active}
                                    moveDis={!(this.state.pok.QuickMoves.length > 0 || this.state.pok.ChargeMoves.length > 0)}
                                    evoDis={!(this.state.pokMisc && this.state.pokMisc.Family)}
                                    othDis={!(this.state.pokMisc && (this.state.pokMisc.Buddy !== 0 ||
                                        (this.state.pokMisc.Purification && this.state.pokMisc.Purification.Candy !== 0) ||
                                        this.state.pokMisc.Region !== 0 || (this.state.pokMisc.SecCharge && this.state.pokMisc.SecCharge.Candy !== 0)))}
                                />

                                {(this.state.pok.QuickMoves.length > 0 || this.state.pok.ChargeMoves.length > 0) &&
                                    <UnmountClosed isOpened={this.state.active.moves}>
                                        <div className={"row m-0"}>
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
                                        <div className={"row m-0"}>
                                            <EvoBlock
                                                miscTable={this.state.miscTable.Misc}
                                                pokTable={this.state.pokTable}

                                                value={this.state.miscTable.Families[this.state.pokMisc.Family]}
                                                familyName={this.state.pokMisc.Family}
                                            />
                                        </div>
                                    </UnmountClosed>}

                                <UnmountClosed isOpened={this.state.active.eff}>
                                    <div className={"row m-0"}>
                                        <EffTable
                                            type={this.state.pok.Type}
                                            reverse={this.props.reverse}
                                        />
                                    </div>
                                </UnmountClosed>

                                <UnmountClosed isOpened={this.state.active.cp}>
                                    <div className={"row dexFont m-0 "}>
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
                                        <div className={"row m-0"}>
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

const mapDispatchToProps = dispatch => {
    return {
        getPokemonBase: () => dispatch(getPokemonBase()),
        getMoveBase: () => dispatch(getMoveBase()),
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(PokeCard)