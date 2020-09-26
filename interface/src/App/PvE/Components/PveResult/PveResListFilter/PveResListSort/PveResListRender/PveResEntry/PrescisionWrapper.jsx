import React from "react"

import PveResEntry from "./PveResEntry"

class PrescisionWrapper extends React.PureComponent {
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
                chargeMoveList={this.props.chargeMoveList}
                quickMoveList={this.props.quickMoveList}

                showBreakpoints={this.props.showBreakpoints}

                pokemonRes={this.state.pokemonRes}
                replace={this.replace} />
        );
    }
};

export default PrescisionWrapper;


