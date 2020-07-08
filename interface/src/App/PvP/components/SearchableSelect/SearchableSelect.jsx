import React from "react";
import Select from "react-select";

const SearchableSelect = React.memo(function (props) {
    const customStyles = {
        control: styles => ({ ...styles, borderColor: "#59698d", borderWidth: "0.8px" }),
    }
    return (
        <Select
            className="font90 modifiedBorder"
            classNamePrefix="modifiedBorder"
            value={{ value: props.value, label: props.value }}
            options={props.list}
            onChange={props.onChange}
            name={[props.attr, props.category]}
            styles={customStyles}
        />
    )

});


export default SearchableSelect;