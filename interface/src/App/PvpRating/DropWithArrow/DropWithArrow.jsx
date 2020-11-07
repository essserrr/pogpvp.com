import React from "react"
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Grid from '@material-ui/core/Grid';

const DropWithArrow = React.memo(function (props) {
    const { title, children, iconBox, onClick } = props
    const [open, setOpen] = React.useState(false);

    return (
        <Grid container justify="center">

            <Grid item container xs={12} alignItems="center">
                <Grid item xs>{title}</Grid>
                <Box {...iconBox}>
                    <IconButton onClick={() => { if (onClick) onClick(!open); setOpen(!open) }}
                        style={{ outline: "none", width: '28px', height: '28px' }}>
                        {open ?
                            <KeyboardArrowUpIcon style={{ fontSize: '28px' }} />
                            :
                            <KeyboardArrowDownIcon style={{ fontSize: '28px' }} />}
                    </IconButton>
                </Box>

            </Grid>

            <Grid item xs={12}>
                <Collapse in={open} unmountOnExit>
                    {children}
                </Collapse>
            </Grid>

        </Grid>
    )
});

export default DropWithArrow;


DropWithArrow.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    iconBox: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};