import React from "react"

import LazyTable from "../../../../Pokedex/PokedexListFilter/PokedexListSort/PokedexListRender/LazyTable/LazyTable"
import MoveRow from "./MoveRow/MoveRow"
import TableThead from "./TableThead/TableThead"


class MovedexListSort extends React.Component {
    render() {
        return (
            <LazyTable
                thead={<TableThead active={this.props.sort} onClick={this.props.onClick} />}
                activeFilter={this.props.sort}
                elementsOnPage={40}
            >
                {this.props.children.map(value => <MoveRow key={value[0]} value={value[1]} />)}
            </LazyTable>
        );
    }
}

export default MovedexListSort