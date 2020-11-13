import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import SearchableSelect from "App/Components/SearchableSelect/SearchableSelect";
import Stats from "App/Components/Stats/Stats";
import EvoList from "./EvoList/EvoList";


import { locale } from "locale/Evolve/Evolve";
import { checkLvl, checkIV, } from "js/indexFunctions";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

class Evolve extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            name: "",
            Lvl: "",
            Atk: "",
            Def: "",
            Sta: "",

            pokCanEvolve: [],

            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })

        try {
            let response = await this.props.getPokemonBase()
            //if response is not ok, handle error
            if (!response.ok) { throw response.detail }

            //otherwise set state
            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                pokCanEvolve: this.pokWithEvo(this.props.bases.pokemonBase),
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

    pokWithEvo(result) {
        let list = []
        for (const [key, value] of Object.entries(result)) {
            if (value.Evolutions && value.Evolutions.length > 0) {
                list.push({
                    value: key,
                    title: key,
                });
            }
        }
        return list
    }

    onNameChange(eventItem) {
        this.setState({
            name: eventItem.value,
        });
    }

    onIvChange(event) {
        this.setState({
            [event.target.name]: checkIV(event.target.value) + "",
        });
    }

    onLevelChange(event) {
        this.setState({
            [event.target.name]: checkLvl(event.target.value) + "",
        });
    }

    onChange(event, attrivutes, eventItem) {
        //check if it's name change
        if (!!eventItem) {
            this.onNameChange(eventItem)
            return
        }
        //check if it's an iv change
        if (event.target.name === "Sta" || event.target.name === "Def" || event.target.name === "Atk") {
            this.onIvChange(event)
            return
        }
        //check if it's an level change
        if (event.target.name === "Lvl") {
            this.onLevelChange(event)
            return
        }
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/evolution"
                    header={strings.pageheaders.evolution}
                    descr={strings.pagedescriptions.evolution}
                />

                <Grid item xs={12} md={10} lg={6}>
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


                            {this.state.showResult &&
                                <>
                                    <Grid item xs={12}>
                                        <SearchableSelect label={strings.title.evolveTool} onChange={this.onChange} value={this.state.name} disableClearable>
                                            {this.state.pokCanEvolve}
                                        </SearchableSelect>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stats
                                            Lvl={this.state.Lvl}
                                            Atk={this.state.Atk}
                                            Def={this.state.Def}
                                            Sta={this.state.Sta}
                                            attr={this.props.attr}
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    {this.props.bases.pokemonBase[this.state.name] &&
                                        <Grid item xs={12}>
                                            <EvoList
                                                stats={{ name: this.state.name, Lvl: this.state.Lvl, Atk: this.state.Atk, Def: this.state.Def, Sta: this.state.Sta, }}
                                                pokemonTable={this.props.bases.pokemonBase}
                                            />
                                        </Grid>}
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
)(Evolve)
