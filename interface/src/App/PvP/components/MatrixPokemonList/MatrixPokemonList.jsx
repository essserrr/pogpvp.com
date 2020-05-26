import React from "react";

class MatrixPokemonList extends React.PureComponent {
    render() {
        return (
            <div className="matrixPokemonList mb-1 px-1">
                {this.props.list}
            </div>
        )
    }

}

export default MatrixPokemonList