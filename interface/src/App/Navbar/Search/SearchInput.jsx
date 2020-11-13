import React from "react";
import { Link } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import { fade, withStyles } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { getCookie } from "js/getCookie";
import { navlocale } from "locale/Navbar/Navbar";

let strings = new LocalizedStrings(navlocale);

const styles = theme => ({
    input: {
        width: "150px",
        height: "32px",
        padding: `0px ${theme.spacing(0.5)}px 0px ${theme.spacing(0.5)}px`,

        borderRadius: `${theme.spacing(0.5)}px`,
        border: `1px solid ${theme.palette.text.disabled}`,

        "&:focus": {
            outline: "none",
            border: `1px solid ${theme.palette.text.primary}`,
        }
    },

    suggestionsContainer: {
        display: "none",
    },

    suggestionsContainerOpen: {
        display: "block",
        position: "absolute",
        zIndex: "200",

        marginTop: `${theme.spacing(1)}px`,
        padding: `${theme.spacing(1)}px 0px ${theme.spacing(1)}px 0px`,

        width: "150px",
        maxHeight: "240px",
        overflowY: "auto",

        backgroundColor: "white",
        border: `0.8px solid ${theme.palette.text.disabled}`,
        borderRadius: `${theme.spacing(0.5)}px`,
    },

    suggestionsList: {
        margin: "0px",
        padding: "0px",
        listStyleType: "none",
    },

    suggestion: {
        whiteSpace: "nowrap",
        overflowX: "hidden",
        textOverflow: "ellipsis",

        cursor: "pointer",
        fontWeight: "400",

        "& > *": {
            display: "block",
            width: "100%",
            height: "100%",

            padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px ${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
            marginBottom: `${theme.spacing(0.5)}px`,

            color: theme.palette.text.primary,
            "&:hover": {
                color: theme.palette.text.primary,
            },

            "&:last-of-type": {
                marginBottom: "0px !important",
            }
        },

    },

    suggestionHighlighted: {
        backgroundColor: fade(theme.palette.text.primary, 0.05),
    },
});

const getSuggestionValue = suggestion => {
    return suggestion.Title
}

const renderSuggestion = suggestion => {
    const encodedTitle = encodeURIComponent(suggestion.Title)
    return (
        <Link to={suggestion.MoveCategory ? `/movedex/id/${encodedTitle}` : `/pokedex/id/${encodedTitle}`}>
            {suggestion.Title}
        </Link>
    )
}

class SearchInput extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            value: '',
            suggestions: []
        };

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

        return this.props.children.filter(entry => (entry.Title.toLocaleLowerCase().indexOf(escapedValue) !== -1))
    }

    render() {
        const { classes } = this.props
        const { value, suggestions } = this.state
        const inputProps = {
            placeholder: strings.search,
            value,
            onChange: this.onChange,
        }
        return (
            <Tooltip placement="left" arrow title={<Typography color="inherit">{strings.tips.search}</Typography>}>
                <div>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}

                        renderSuggestion={renderSuggestion}

                        inputProps={inputProps}


                        theme={{
                            suggestionsContainer: classes.suggestionsContainer,
                            suggestionsContainerOpen: classes.suggestionsContainerOpen,

                            input: classes.input,

                            suggestion: classes.suggestion,
                            suggestionHighlighted: classes.suggestionHighlighted,

                            suggestionsList: classes.suggestionsList,
                        }}
                    />
                </div>
            </Tooltip>
        );
    }
};

export default withStyles(styles, { withTheme: true })(SearchInput);

SearchInput.propTypes = {
    children: PropTypes.array.isRequired,
};