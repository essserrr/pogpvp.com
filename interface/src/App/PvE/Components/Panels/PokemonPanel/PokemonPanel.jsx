import React from "react";
import PropTypes from 'prop-types';

import PanelWithTitle from "../PanelWithTitle";
import PvePokemon from "../../PvePokemon";

const PokemonPanel = React.memo(function PokemonPanel(props) {
    const { title, ...other } = props;

    return (
        <PanelWithTitle title={title}>
            <PvePokemon {...other} />
        </PanelWithTitle>
    )
});

export default PokemonPanel;

PokemonPanel.propTypes = {
    PokemonPanel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    canBeShadow: PropTypes.bool,
    attr: PropTypes.node,

    pokemonTable: PropTypes.object.isRequired,
    moveTable: PropTypes.object.isRequired,
    pokList: PropTypes.arrayOf(PropTypes.object),
    chargeMoveList: PropTypes.arrayOf(PropTypes.object),
    quickMoveList: PropTypes.arrayOf(PropTypes.object),

    value: PropTypes.object.isRequired,
    settingsValue: PropTypes.object,

    onChange: PropTypes.func,
    onClick: PropTypes.func,
};