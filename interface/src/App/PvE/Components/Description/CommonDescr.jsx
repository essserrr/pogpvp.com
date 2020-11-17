import React from "react";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';

import LocalizedStrings from "react-localization";
import { commonRaidTips } from "locale/Pve/Tips/commonRaidTips";

import { getCookie } from "js/getCookie";

let tips = new LocalizedStrings(commonRaidTips);

const CommonDescr = React.memo(function CommonDescr(props) {
    tips.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <Grid container justify="center">

            <Typography variant="body2" gutterBottom>{tips.par1}</Typography>

            <Typography variant="h6" align="center" gutterBottom>{tips.legend}</Typography>

            <Grid item xs={12} container justify="center">

                <Tooltip arrow placement="top" title={<Typography>{tips.damage}</Typography>}>
                    <Box mx={1}>
                        <i className="fas fa-crosshairs fa-2x"></i>
                    </Box>
                </Tooltip>

                <Tooltip arrow placement="top" title={<Typography>{tips.pl}</Typography>}>
                    <Box mx={1}>
                        <i className="fas fa-users fa-2x"></i>
                    </Box>
                </Tooltip>

                <Tooltip arrow placement="top" title={<Typography>{"DPS"}</Typography>}>
                    <Box mx={1}>
                        <i className="fab fa-cloudscale fa-2x"></i>
                    </Box>
                </Tooltip>

                <Tooltip arrow placement="top" title={<Typography>{tips.fainted}</Typography>}>
                    <Box mx={1}>
                        <i className="fas fa-skull-crossbones fa-2x"></i>
                    </Box>
                </Tooltip>

                <Tooltip arrow placement="top" title={<Typography>{tips.time}</Typography>}>
                    <Box mx={1}>
                        <i className="far fa-clock fa-2x"></i>
                    </Box>
                </Tooltip>

                <Tooltip arrow placement="top" title={<Typography>{tips.ttw}</Typography>}>
                    <Box mx={1}>
                        <i className="far fa-hourglass fa-2x"></i>
                    </Box>
                </Tooltip>
            </Grid>

            <Typography variant="h6" align="center" gutterBottom>{tips.indat}</Typography>
            <Typography variant="body2" gutterBottom>{tips.indatp1}</Typography>
            <Typography variant="body2" gutterBottom>{tips.indatp2}</Typography>
            <Typography variant="body2" gutterBottom>{tips.indatp3}</Typography>


            <Typography variant="h6" align="center" gutterBottom>{tips.plnumb}</Typography>
            <Typography variant="body2" gutterBottom>{tips.plnumbp1}</Typography>

            <Typography variant="h6" align="center" gutterBottom>{tips.dodge}</Typography>
            <Typography variant="body2" gutterBottom>{tips.dodgep1}</Typography>

            <Typography variant="h6" align="center" gutterBottom>{tips.agr}</Typography>
            <Typography variant="body2" gutterBottom>{tips.agrp1}</Typography>

            <Typography variant="h6" align="center" gutterBottom>{tips.solv}</Typography>
            <Typography variant="body2" gutterBottom>{tips.solvp1}</Typography>
            <Typography variant="body2" gutterBottom>{tips.solvp2}</Typography>
            <Typography variant="body2" gutterBottom>
                <ul>
                    <li>
                        {tips.solvli1}
                    </li>
                    <li>
                        {tips.solvli2}
                    </li>
                    <li>
                        {tips.solvli3}
                    </li>
                    <li>
                        {tips.solvli4}
                    </li>
                </ul>
            </Typography>

            <Typography variant="h6" align="center" gutterBottom>{tips.break}</Typography>
            <Typography variant="body2" gutterBottom>{tips.breakp1}</Typography>

            <Typography variant="h6" align="center" gutterBottom>{tips.feat}</Typography>
            <Typography variant="body2" gutterBottom>{tips.featp1}</Typography>
        </Grid>
    )
});

export default CommonDescr;
