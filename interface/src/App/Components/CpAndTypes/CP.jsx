import React from "react";
import PropTypes from 'prop-types';

import { levelData } from "js/bases/levelData";
import { tierHP } from "js/bases/tierHP";

import { checkIV } from "js/checks/checkIV";
import { checkLvl } from "js/checks/checkLvl";

const CP = React.memo(function CP(props) {
    const { Lvl, Atk, Def, Sta, pokemonTable, name, tier, isBoss } = props;

    function calculateBossCP(name, tier, pokBase) {
        if (!name || !pokBase[name]) {
            return 0
        }
        return Math.trunc((15 + Number(pokBase[name].Atk)) * Math.pow(15 + Number(pokBase[name].Def), 0.5) *
            Math.pow(tierHP[tier], 0.5) / 10);
    }

    function calculateCP(name, Lvl, Atk, Def, Sta, pokBase) {
        if (!name || !pokBase[name]) {
            return 0
        }
        let cpAtLvl = Math.trunc(((checkIV(Atk) + Number(pokBase[name].Atk)) * Math.pow((checkIV(Def) + Number(pokBase[name].Def)), 0.5) *
            Math.pow((checkIV(Sta) + Number(pokBase[name].Sta)), 0.5) * Math.pow(levelData[checkLvl(Lvl) / 0.5], 2)) / 10)
        if (cpAtLvl < 10) {
            cpAtLvl = 10
        }
        return cpAtLvl
    }

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