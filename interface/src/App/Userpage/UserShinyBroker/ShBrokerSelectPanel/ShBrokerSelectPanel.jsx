import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from 'react-redux'

import SearchableSelect from "../../../PvP/components/SearchableSelect/SearchableSelect"
import UserShinyList from "../UserShinyList/UserShinyList"
import SelectGroup from "../../../PvP/components/SelectGroup/SelectGroup"
import Checkbox from "../../../RaidsList/Checkbox/Checkbox"

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
                {!this.props.checked && <div className="shiny-selpanel__text">
                    {`${this.props.label} (${Object.keys(this.props.userList).length}/${this.props.limit})`}
                </div>}
                {this.props.onCheckboxChange && this.props.session.username && <div className="col-12 px-0 my-1">
                    <Checkbox
                        class={"form-check form-check-inline m-0 ml-1"}
                        checked={this.props.checked ? "checked" : false}
                        attr={`${this.props.attr}Custom`}
                        label={strings.shbroker.int.choose}
                        onChange={this.props.onCheckboxChange}
                    />
                </div>}
                {this.props.onAmountChange && <SelectGroup
                    class="input-group input-group-sm my-2"
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
                />}

                {!this.props.checked &&
                    <div className="col-12 px-0 my-2">
                        <SearchableSelect
                            attr={this.props.attr}
                            list={this.props.pokList}
                            onChange={this.props.onPokemonAdd}
                        />
                    </div>}

                {!this.props.checked && <div className="col-12 px-0 mt-3 mb-2">
                    <UserShinyList
                        attr={this.props.attr}
                        pokemonTable={this.props.pokemonTable}
                        list={this.props.userList}
                        onPokemonDelete={this.props.onPokemonDelete}
                    />
                </div>}
            </>
        );
    }
}

export default connect(
    state => ({
        session: state.session,
    })
)(ShBrokerSelectPanel)

