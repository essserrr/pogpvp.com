import React from "react";

import SerachableSelect from 'App/Components/SerachableSelect/SerachableSelect';

const PartiesSelect = React.memo(function PokemonSelect(props) {
    const { children, label, name, onChange, maxSize, activePartyName, ...other } = props;

    const list = Object.keys(children).map((value) => ({ value1: value, title: value }));
    const fullLabel = `${label} (${list.length}/${maxSize})`;

    return (
        <SerachableSelect
            disableClearable
            label={fullLabel}
            value={String(activePartyName)}
            name={name}
            onChange={onChange}
            {...other}
        >
            {list}
        </SerachableSelect>
    )
});

export default PartiesSelect

