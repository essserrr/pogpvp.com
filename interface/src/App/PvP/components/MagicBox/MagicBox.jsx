import React from "react";
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import CloseButton from "App/Components/CloseButton/CloseButton";

const useStyles = makeStyles((theme) => ({
    magicBox: {
        width: "320px",
        borderRadius: "4px",
    },
    magicBoxTitle: {
        fontSize: "14pt",
    },
}));

const MagicBox = React.memo(function MagicBox(props) {
    const classes = useStyles();
    const { open, title, children, attr, onClick, ...other } = props;

    return (
        <Dialog PaperProps={{ className: classes.magicBox }} open={open} scroll={"body"}
            onClose={(event, ...other) => { onClick(event, { attr: attr }, ...other) }}
            {...other}>
            <Box px={2} pt={2} pb={3}>
                <Grid container spacing={1}>
                    <Grid container item xs={12} justify="flex-end">
                        <CloseButton onClick={(event, ...other) => { onClick(event, { attr: attr }, ...other) }} />
                    </Grid>
                    {title &&
                        <Grid item xs={12} className={classes.magicBoxTitle}>
                            {title}
                        </Grid>}
                    <Grid item xs={12}>
                        {children}
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    )
});

export default MagicBox;

MagicBox.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    attr: PropTypes.string,
    onClick: PropTypes.func,

};