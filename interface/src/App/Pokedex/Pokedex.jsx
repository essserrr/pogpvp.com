import React from "react"
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import PokedexListFilter from "./PokedexListFilter/PokedexListFilter"
import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import TypeRow from "../Movedex/TypeRow/TypeRow"
import GenRow from "./GenRow/GenRow"
import Input from "../PvP/components/Input/Input"

import { dexLocale } from "../../locale/dexLocale"
import { getCookie } from "../../js/getCookie"

import "./Pokedex.scss"

let strings = new LocalizedStrings(dexLocale);

class Pokedex extends React.Component {
    constructor(props) {
        super(props);
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
            <>
                <SiteHelm
                    url="https://pogpvp.com/pokedex"
                    header={strings.helm.pdtitle}
                    descr={strings.helm.pddescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className="row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="pokedex col-12  col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">

                            {this.state.loading &&
                                <Grid item xs={12}>
                                    <LinearProgress color="secondary" />
                                </ Grid>}

                            {this.state.isError && <Alert variant="filled" severity="error">{this.state.error}</Alert >}
                            {this.state.showResult &&
                                <>
                                    <Input
                                        onChange={this.onNameChange}
                                        place={strings.pokplace}
                                        value={this.state.name}
                                    />
                                    <div className="pokedex--font my-1">{strings.generation + ":"}</div>
                                    <GenRow
                                        filter={this.state.filter}
                                        onFilter={this.onFilter}
                                    />
                                    <TypeRow
                                        filter={this.state.filter}
                                        onFilter={this.onFilter}
                                    />

                                    {this.state.loadingTable &&
                                        <Grid item xs={12}>
                                            <LinearProgress color="secondary" />
                                        </ Grid>}

                                    <PokedexListFilter
                                        name={this.state.name}
                                        list={this.props.bases.pokemonBase}
                                        pokTable={this.props.bases.pokemonBase}
                                        filter={this.state.filter}
                                        sort={this.state.active}
                                        onClick={this.onSortColumn}
                                    />
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
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(Pokedex)