import React from "react";
import SiteHelm from "App/SiteHelm/SiteHelm";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import { getMoveBase } from "AppStore/Actions/getMoveBase";
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";

import CardBody from './CardBody/CardBody';
import MoveCardTitle from "./MoveCardTitle/MoveCardTitle";
import SliderBody from "./SliderBody/SliderBody";
import { dexLocale } from "locale/Movedex/Movecard";
import { getCookie } from "js/getCookie";
import DoubleSlider from "./DoubleSlider/DoubleSlider";

let strings = new LocalizedStrings(dexLocale);

class MoveCard extends React.Component {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
            isError: false,
            error: "",
            loading: false,

            active: { eff: true, },
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

    onClick(event, attributes) {
        this.setState({
            active: {
                [attributes.attr]: !this.state.active[attributes.attr],
            },
        })
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    header={this.props.match.params.id + strings.mdsdescr + " | PogPvP.com"}
                    descr={this.props.match.params.id + strings.mdsdescr}
                />

                <Grid item xs={12} md={10} lg={8}>
                    <GreyPaper elevation={4} enablePadding>
                        <Grid container justify="center" spacing={2}>


                            {this.state.loading &&
                                <Grid item xs={12}>
                                    <LinearProgress color="secondary" />
                                </ Grid>}

                            {this.state.isError &&
                                <Grid item xs={12}>
                                    <Alert variant="filled" severity="error">{this.state.error}</Alert >
                                </Grid>}


                            {this.state.showResult && this.state.move &&
                                <>
                                    <Grid item xs={12}>
                                        <MoveCardTitle move={this.state.move} />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <CardBody move={this.state.move} />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <DoubleSlider
                                            onClick={this.onClick}
                                            attrs={["eff", "use"]}
                                            titles={[strings.vunlist, strings.used]}
                                            active={[Boolean(this.state.active.eff), Boolean(this.state.active.use)]}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <SliderBody move={this.state.move} active={this.state.active} pokemonBase={this.props.bases.pokemonBase} />
                                    </Grid>
                                </>}

                        </Grid>
                    </GreyPaper>
                </Grid>
            </Grid>
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