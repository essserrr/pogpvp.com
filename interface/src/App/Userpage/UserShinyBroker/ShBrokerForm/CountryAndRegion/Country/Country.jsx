import React from "react";
import PropTypes from 'prop-types';

import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';
import { CountryRegionData } from "../crlist";

const countriesList = CountryRegionData.map((value) => ({ value: value[0], title: value[0], }));

const Country = React.memo(function Country(props) {

    return (
        <SearchableSelect
            disableClearable
            label={props.defaultOption}

            value={props.value}
            onChange={props.onChange}
            errorText={props.notOk}
        >
            {countriesList}
        </SearchableSelect>
    )
});

export default Country;

Country.propTypes = {
    value: PropTypes.string,
    notOk: PropTypes.string,
    label: PropTypes.string,
    country: PropTypes.string,

    onChange: PropTypes.func,
};