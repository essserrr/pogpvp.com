import React from "react";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => makeStyles(theme => {
    return ({
        stage: {
            cursor: "pointer",
        },
        stageColor: {
            color: theme.palette.stages[props.stage].text,
            fontWeight: props.stage !== "stage0" ? "bold" : "normal",
        },
    })
});

const Stat = React.memo(function Stat(props) {
    const { tip, title, stage, children } = props;

    const stages = ["stageN34", "stageN34", "stageN12", "stageN12", "stage0", "stageP12", "stageP12", "stageP34", "stageP34"];
    const classes = useStyles({ stage: stages[stage + 4] })();

    return (
        <Tooltip arrow placement="top" title={<Typography>{tip}</Typography>}>
            <Box className={`${classes.stage} ${classes.stageColor}`}>
                <Typography variant="body2" align="center">
                    {title}<br />{children}
                </Typography>
            </Box>
        </Tooltip>
    )
});

export default Stat;

Stat.propTypes = {
    children: PropTypes.number,
    stage: PropTypes.number,

    title: PropTypes.string,

    tip: PropTypes.string,
};