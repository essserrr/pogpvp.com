import React from "react";

import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';

const PartiesSelect = React.memo(function PokemonSelect(props) {
    const { children, label, name, onChange, maxSize, activePartyName, ...other } = props;

    const list = Object.keys(children).map((value) => ({ value: value, title: value }));
    const fullLabel = `${label} (${list.length}/${maxSize})`;

    return (
        <SearchableSelect
            disableClearable
            label={fullLabel}
            value={String(activePartyName)}
            name={name}
            onChange={onChange}
            {...other}
        >
            {list}
        </SearchableSelect>
    )
});

export default PartiesSelect

