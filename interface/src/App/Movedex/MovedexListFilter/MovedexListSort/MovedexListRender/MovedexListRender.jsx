import React from "react"

import LazyTable from "../../../../Pokedex/PokedexListFilter/PokedexListSort/PokedexListRender/LazyTable/LazyTable"
import MoveRow from "./MoveRow/MoveRow"
import TableThead from "./TableThead/TableThead"


class MovedexListSort extends React.Component {
    render() {
        return (
            <LazyTable
                list={this.props.list.map(value => <MoveRow key={value[0]} value={value[1]} />)}
                thead={<>
                    <TableThead
                        active={this.props.sort}
                        onClick={this.props.onClick}
                    />
                </>}
                activeFilter={this.props.sort}
                elemntsOnPage={40}
            />
        );
    }
}

export default MovedexListSort