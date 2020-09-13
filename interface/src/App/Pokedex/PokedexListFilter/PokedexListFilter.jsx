import React from "react"

import PokedexListSort from "./PokedexListSort/PokedexListSort"

class PokedexListFilter extends React.Component {

    filterList() {
        return Object.entries(this.props.list).filter(element => {
            return this.applyNameFilter(element[0]) && this.applyColFilter(element[1], this.props.filter)
        })
    }

    applyNameFilter(currName) {
        return currName.toLowerCase().indexOf(this.props.name.toLowerCase()) > -1
    }

    applyColFilter(element, filter) {
        let corresponds = true
        if (filter.type0 || filter.type1 || filter.type2 || filter.type3 || filter.type4 || filter.type5 ||
            filter.type6 || filter.type7 || filter.type8 || filter.type9 || filter.type10 || filter.type11 ||
            filter.type12 || filter.type13 || filter.type14 || filter.type15 || filter.type16 || filter.type17) {
            if (element.Type.reduce((result, type) => { return result * !filter["type" + type] }, true)) {
                corresponds *= false
            }
        }
        if (filter.gen1 || filter.gen2 || filter.gen3 || filter.gen4 || filter.gen5 || filter.gen6 || filter.gen7 || filter.gen8) {
            if (!filter["gen" + element.Generation]) {
                corresponds *= false
            }
        }
        return corresponds
    }


    render() {
        return (
            <PokedexListSort
                onClick={this.props.onClick}
                sort={this.props.sort}

                list={this.filterList()}
                pokTable={this.props.pokTable}
            />
        );
    }
}

export default PokedexListFilter