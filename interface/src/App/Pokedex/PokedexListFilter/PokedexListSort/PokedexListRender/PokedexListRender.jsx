import React from "react"

import LazyTable from "./LazyTable/LazyTable"
import PokeRow from "./PokeRow/PokeRow"
import TableThead from "./TableThead/TableThead"

import { calculateCP } from "../../../../../js/indexFunctions"

class PokedexListRender extends React.Component {
    render() {
        return (
            <LazyTable
                list={this.props.list.map((value) => {
                    value[1].CP = calculateCP(value[1].Title, 40, 15, 15, 15, this.props.pokTable)
                    return <PokeRow
                        key={value[0]}
                        value={value[1]}
                    />
                })}
                thead={<>
                    <TableThead
                        active={this.props.sort}
                        onClick={this.props.onClick}
                    />
                </>}
                activeFilter={this.props.sort}
                elementsOnPage={40}
            />
        );
    }
}

export default PokedexListRender