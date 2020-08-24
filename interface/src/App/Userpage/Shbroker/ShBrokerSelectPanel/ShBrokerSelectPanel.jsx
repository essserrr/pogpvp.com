import React from "react"
import LocalizedStrings from "react-localization"

import SearchableSelect from "../../../PvP/components/SearchableSelect/SearchableSelect"
import UserShinyList from "../UserShinyList/UserShinyList"
import SelectGroup from "../../../PvP/components/SelectGroup/SelectGroup"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

import "./ShBrokerSelectPanel.scss"

let strings = new LocalizedStrings(userLocale)

class ShBrokerSelectPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <>
                <div className="shiny-selpanel__text">{`${this.props.label} (${Object.keys(this.props.userList).length}/400):`}</div>
                <SearchableSelect
                    attr={this.props.attr}
                    list={this.props.pokList}
                    onChange={this.props.onPokemonAdd}
                />
                <SelectGroup
                    label={strings.shbroker.amount}

                    attr={this.props.attr}
                    name="Amount"

                    options={<>
                        <option value="1" >1</option>
                        <option value="2" >2</option>
                        <option value="3" >3</option>
                        <option value="4" >4</option>
                        <option value="5" >5</option>
                        <option value="5+" >5+</option>
                    </>}

                    value={this.props.Amount}

                    onChange={this.props.onAmountChange}
                    for=""
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
