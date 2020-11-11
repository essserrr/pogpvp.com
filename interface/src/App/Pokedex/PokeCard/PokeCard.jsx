import React from "react"
import SiteHelm from "../../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { UnmountClosed } from "react-collapse"
import { connect } from "react-redux"

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';


import { getMoveBase } from "../../../AppStore/Actions/getMoveBase"
import { getPokemonBase } from "../../../AppStore/Actions/getPokemonBase"
import SliderBody from "./SliderBody/SliderBody";
import MainBlock from "./MainBlock/MainBlock"
import DescrBlock from "./DescrBlock/DescrBlock"
import NavigationBlock from "./NavigationBlock/NavigationBlock"
import SliderBlock from "./SliderBlock/SliderBlock"
import RedirectBlock from "./RedirectBlock/RedirectBlock"

import { dexLocale } from "../../../locale/dexLocale"
import { getCookie } from "../../../js/getCookie"

import "./PokeCard.scss"

let strings = new LocalizedStrings(dexLocale);

class PokeCard extends React.Component {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
            isError: false,
            error: "",
            loading: false,

            active: { eff: true },
        };
        this.onClick = this.onClick.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id === prevProps.match.params.id) {
            return
        }
        //if error input somehow
        if (!this.props.bases.pokemonBase || !this.state.scrollList || !this.state.miscTable || !this.props.bases.moveBase) {
            this.setState({
                error: strings.pokerr,
                showResult: false,
                loading: false,
                isError: true,
            });
        }
        let id = decodeURIComponent(this.props.match.params.id)
        if (!this.props.bases.pokemonBase[id]) {
            this.setState({
                error: strings.pokerr,
                showResult: false,
                loading: false,
                isError: true,
            });
            return
        }

        let position = this.findPosition(id, Number(this.props.bases.pokemonBase[id].Number) - 1, this.state.scrollList)

        this.setState({
            showResult: true,
            isError: false,
            loading: false,

            position: position,

            pok: this.props.bases.pokemonBase[id],
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

    onClick(event, attributes) {
        this.setState({
            active: {
                [attributes.attr]: !this.state.active[attributes.attr],
            },
        })
    }

    render() {
        const { scrollList, position } = this.state;

        return (
            <>
                <SiteHelm
                    header={decodeURIComponent(this.props.match.params.id) + strings.mdsdescr + " | PogPvP.com"}
                    descr={decodeURIComponent(this.props.match.params.id) + strings.mdsdescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="pokedex-card mx-3 mb-2 col-12 col-md-10 col-lg-8 p-2 p-md-4">

                            {this.state.loading &&
                                <Grid item xs={12}>
                                    <LinearProgress color="secondary" />
                                </ Grid>}

                            {this.state.isError &&
                                <Grid item xs={12}>
                                    <Alert variant="filled" severity="error">{this.state.error}</Alert >
                                </ Grid>}


                            {this.state.showResult && this.state.pok &&
                                <>
                                    {scrollList && position !== undefined &&
                                        <Grid item xs={12}>
                                            <NavigationBlock
                                                prevTitle={
                                                    scrollList[position - 1] ?
                                                        <>
                                                            {strings.dexentr}<br />
                                                            {`#${scrollList[position - 1][1].Number} ${scrollList[position - 1][0]}`}
                                                        </> : null}

                                                nextTitle={
                                                    scrollList[position + 1] ?
                                                        <>
                                                            {strings.dexentr}<br />
                                                            {`#${scrollList[position + 1][1].Number} ${scrollList[position + 1][0]}`}
                                                        </> : null}

                                                prev={scrollList[position - 1] ?
                                                    "/pokedex/id/" + encodeURIComponent(scrollList[position - 1][0]) : null}

                                                next={scrollList[position + 1] ?
                                                    "/pokedex/id/" + encodeURIComponent(scrollList[position + 1][0]) : null}
                                            />
                                        </Grid>}

                                    <Grid item xs={12}>
                                        <MainBlock pokMisc={this.state.pokMisc} value={this.state.pok}
                                            moveTable={this.props.bases.moveBase} pokTable={this.props.bases.pokemonBase} />
                                    </Grid>

                                    {this.state.pokMisc && this.state.pokMisc.Description !== "" &&
                                        <Grid item xs={12}>
                                            <DescrBlock>
                                                {this.state.pokMisc.Description}
                                            </DescrBlock>
                                        </Grid>}

                                    <Grid item xs={12}>
                                        <RedirectBlock value={this.state.pok} moveTable={this.props.bases.moveBase} pokTable={this.props.bases.pokemonBase} />
                                    </ Grid>

                                    <Grid item xs={12}>
                                        <SliderBlock
                                            onClick={this.onClick}
                                            active={[this.state.active.moves, this.state.active.evo, this.state.active.eff, this.state.active.cp, this.state.active.other,]}
                                            attrs={["moves", "evo", "eff", "cp", "other"]}
                                            disabled={[
                                                !(this.state.pok.QuickMoves.length > 0 || this.state.pok.ChargeMoves.length > 0),
                                                !(this.state.pokMisc && this.state.pokMisc.Family),
                                                false,
                                                false,
                                                !(this.state.pokMisc && (this.state.pokMisc.Buddy !== 0 ||
                                                    (this.state.pokMisc.Purification && this.state.pokMisc.Purification.Candy !== 0) ||
                                                    this.state.pokMisc.Region !== 0 || (this.state.pokMisc.SecCharge && this.state.pokMisc.SecCharge.Candy !== 0)))
                                            ]}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SliderBody
                                            pok={this.state.pok}
                                            moveBase={this.props.bases.moveBase}
                                            miscTable={this.state.miscTable}
                                            pokemonBase={this.props.bases.pokemonBase}
                                            pokMisc={this.state.pokMisc}

                                            show={[
                                                this.state.pok.QuickMoves.length > 0 || this.state.pok.ChargeMoves.length > 0,
                                                this.state.pokMisc && this.state.pokMisc.Family !== "",
                                                true,
                                                true,
                                                this.state.pokMisc && (this.state.pokMisc.Buddy !== 0 || (this.state.pokMisc.Purification && this.state.pokMisc.Purification.Candy !== 0) ||
                                                    this.state.pokMisc.Region !== 0 || (this.state.pokMisc.SecCharge && this.state.pokMisc.SecCharge.Candy !== 0)),
                                            ]}

                                            expanded={[this.state.active.moves, this.state.active.evo, this.state.active.eff, this.state.active.cp, this.state.active.other]}
                                        />




                                    </Grid>
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