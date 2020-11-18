import React from "react";
import PropTypes from 'prop-types';

import { calculateCP } from "js/cp/calculateCP";
import { calculateBossCP } from "js/cp/calculateBossCP";

const CP = React.memo(function CP(props) {
    const { Lvl, Atk, Def, Sta, pokemonTable, name, tier, isBoss } = props;

    return (
        isBoss ?
            calculateBossCP(
                name,
                tier,
                pokemonTable)
            :
            calculateCP(name,
                Lvl,
                Atk,
                Def,
                Sta,
                pokemonTable)
    )
});

export default CP;

CP.propTypes = {
    Lvl: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    Atk: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    Def: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    Sta: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),

    pokemonTable: PropTypes.object,

    name: PropTypes.string,
    tier: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    isBoss: PropTypes.bool,
};