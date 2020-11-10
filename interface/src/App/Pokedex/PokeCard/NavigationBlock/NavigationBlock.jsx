import React from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const NavigationBlock = React.memo(function (props) {

    function buttonsConfig() {
        if (props.prev && props.next) { return "space-between" }
        if (props.prev) { return "flex-start" }
        return "flex-end"
    }

    console.log(props)
    return (
        <Grid container justify={buttonsConfig()}>
            {props.prev &&
                <Link to={navigator.userAgent === "ReactSnap" ? "/" : props.prev}>
                    <Tooltip placement="top" arrow
                        title={<Typography color="inherit">{props.prevTitle}</Typography>}>
                        <DoubleArrowIcon style={{ transform: "rotate(180deg)", fontSize: "32px" }} />
                    </Tooltip>
                </Link>}

            {props.next &&
                <Link to={navigator.userAgent === "ReactSnap" ? "/" : props.next}>
                    <Tooltip placement="top" arrow
                        title={<Typography color="inherit">{props.nextTitle}</Typography>}>
                        <DoubleArrowIcon style={{ fontSize: "32px" }} />
                    </Tooltip>
                </Link >}
        </Grid>
    )
});

export default NavigationBlock;

NavigationBlock.propTypes = {
    prev: PropTypes.string,
    next: PropTypes.string,

    prevTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    nextTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
}