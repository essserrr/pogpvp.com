import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";


const useStyles = makeStyles((theme) => ({
    title: {
        fontWeight: 500,
        borderBottom: "3px solid rgba(0, 0, 0, 0.342)",
    },
}));

let strings = new LocalizedStrings(dexLocale);

const MoveCardTitle = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Grid container alignItems="center" className={classes.title}>

            <Iconer size={24} folderName="/type/" fileName={String(props.move.MoveType)} />

            <Box ml={1}>
                <Typography variant="h4">
                    {props.move.Title}
                </Typography>
            </Box>

            <Box ml={1}>
                <Typography variant="h5">
                    ({props.move.MoveCategory === "Charge Move" ? strings.chm : strings.qm})
                </Typography>
            </Box>
        </Grid>
    )

});

export default MoveCardTitle;

MoveCardTitle.propTypes = {
    move: PropTypes.object.isRequired,
};