import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import Input from "App/Components/Input/Input";
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import PokedexListFilter from "./PokedexListFilter/PokedexListFilter";
import TypeRow from "../Movedex/TypeRow/TypeRow";
import GenRow from "./GenRow/GenRow";

import { dexLocale } from "locale/Pokedex/Pokedex";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(dexLocale);

class Pokedex extends React.Component {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            name: "",
            active: {},
            filter: {},

            showLegend: false,
            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
        this.onShowLegend = this.onShowLegend.bind(this)
        this.onNameChange = this.onNameChange.bind(this)
        this.onSortColumn = this.onSortColumn.bind(this)
        this.onFilter = this.onFilter.bind(this)
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        try {
            let response = await this.props.getPokemonBase()
            //if response is not ok, handle error
            if (!response.ok) { throw response.detail }

            this.setState({
                showResult: true,
                isError: false,
                loading: false,
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

    onNameChange(event) {
        this.setState({
            name: !event.target.value ? "" : event.target.value,
        });
    }

    onFilter(event) {
        let attr = event.currentTarget.getAttribute("attr")
        this.setState({
            filter: {
                ...this.state.filter,
                [attr]: !this.state.filter[attr],
            },
        });
    }

    onShowLegend() {
        this.setState({
            showLegend: !this.state.showLegend
        })
    }

    onSortColumn(event, attributes) {
        const { coltype, name } = attributes;

        this.setState({
            active: {
                field: name,
                type: coltype,
                order: name === this.state.active.field ? !this.state.active.order : true,
            },
        });
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/pokedex"
                    header={strings.helm.pdtitle}
                    descr={strings.helm.pddescr}
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
                                </ Grid>}

                            {this.state.showResult &&
                                <>
                                    <Grid item xs={12}>
                                        <Input
                                            onChange={this.onNameChange}
                                            label={strings.pokplace}
                                            value={this.state.name}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid item xs={12}>
                                            <Typography variant="body1">{`${strings.generation}:`}</Typography>
                                        </Grid>
                                        <GenRow
                                            filter={this.state.filter}
                                            onFilter={this.onFilter}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TypeRow
                                            filter={this.state.filter}
                                            onFilter={this.onFilter}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <PokedexListFilter name={this.state.name} filter={this.state.filter} sort={this.state.active} onClick={this.onSortColumn}>
                                            {this.props.bases.pokemonBase}
                                        </PokedexListFilter>
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
)(Pokedex)