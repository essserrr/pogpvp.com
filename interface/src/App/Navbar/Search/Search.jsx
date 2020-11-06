import React from "react";
import { connect } from "react-redux";

import SearchInput from "./SearchInput";

import { getMoveBase } from "AppStore/Actions/getMoveBase";
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";

class Search extends React.PureComponent {

    async componentDidMount() {
        await this.props.getPokemonBase()
        await this.props.getMoveBase()
    }

    render() {
        return (
            <SearchInput>
                {Object.values(this.props.bases.moveBase).concat(Object.values(this.props.bases.pokemonBase))}
            </SearchInput>
        );
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPokemonBase: () => dispatch(getPokemonBase()),
        getMoveBase: () => dispatch(getMoveBase()),
    }
};

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(Search);