import React from "react";
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import Autosuggest from "react-autosuggest"
import ReactTooltip from "react-tooltip"

import { getMoveBase } from "../../../AppStore/Actions/getMoveBase"
import { getPokemonBase } from "../../../AppStore/Actions/getPokemonBase"
import { getCookie } from "../../../js/getCookie"

import LocalizedStrings from "react-localization"
import { locale } from "../../../locale/locale"

import "./Search.scss"

let strings = new LocalizedStrings(locale)



function getSuggestionValue(suggestion) {
    return suggestion.Title
}

function renderSuggestion(suggestion) {
    const encodedTitle = encodeURIComponent(suggestion.Title)
    return (
        <Link to={suggestion.MoveCategory ? `/movedex/id/${encodedTitle}` : `/pokedex/id/${encodedTitle}`} style={{ display: "block" }}>
            {suggestion.Title}
        </Link>
    )
}

class Search extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            value: '',
            suggestions: []
        };

    }

    async componentDidMount() {
        await this.props.getPokemonBase()
        await this.props.getMoveBase()
    }

    onChange = (event, { newValue, method }) => {
        this.setState({ value: newValue })
    }

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({ suggestions: this.getSuggestions(value) })
    }

    onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] })
    }

    getSuggestions(value) {
        const escapedValue = value.trim().toLocaleLowerCase()

        if (escapedValue === '') { return [] }

        if (escapedValue.length < 3) { return [] }

        return [...Object.values(this.props.bases.moveBase), ...Object.values(this.props.bases.pokemonBase)]
            .filter(entry => (entry.Title.toLocaleLowerCase().indexOf(escapedValue) !== -1))
    }

    render() {
        const { value, suggestions } = this.state
        const inputProps = {
            placeholder: strings.search,
            value,
            onChange: this.onChange
        }

        return (
            <>
                <form className={"form-inline " + (this.props.class ? this.props.class : "")} data-tip data-for="SearchBox">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps} />
                </form>
                <ReactTooltip
                    className={"infoTip"}
                    id="SearchBox" effect="solid"
                    place={"left"}
                    multiline={false}>
                    {strings.tips.search}
                </ReactTooltip>
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
)(Search)