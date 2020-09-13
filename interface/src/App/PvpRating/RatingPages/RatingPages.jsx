import React from "react"

import RatingFilter from "./RatingFilter/RatingFilter"

class RatingPages extends React.Component {

    render() {
        return (
            <RatingFilter
                name={this.props.name}
                league={this.props.league}
                combination={this.props.combination}
                pokemonTable={this.props.pokemonTable}
                moveTable={this.props.moveTable}
                searchState={this.props.searchState}
                originalList={this.props.originalList}
                list={this.props.searchState ? this.props.list : this.props.list.slice(0, this.props.n)}
            />

        );
    }
}


export default RatingPages