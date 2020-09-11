import React from "react";
import Select from "react-select";

import "./SearchableSelect.scss"

const SearchableSelect = React.memo(function (props) {

    return (
        <>
            {props.label && <div className="searchable-select__text col-12 px-0">{props.label}</div>}
            <Select
                className={props.class ? props.class : ""}
                classNamePrefix={props.classPrefix ? props.classPrefix : "searchable-select "}
                value={{ value: props.value, label: props.value }}
                options={props.list}
                onChange={props.onChange}
                name={[props.attr, props.category]}
            />
        </>
    )

});


export default SearchableSelect;