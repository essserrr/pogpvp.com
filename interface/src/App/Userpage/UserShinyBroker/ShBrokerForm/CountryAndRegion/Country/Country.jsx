import React from "react"

import SearchableSelect from "../../../../../PvP/components/SearchableSelect/SearchableSelect"
import LabelPrepend from "../../../../../PvP/components/SelectGroup/LabelPrepend"
import { CountryRegionData } from "../crlist"

import "./Country.scss"

class Country extends React.PureComponent {
    constructor(props) {
        super();
        this.state = {
            countriesList: [{ value: "", label: props.defaultOption, }, ...CountryRegionData.map((value) => ({ value: value[0], label: value[0], }))]
        }
    }

    render() {
        return (
            <div className="input-group input-group-sm">
                <LabelPrepend
                    label={this.props.label}

                    labelWidth={this.props.labelWidth}
                    tipClass="infoTip"
                    for={this.props.for}
                    place={"top"}
                    tip={this.props.tip}
                />
                <SearchableSelect
                    class={"country-box " + (this.props.notOk !== "" ? "country-input--alert " : "")}
                    classPrefix="country--prefix "

                    value={this.props.selectValue}

                    list={this.state.countriesList}
                    onChange={this.props.onChange}
                />
                {this.props.notOk !== "" && <div className="col-12 px-0 country-input__alert-text text-left">{this.props.notOk}</div>}
            </div>
        );
    }
}

export default Country
