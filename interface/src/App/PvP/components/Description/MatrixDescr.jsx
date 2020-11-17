import React from "react";
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import Iconer from "App/Components/Iconer/Iconer";
import { ReactComponent as Shadow } from "icons/shadow.svg";

import LocalizedStrings from "react-localization";
import { matrixTips } from "locale/matrixTips";
import { getCookie } from "js/getCookie";

const useStyles = makeStyles((theme) => ({
    cell: {
        fontWeight: "500",
        minWidth: "70px",
        maxWidth: "80px",
        border: "1.5px solid #42434e",
        borderRadius: "3px",
        overflow: "hidden",

        textAlign: "center",

        "& div:first-child": {
            borderRight: "1.5px solid #42434e",
            "&:hover": {
                backgroundColor: "white !important",
            },
        },

        "& div:nth-child(2)": {
            borderRight: "1.5px solid #42434e",
            "&:hover": {
                backgroundColor: "white !important",
            },
        },

        "& div:nth-child(3)": {
            "&:hover": {
                backgroundColor: "white !important",
            },
        },

        "& div:last-child": {
            borderTop: "1.5px solid #42434e",
            userSelect: "none",
        }
    },

    shadow: {
        position: "absolute",
        right: "0px",

        width: "16px",
        height: "16px",
    },

}));

let tips = new LocalizedStrings(matrixTips)

const MatrixDescr = React.memo(function MatrixDescr(props) {
    tips.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const classes = useStyles();

    return (
        <Grid container justify="center">
            <Grid item xs={12}>
                {tips.par1}
            </Grid>
            <Grid item xs={12}>
                {tips.par2}
            </Grid>

            <Typography variant="h6" align="center" gutterBottom>{tips.overall}</Typography>

            <Grid item xs={12}>
                <Grid container justify="center" alignItems="center">

                    <Box mx={3}>
                        <Typography variant="body1" align="center">
                            {tips.result}
                        </Typography>
                        <Grid container justify="center" className={classes.cell}>

                            <Tooltip arrow placement="top" title={<Typography>{tips.cells.v0}</Typography>}>
                                <Grid item xs={4} style={{ backgroundColor: "rgb(139, 219, 195)" }} >
                                    {"+1"}
                                </Grid>
                            </Tooltip>


                            <Tooltip arrow placement="top" title={<Typography>{tips.cells.v1}</Typography>}>
                                <Grid item xs={4} style={{ backgroundColor: "rgb(181, 182, 182)" }}>
                                    {"0"}
                                </Grid>
                            </Tooltip>


                            <Tooltip arrow placement="top" title={<Typography>{tips.cells.v2}</Typography>}>
                                <Grid item xs={4} style={{ backgroundColor: "rgb(230, 141, 82)" }} >
                                    {"-1"}
                                </Grid>
                            </Tooltip>



                            <Tooltip arrow placement="top" title={<Typography>{tips.cells.over}</Typography>}>
                                <Grid item xs={12} style={{ backgroundColor: "rgb(68, 202, 157)" }}>
                                    {1000}
                                </Grid>
                            </Tooltip>


                        </Grid>
                    </Box>

                    <Box mx={3}>
                        <Typography variant="body1" align="center">
                            {tips.color}
                        </Typography>


                        <Grid container justify="center" wrap="nowrap">

                            <Tooltip arrow placement="top" title={<Typography>{tips.colortip.g2}</Typography>}>
                                <Box fontWeight="bold" textAlign="center" mx={0.5}
                                    style={{ width: "30px", padding: "5px 0px", backgroundColor: "rgb(68, 202, 157)" }} >
                                    {"+2"}
                                </Box>
                            </Tooltip>

                            <Tooltip arrow placement="top" title={<Typography>{tips.colortip.g1}</Typography>}>
                                <Box fontWeight="bold" textAlign="center" mx={0.5}
                                    style={{ width: "30px", padding: "5px 0px", backgroundColor: "rgb(139, 219, 195)" }} >
                                    {"+1"}
                                </Box>
                            </Tooltip>

                            <Tooltip arrow placement="top" title={<Typography>{tips.colortip.g}</Typography>}>
                                <Box fontWeight="bold" textAlign="center" mx={0.5}
                                    style={{ width: "30px", padding: "5px 0px", backgroundColor: "rgb(181, 182, 182)" }} >
                                    {"0"}
                                </Box>
                            </Tooltip>

                            <Tooltip arrow placement="top" title={<Typography>{tips.colortip.r1}</Typography>}>
                                <Box fontWeight="bold" textAlign="center" mx={0.5}
                                    style={{ width: "30px", padding: "5px 0px", backgroundColor: "rgb(230, 141, 82)" }} >
                                    {"-1"}
                                </Box>
                            </Tooltip>

                            <Tooltip arrow placement="top" title={<Typography>{tips.colortip.r2}</Typography>}>
                                <Box fontWeight="bold" textAlign="center" mx={0.5}
                                    style={{ width: "30px", padding: "5px 0px", backgroundColor: "rgb(224, 86, 32)" }} >
                                    {"-2"}
                                </Box>
                            </Tooltip>
                        </Grid>
                    </Box>

                </Grid>
            </Grid>

            <Typography variant="h6" align="center" gutterBottom>{tips.adv}</Typography>

            <Grid item xs={12}>
                {tips.advp1}
            </Grid>
            <Grid item xs={12}>
                {tips.advp2}
            </Grid>
            <Grid item xs={12}>
                {tips.advp3}
            </Grid>
            <Grid item xs={12}>
                {tips.advp4}
            </Grid>
            <Grid item xs={12}>
                {tips.advp5}
            </Grid>

            <Typography variant="h6" align="center" gutterBottom>{tips.advTip}</Typography>

            <Box clone maxWidth="405px">
                <Grid item xs={12} sm={8} md={8} lg={7}>
                    <GreyPaper elevation={4} enablePadding paddingMult={0.5} style={{ backgroundColor: "white" }}>
                        <Grid container alignItems="center" justify="space-between">

                            <Box clone mr={2}>
                                <Grid container alignItems="center" justify="space-between" item xs>
                                    <Tooltip arrow placement="top" title={<Typography>{tips.cardTip.n}</Typography>}>
                                        <Grid item xs="auto">{"#1"}</Grid>
                                    </Tooltip>

                                    <Tooltip arrow placement="top" title={<Typography>{tips.cardTip.p1}</Typography>}>
                                        <Grid item xs="auto">
                                            <Iconer folderName="/pokemons/" fileName={"644"} size={48} />
                                        </Grid>
                                    </Tooltip>

                                    <Tooltip arrow placement="top" title={<Typography>{tips.cardTip.p2}</Typography>}>
                                        <Grid item xs="auto" style={{ position: "relative" }}>
                                            {<Shadow className="matrix-descr--shadow" />}
                                            <Iconer folderName="/pokemons/" fileName={"493-3"} size={48} />
                                        </Grid>
                                    </Tooltip>

                                    <Tooltip arrow placement="top" title={<Typography>{tips.cardTip.p3}</Typography>}>
                                        <Grid item xs="auto">
                                            <Iconer folderName="/pokemons/" fileName={"132"} size={48} />
                                        </Grid>
                                    </Tooltip>
                                </Grid>
                            </Box>

                            <Tooltip arrow placement="top" title={<Typography>{tips.cardTip.zer}</Typography>}>
                                <Box mx={1}>
                                    <Box clone mr={0.5}><i className="fas fa-skull-crossbones"></i></Box>99
                                </Box>
                            </Tooltip>

                            <Tooltip arrow placement="top" title={<Typography>{tips.cardTip.rate}</Typography>}>
                                <Box mx={1}>
                                    <Box clone mr={0.5}><i className="fas fa-trophy"></i></Box>1000
                                </Box>
                            </Tooltip>

                            <Grid item xs="auto">
                                <Tooltip arrow placement="top" title={<Typography>{tips.cardTip.more}</Typography>}>
                                    <i className={"fas fa-angle-down fa-lg"}></i>
                                </Tooltip>
                            </Grid>



                        </Grid>
                    </GreyPaper>
                </Grid>
            </Box>


        </Grid>


    )

});

export default MatrixDescr;
