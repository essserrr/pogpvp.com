import React from "react";

import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';
import { CountryRegionData } from "../crlist"

class Region extends React.PureComponent {
    returnRegionList() {
        if (!this.props.country) {
            return []
        }

        let selectedCountry = CountryRegionData.filter((value) => value[0] === this.props.country)

        if (!selectedCountry) {
            return []
        }

        return [{ value: "", label: this.props.defaultOption, }, ...selectedCountry[0][1].map((value) => ({ value: value, title: value, }))]
    }

    render() {
        let list = this.returnRegionList()

        return (
            <SearchableSelect
                disableClearable
                label={this.props.label}
                value={this.props.selectValue}
                onChange={this.props.onChange}
                errorText={this.props.notOk}
            >
                {list}
            </SearchableSelect>
        );
    }
}

export default Region
