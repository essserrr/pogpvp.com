import React from "react"

import RenderPvpRating from "./RenderPvpRating/RenderPvpRating"

class RatingPages extends React.Component {

    render() {
        return (
            <RenderPvpRating
                league={this.props.league}
                combination={this.props.combination}
                pokemonTable={this.props.pokemonTable}
                moveTable={this.props.moveTable}
                originalList={this.props.originalList}

                list={this.props.searchState ?
                    this.props.list.filter(elem => elem.Name.toLowerCase().indexOf(this.props.name.toLowerCase()) > -1) :
                    this.props.list}
            />

        );
    }
}


export default RatingPages