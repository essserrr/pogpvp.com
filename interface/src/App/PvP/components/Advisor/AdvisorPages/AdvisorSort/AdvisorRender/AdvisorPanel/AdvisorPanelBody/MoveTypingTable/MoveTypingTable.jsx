import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import MatrixTable from "App/PvP/components/TableBodyRender/MatrixTable/MatrixTable";
import TypingHead from "../TypingHead/TypingHead";
import SingleMoveLine from "../SingleMoveLine/SingleMoveLine";

import { addStar } from "js/addStar";
import { advisor } from "locale/Pvp/Advisor/Advisor";
import { options } from "locale/Components/Options/locale";
import { getCookie } from "js/getCookie";

let advisorStrings = new LocalizedStrings(advisor);
let optionStrings = new LocalizedStrings(options);

const MoveTypingTable = React.memo(function MoveTypingTable(props) {
    advisorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    const singleMoveLine = (arr, name, pok) => {
        arr.push([
            <SingleMoveLine
                key={arr.length + name}
                MoveType={props.moveTable[name].MoveType}
                line={arr.length}
                name={name}
                star={addStar(pok.name, name, props.pokemonTable)}
            />])
    }


    return (
        <MatrixTable variant="secondary">
            {[
                <TypingHead key="movetyping" />,
                ...props.pokemons.reduce((sum, pok) => {
                    if (pok.QuickMove) singleMoveLine(sum, pok.QuickMove, pok);
                    if (pok.ChargeMove1) singleMoveLine(sum, pok.ChargeMove1, pok);
                    if (pok.ChargeMove2) singleMoveLine(sum, pok.ChargeMove2, pok);
                    return sum;
                }, [])
            ]}
        </MatrixTable>
    )
});

export default MoveTypingTable;

MoveTypingTable.propTypes = {
    pokemons: PropTypes.arrayOf(PropTypes.object),

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};