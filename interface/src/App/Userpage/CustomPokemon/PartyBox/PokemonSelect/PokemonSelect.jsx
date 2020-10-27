import React from "react";
import PropTypes from 'prop-types';

import SerachableSelect from 'App/Components/SerachableSelect/SerachableSelect';
import { calculateCP } from "js/indexFunctions";


const PokemonSelect = React.memo(function PokemonSelect(props) {
    const { children, label, name, onChange, pokemonTable, ...other } = props;

    function makePokList(list) {
        return list.map((value, index) => {
            let val = `${value.Name} / CP${calculateCP(value.Name, value.Lvl, value.Atk, value.Def, value.Sta, pokemonTable)} / ${value.IsShadow === "true" ? "shadow" : "normal"} / ${value.QuickMove} / ${value.ChargeMove} / ${value.ChargeMove2} / Lvl${value.Lvl}: Atk${value.Atk} / Def${value.Def} / Sta${value.Sta}`
            return { index: index, title: val }
        })
    }

    return (
        <SerachableSelect
            disableClearable
            label={label}
            name={name}
            onChange={onChange}
            {...other}
        >
            {makePokList(children)}
        </SerachableSelect>
    )
});

export default PokemonSelect;

PokemonSelect.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
    ]).isRequired,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    pokemonTable: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};