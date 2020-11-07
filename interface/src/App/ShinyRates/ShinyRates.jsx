import React from "react";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import Input from 'App/Components/Input/Input';
import ShinyTableFilter from "./ShinyTableFilter/ShinyTableFilter";
import SiteHelm from "App/SiteHelm/SiteHelm";

import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import { locale } from "locale/ShinyRates/ShinyRates";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

class ShinyRates extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            active: {
                field: "Name",
                type: "string",
                order: true,
            },

            name: "",
            shinyRates: [],
            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        try {
            let fetches = [
                this.props.getPokemonBase(),
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/shiny", {
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
                shinyRates: result,
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

    onClick(event, atrributes, ...other) {
        this.setState({
            active: {
                field: atrributes.name,
                type: atrributes.coltype,
                order: this.state.active.field === atrributes.name ? !this.state.active.order : true
            },
        });
    }

    onChange(event) {
        this.setState({
            name: event.target.value,
        });
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/shinyrates"
                    header={strings.pageheaders.shiny}
                    descr={strings.pagedescriptions.shiny}
                />
                <Grid item xs={12} md={10} lg={8}>
                    <GreyPaper elevation={4} enablePadding>
                        <Grid container justify="center" spacing={2}>

                            {this.state.loading &&
                                <Grid item xs={12}>
                                    <LinearProgress color="secondary" />
                                </ Grid>}

                            <Grid item xs={12}>
                                <Alert variant="filled" severity="error">{"Function will be depricated soon."}</Alert >
                            </Grid>

                            {this.state.isError &&
                                <Grid item xs={12}>
                                    <Alert variant="filled" severity="error">{this.state.error}</Alert >
                                </Grid>}


                            {this.state.showResult &&
                                <>
                                    <Grid item xs={12}>
                                        <Input
                                            onChange={this.onChange}
                                            label={strings.shinyrates.searchplaceholder}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ShinyTableFilter
                                            value={this.state.name}
                                            filter={this.state.active}

                                            onClick={this.onClick}
                                            onChange={this.onChange}
                                            firstColumn={this.state.active.field === "Name"}
                                            secondColumn={this.state.active.field === "Odds"}
                                            thirdColumn={this.state.active.field === "Odds"}
                                            fourthColumn={this.state.active.field === "Checks"}

                                            pokTable={this.props.bases.pokemonBase}
                                        >
                                            {this.state.shinyRates}
                                        </ShinyTableFilter>
                                    </Grid>
                                </>}
                        </Grid>
                    </GreyPaper>
                </Grid>
            </Grid>
        );
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPokemonBase: () => dispatch(getPokemonBase()),
    }
};

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(ShinyRates);



