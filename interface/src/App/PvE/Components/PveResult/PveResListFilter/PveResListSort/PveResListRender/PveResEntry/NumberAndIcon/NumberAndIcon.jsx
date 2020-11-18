import React from "react";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";
import { ReactComponent as Shadow } from "icons/shadow.svg"

const useStyles = makeStyles((theme) => ({
    shadow: {
        position: "absolute",
        right: "0px",

        width: "18px",
        height: "18px",
    },
}));

const NumberAndIcon = React.memo(function NumberAndIcon(props) {
    const classes = useStyles();

    const fileName = `${props.pok.Number}${props.pok.Forme !== "" ? `-${props.pok.Forme}` : ""}`;
    return (
        <Box position="relative">

            {props.index &&
                <b>{props.index}</b>}

            {props.isShadow &&
                <Shadow className={classes.shadow} />}

            <Iconer folderName="/pokemons/" fileName={fileName} size={48} />

        </Box>
    )
});

export default NumberAndIcon;

NumberAndIcon.propTypes = {
    isShadow: PropTypes.bool,
    pok: PropTypes.object,
    index: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),
};