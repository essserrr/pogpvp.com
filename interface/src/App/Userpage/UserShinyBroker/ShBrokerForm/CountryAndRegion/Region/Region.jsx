import React from "react";
import PropTypes from 'prop-types';

import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';
import { CountryRegionData } from "../crlist";

const Region = React.memo(function Region(props) {

    function returnRegionList() {
        if (!props.country) return [];

        const selectedCountry = CountryRegionData.find(value => value[0] === props.country)
        if (!selectedCountry) return [];

        return [{ value: "", title: props.defaultOption, }, ...selectedCountry[1].map((value) => ({ value: value, title: value, }))]
    }


    return (
        <SearchableSelect
            disableClearable
            label={props.label}
            value={props.value}
            onChange={props.onChange}
            errorText={props.notOk}
        >
            {returnRegionList()}
        </SearchableSelect>
    )
});

export default Region;


Region.propTypes = {
    value: PropTypes.string,
    notOk: PropTypes.string,
    label: PropTypes.string,
    country: PropTypes.string,

    onChange: PropTypes.func,
};