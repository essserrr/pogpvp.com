import React from "react";

class MatrixPokemonList extends React.PureComponent {
    render() {
        return (
            <div className="overflowingy mb-1 px-1" style={{ maxHeight: "150px" }}>
                {this.props.list}
            </div>
        )
    }

}

export default MatrixPokemonList