import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import Type from "App/PvP/components/CpAndTypes/Type";
import CloseButton from "App/Components/CloseButton/CloseButton";
import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomMoves/CustomMoves";

const useStyles = makeStyles((theme) => ({
    customMove: {
        maxWidth: "150px",
        padding: "4px",
        borderRadius: "4px",
        border: `1px solid ${theme.palette.text.primary}`,

        cursor: "pointer",
        textAlign: "left",

        webkitTransition: "all 0.2s linear",
        transition: "all 0.2s linear",

        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0)",
        }
    },

    customMoveTitle: {
        fontWeight: "bold",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    customMoveBody: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
}));

let strings = new LocalizedStrings(userLocale)

const CustomMove = React.memo(function CustomMove(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const classes = useStyles();

    return (
        <Paper className={classes.customMove} onClick={(event) => props.onMoveOpen(event, props.move)}>
            <Grid container>
                <Grid item xs className={classes.customMoveTitle}>
                    <Type
                        class={"mr-1 mb-1 icon18"}
                        code={props.move.MoveType}
                    />
                    {props.move.Title}
                </Grid>
                <CloseButton onClick={() => props.onMoveDelete(props.move)} />
                <Grid item xs={12} className={classes.customMoveBody}>
                    {props.move.MoveCategory === "Fast Move" ? strings.moveconstr.catopt.q : strings.moveconstr.catopt.ch}
                </Grid>
            </Grid>
        </Paper>
    )
});

export default CustomMove;

CustomMove.propTypes = {
    move: PropTypes.object,
    onMoveOpen: PropTypes.func,
    onMoveDelete: PropTypes.func,
};








