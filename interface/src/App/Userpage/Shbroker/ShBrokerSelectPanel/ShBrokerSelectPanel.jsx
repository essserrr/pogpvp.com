import React from "react"

import SearchableSelect from "../../../PvP/components/SearchableSelect/SearchableSelect"
import UserShinyList from "../UserShinyList/UserShinyList"

import "./ShBrokerSelectPanel.scss"

class ShBrokerSelectPanel extends React.PureComponent {
    render() {
        return (
            <>
                <div className="shiny-selpanel__text">{`${this.props.label} (${Object.keys(this.props.userList).length}/250):`}</div>
                <SearchableSelect
                    attr={this.props.attr}
                    list={this.props.pokList}
                    onChange={this.props.onPokemonAdd}
                />
                <div className="col-12 px-0 pt-3 pb-2">
                    <UserShinyList
                        attr={this.props.attr}
                        pokemonTable={this.props.pokemonTable}
                        list={this.props.userList}
                        onPokemonDelete={this.props.onPokemonDelete}
                    />
                </div>
            </>
        );
    }
}

export default ShBrokerSelectPanel
