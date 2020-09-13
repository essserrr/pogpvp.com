import React from "react"
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import PokedexListFilter from "./PokedexListFilter/PokedexListFilter"
import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"
import TypeRow from "../Movedex/TypeRow/TypeRow"
import GenRow from "./GenRow/GenRow"
import Input from "../PvP/components/Input/Input"

import { dexLocale } from "../../locale/dexLocale"
import { getCookie } from "../../js/getCookie"

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

    onSortColumn(event) {
        let fieldName = event.currentTarget.getAttribute("name")
        let fieldType = event.currentTarget.getAttribute("coltype")
        this.setState({
            active: {
                field: fieldName,
                type: fieldType,
                order: fieldName === this.state.active.field ? !this.state.active.order : true,
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
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="singleNews max1200-1 col-12  col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    class="row justify-content-center mb-2"
                                    color="black"
                                    weight="500"
                                    locale={strings.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.isError && <Errors class="alert alert-danger p-2" value={this.state.error} />}
                            {this.state.showResult &&
                                <>
                                    <Input
                                        class="modifiedBorder form-control"
                                        onChange={this.onNameChange}
                                        place={strings.pokplace}
                                        value={this.state.name}
                                    />
                                    <div className="dexFont my-1">{strings.generation + ":"}</div>
                                    <GenRow
                                        filter={this.state.filter}
                                        onFilter={this.onFilter}
                                    />
                                    <TypeRow
                                        filter={this.state.filter}
                                        onFilter={this.onFilter}
                                    />
                                    {this.state.loadingTable &&
                                        <Loader
                                            class="row justify-content-center my-2"
                                            color="black"
                                            weight="500"
                                            locale={strings.loading}
                                            loading={this.state.loading}
                                        />}

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