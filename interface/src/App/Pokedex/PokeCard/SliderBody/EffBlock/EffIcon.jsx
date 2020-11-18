import React from "react";

import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

import Iconer from "App/Components/Iconer/Iconer";
import { typeDecoder } from "js/coders/typeDecoder";

const EffIcon = React.memo(function EffIcon(props) {
    return (
        <Box component="span" ml={1}>
            <Tooltip placement="top" arrow title={<Typography>{`${typeDecoder[props.i]} ${props.eff}`}</Typography>}>
                <Iconer folderName="/type/" fileName={String(props.i)} size={36} />
            </Tooltip>
        </Box>
    )
});

export default EffIcon;

EffIcon.propTypes = {
    eff: PropTypes.string,
    i: PropTypes.number,
};