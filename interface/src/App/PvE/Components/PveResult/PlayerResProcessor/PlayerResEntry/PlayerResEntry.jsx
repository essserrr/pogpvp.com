import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';

import GreyPaper from "App/Components/GreyPaper/GreyPaper";
import StatisticsSet from "./StatisticsSet/StatisticsSet"
import DetailedStatisticsGenerator from "./DetailedStatisticsGenerator/DetailedStatisticsGenerator";

const useStyles = makeStyles((theme) => ({
    separator: {
        borderTop: "1px solid rgba(0, 0, 0, 0.295)",
        paddingTop: `${theme.spacing(1)}px`,
        marginTop: `${theme.spacing(1)}px`,
    },
}));

const PlayerResEntry = React.memo(function PlayerResEntry(props) {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    return (
        <GreyPaper elevation={4} enablePadding paddingMult={0.5} style={{ backgroundColor: "white" }}>

            <Grid item xs={12}>
                <StatisticsSet
                    tables={props.tables}
                    snapshot={props.snapshot}
                    value={props.value.overall}
                    disabled={{ avg: true, max: true, min: false, }}

                    onClick={() => setOpen(!open)}
                    showCollapse={open}
                />
            </Grid>

            <Grid item xs={12} className={open ? classes.separator : ""}>
                <Collapse in={open} unmountOnExit>
                    <DetailedStatisticsGenerator
                        tables={props.tables}
                        moveTable={props.moveTable}
                        snapshot={props.snapshot}
                        value={props.value.detailed}
                    />
                </Collapse>
            </Grid>

        </GreyPaper>
    )
});

export default PlayerResEntry;

PlayerResEntry.propTypes = {
    value: PropTypes.object,

    snapshot: PropTypes.object,
    tables: PropTypes.object,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};