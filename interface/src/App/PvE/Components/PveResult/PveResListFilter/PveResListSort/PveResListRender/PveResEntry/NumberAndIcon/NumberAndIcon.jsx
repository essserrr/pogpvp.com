import React from "react";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
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
        <Box display="flex" alignItems="center">
            {props.index &&
                <Typography variant="h6">{props.index}</Typography>}
            <Box position="relative" mx={1}>
                {props.isShadow &&
                    <Shadow className={classes.shadow} />}

                <Iconer folderName="/pokemons/" fileName={fileName} size={48} />

            </Box>
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