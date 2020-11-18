import React from "react";
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { singleTips } from "locale/singleTips";
import { getCookie } from "js/getCookie";

let tips = new LocalizedStrings(singleTips)

const SingleDescr = function SingleDescr(props) {
    tips.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <Grid container justify="center">
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.intr}</Typography>
            </Grid>

            <Typography variant="h6" align="center" gutterBottom>{tips.rate}</Typography>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.ratep1}</Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom><b>{tips.ratep2}</b></Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.ratep3}</Typography>
            </Grid>

            <Typography variant="h6" align="center" gutterBottom>{tips.max}</Typography>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.maxp1}</Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>
                    <ul>
                        <li>
                            {tips.maxul.li1}
                        </li>
                        <li>
                            {tips.maxul.li2}
                        </li>
                        <li>
                            {tips.maxul.li3}
                        </li>
                        <li>
                            {tips.maxul.li4}
                        </li>
                    </ul>
                </Typography>
            </Grid>


            <Typography variant="h6" align="center" gutterBottom>{tips.move}</Typography>

            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.movep1}</Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.movep2}</Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.movep3}</Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>
                    <ul>
                        <li>
                            {tips.moveul.li1}
                        </li>
                        <li>
                            {tips.moveul.li2}
                        </li>
                        <li>
                            {tips.moveul.li3}
                        </li>
                    </ul>
                </Typography>
            </Grid>

            <Typography variant="h6" align="center" gutterBottom>{tips.alg}</Typography>

            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.algp1}</Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>
                    <ul>
                        <li>
                            {tips.algul1.li1}
                        </li>
                        <li>
                            {tips.algul1.li2}
                        </li>
                        <li>
                            {tips.algul1.li3}
                        </li>
                    </ul>
                </Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.algp2}</Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>
                    <ul>
                        <li>
                            {tips.algul2.li1}
                        </li>
                        <li>
                            {tips.algul2.li2}
                        </li>
                    </ul>
                </Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.algp3}</Typography>
            </Grid>

            <Typography variant="h6" align="center" gutterBottom>{tips.constr}</Typography>

            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.constrp1}</Typography>
            </Grid>
            <Grid container xs={12}>
                <Typography variant="body2" gutterBottom>{tips.constrp2}</Typography>
            </Grid>


        </Grid>
    )

};

export default SingleDescr;

