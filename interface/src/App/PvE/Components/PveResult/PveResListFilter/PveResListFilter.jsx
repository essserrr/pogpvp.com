import React from "react"

import PveResListSort from "./PveResListSort/PveResListSort"

class PveResListFilter extends React.Component {
    applyUniqueFilter() {
        if (this.props.filter.unique) {
            let list = {}
            return this.props.list.filter(elem => {
                const lastPokIndex = elem.Party.length - 1
                //check entry in local dict
                switch (list[`${elem.Party[lastPokIndex].Name}${String(elem.Party[lastPokIndex].IsShadow) === "true"}`]) {
                    //if it exists
                    case true:
                        //otherwise exclude
                        return false
                    default:
                        list[`${elem.Party[lastPokIndex].Name}${String(elem.Party[lastPokIndex].IsShadow) === "true"}`] = true
                        //and return include it
                        return true
                }
            })
        } else {
            return this.props.list
        }
    }

    render() {
        return (
            <PveResListSort
                n={this.props.n}
                customResult={this.props.customResult}

                snapshot={this.props.snapshot}
                tables={this.props.tables}

                pokemonTable={this.props.pokemonTable}
                moveTable={this.props.moveTable}
                pokList={this.props.pokList}
                chargeMoveList={this.props.chargeMoveList}
                quickMoveList={this.props.quickMoveList}

                showBreakpoints={this.props.showBreakpoints}

                sort={this.props.sort}
                list={this.applyUniqueFilter()}
                loadMore={this.props.loadMore}
            />
        );
    }
}

export default PveResListFilter