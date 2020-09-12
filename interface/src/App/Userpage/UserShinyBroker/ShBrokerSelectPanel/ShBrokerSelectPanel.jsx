import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from 'react-redux'

import UserShinyFilter from "../UserShinyFilter/UserShinyFilter"
import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import MagicBox from "../../../PvP/components/MagicBox/MagicBox"
import ImportExport from "../../../PvP/components/ImportExport/ImportExport"
import SearchableSelect from "../../../PvP/components/SearchableSelect/SearchableSelect"
import SelectGroup from "../../../PvP/components/SelectGroup/SelectGroup"
import Checkbox from "../../../RaidsList/Checkbox/Checkbox"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

import "./ShBrokerSelectPanel.scss"

let strings = new LocalizedStrings(userLocale)

class ShBrokerSelectPanel extends React.PureComponent {
    constructor(props) {
        super();
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
                    class="input-group input-group-sm mt-2 mb-3"
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

                {this.props.showImportExportPanel && <MagicBox
                    onClick={this.props.onTurnOnImport}
                    attr={this.props.attr}
                    element={
                        <ImportExport
                            type="shiny"
                            initialValue={Object.values(this.props.userList)}
                            pokemonTable={this.props.pokemonTable}

                            action="Import/Export"
                            attr={this.props.attr}
                            onChange={this.props.onImport}
                        />
                    }
                />}

                {this.props.onImport && <div className="row  justify-content-center align-items-center mx-0 mt-3" >
                    <SubmitButton
                        class="longButton btn btn-primary btn-sm mx-0"
                        attr={this.props.attr}
                        label={strings.impExp}
                        onSubmit={this.props.onTurnOnImport} />
                </div>}

                {!this.props.checked && <div className="col-12 px-0 mt-3 mb-2">
                    <UserShinyFilter
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

