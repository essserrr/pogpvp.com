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

import CardBody from './CardBody/CardBody';
import MoveCardTitle from "./MoveCardTitle/MoveCardTitle"
import EffTable from "../../Pokedex/PokeCard/EffBlock/EffTable"
import UsesList from "./UsesList/UsesList"
import { dexLocale } from "../../../locale/dexLocale"
import { getCookie } from "../../../js/getCookie"
import DoubleSlider from "./DoubleSlider/DoubleSlider"

import "./MoveCard.scss"

let strings = new LocalizedStrings(dexLocale);

class MoveCard extends React.Component {
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


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        try {
            let fetches = [
                this.props.getPokemonBase(),
                this.props.getMoveBase(),
            ];

            let responses = await Promise.all(fetches)

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw responses[i].detail }
            }
            //if error input somehow
            if (!this.props.bases.moveBase[this.props.match.params.id]) { throw strings.moveerr }

            this.setState({
                showResult: true,
                isError: false,
                loading: false,

                move: this.props.bases.moveBase[this.props.match.params.id],
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
                    header={this.props.match.params.id + strings.mdsdescr + " | PogPvP.com"}
                    descr={this.props.match.params.id + strings.mdsdescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className="row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="movecard col-12 col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">

                            {this.state.loading &&
                                <Grid item xs={12}>
                                    <LinearProgress color="secondary" />
                                </ Grid>}

                            {this.state.isError &&
                                <Alert variant="filled" severity="error">{this.state.error}</Alert >}
                            {this.state.showResult && this.state.move &&
                                <>
                                    <MoveCardTitle move={this.state.move} />

                                    <div className="row m-0 p-0">
                                        <CardBody move={this.state.move} />
                                    </div>

                                    <DoubleSlider
                                        onClick={this.onClick}

                                        attr1="eff"
                                        title1={strings.vunlist}
                                        active1={this.state.active.eff}

                                        attr2="use"
                                        title2={strings.used}
                                        active2={this.state.active.use}
                                    />
                                    <UnmountClosed isOpened={this.state.active.eff}>
                                        <div className={"row m-0"}>
                                            <EffTable
                                                type={[this.state.move.MoveType]}
                                                reverse={true}
                                            />
                                        </div>
                                    </UnmountClosed>
                                    <UnmountClosed isOpened={this.state.active.use}>
                                        <UsesList
                                            move={this.state.move}
                                            pokTable={this.props.bases.pokemonBase}
                                        />
                                    </UnmountClosed>
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
)(MoveCard)