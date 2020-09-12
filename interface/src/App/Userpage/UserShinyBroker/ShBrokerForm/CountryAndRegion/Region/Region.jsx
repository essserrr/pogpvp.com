import React from "react"

import SearchableSelect from "../../../../../PvP/components/SearchableSelect/SearchableSelect"
import LabelPrepend from "../../../../../PvP/components/SelectGroup/LabelPrepend"
import { CountryRegionData } from "../crlist"

import "./Region.scss"

class Region extends React.PureComponent {
    returnRegionList() {
        if (!this.props.country) {
            return []
        }

        let selectedCountry = CountryRegionData.filter((value) => value[0] === this.props.country)

        if (!selectedCountry) {
            return []
        }

        return [{ value: "", label: this.props.defaultOption, }, ...selectedCountry[0][1].map((value) => ({ value: value, label: value, }))]
    }

    render() {
        let list = this.returnRegionList()

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
                    class={"region-box " + (this.props.notOk !== "" ? "region-input--alert" : "")}
                    classPrefix="region--prefix "

                    value={this.props.selectValue}

                    list={list}
                    onChange={this.props.onChange}
                />
                {this.props.notOk !== "" && <div className="col-12 px-0 region-input__alert-text text-left">{this.props.notOk}</div>}
            </div>
        );
    }
}

export default Region
