import React from "react";

import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';
import { CountryRegionData } from "../crlist";

class Country extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            countriesList: [{ value: "", label: props.defaultOption, }, ...CountryRegionData.map((value) => ({ value: value[0], title: value[0], }))]
        }
    }

    render() {
        return (
            <SearchableSelect
                disableClearable
                label={this.props.label}
                value={this.props.selectValue}
                onChange={this.props.onChange}
                errorText={this.props.notOk}
            >
                {this.state.countriesList}
            </SearchableSelect>
        );
    }
}

export default Country
