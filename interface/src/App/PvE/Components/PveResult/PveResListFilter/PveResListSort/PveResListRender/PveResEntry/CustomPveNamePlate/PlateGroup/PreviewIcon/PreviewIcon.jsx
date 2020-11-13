import React from "react";
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Iconer from "App/Components/Iconer/Iconer";
import { ReactComponent as Shadow } from "icons/shadow.svg";

const PreviewIcon = React.memo(function PreviewIcon(props) {
    const pokemon = props.pokemonTable[props.Name];
    const fileName = `${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`

    return (
        <Tooltip arrow placement="top" title={<Typography>{props.Name}</Typography>}>
            <Box position="relative" px={0.25}>

                {pokemon &&
                    <Iconer fileName={fileName} folderName="/pokemons/" size={48} />}

                {String(props.IsShadow) === "true" &&
                    <Shadow className="preview-icon__shadow" style={{ width: "18px", height: "18px", position: "absolute", right: "-3px", }} />}

            </Box>
        </Tooltip>
    )
});

export default PreviewIcon;

PreviewIcon.propTypes = {
    Name: PropTypes.string,
    pokemonTable: PropTypes.object,
};