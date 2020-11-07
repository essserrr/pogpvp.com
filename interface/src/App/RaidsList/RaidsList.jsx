import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase";
import RenderRaidList from "./RenderRaidList/RenderRaidList";
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock";

import { locale } from "locale/Raids/Raids";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

class RaidsList extends React.Component {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
            isError: false,
            error: "",
            loading: false,

            filter: {},
        };
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        try {
            let fetches = [
                this.props.getPokemonBase(),
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/raids", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }),
            ]

            let responses = await Promise.all(fetches)
            let result = await responses[1].json()

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (i === 1 ? result.detail : responses[i].detail) }
            }

            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                originalList: result,
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

    onChange(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            filter: {
                ...this.state.filter,
                [attr]: !Boolean(this.state.filter[attr])
            }
        })
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/raids"
                    header={strings.pageheaders.raids}
                    descr={strings.pagedescriptions.raids}
                />
                <Grid item xs={12} md={11} lg={8}>
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


                            {this.state.originalList &&
                                <>
                                    <Grid item xs={12}>
                                        <ButtonsBlock
                                            filter={this.state.filter}
                                            onFilter={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RenderRaidList filter={this.state.filter} pokTable={this.props.bases.pokemonBase}>
                                            {this.state.originalList}
                                        </RenderRaidList>
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
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(RaidsList)
