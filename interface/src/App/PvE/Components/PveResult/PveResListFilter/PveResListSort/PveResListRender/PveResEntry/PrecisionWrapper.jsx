import React from "react";
import PropTypes from 'prop-types';

import PveResEntry from "./PveResEntry";

class PrecisionWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pokemonRes: props.pokemonRes,
        };

        this.replace = this.replace.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (this.props.pokemonRes === prevProps.pokemonRes) { return }
        this.setState({
            pokemonRes: this.props.pokemonRes,
        })
    }

    replace(result) {
        this.setState({
            pokemonRes: result[0],
        })
    }

    render() {
        return (
            <PveResEntry
                i={this.props.i}
                customResult={this.props.customResult}

                snapshot={this.props.snapshot}
                tables={this.props.tables}

                pokemonTable={this.props.pokemonTable}
                moveTable={this.props.moveTable}
                pokList={this.props.pokList}

                showBreakpoints={this.props.showBreakpoints}

                pokemonRes={this.state.pokemonRes}
                replace={this.replace}
            />
        );
    }
};

export default PrecisionWrapper;


PrecisionWrapper.propTypes = {
    i: PropTypes.number,
    pokemonRes: PropTypes.object,
    customResult: PropTypes.bool,

    snapshot: PropTypes.object,
    tables: PropTypes.object,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,

    showBreakpoints: PropTypes.func,
};

