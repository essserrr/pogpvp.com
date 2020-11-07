import React from "react";
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { singleTips } from "locale/Rating/ratingTips";
import { getCookie } from "js/getCookie";

let tips = new LocalizedStrings(singleTips);

const RatingDescr = React.memo(function RatingDescr() {
    tips.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container justify="center">

            <Typography variant="body2" gutterBottom>{tips.intr}</Typography>

            <Typography variant="h6" align="center" gutterBottom>{tips.rate}</Typography>

            <Typography variant="body2" gutterBottom>{tips.ratep1}</Typography>
            <Typography variant="body2" gutterBottom>{tips.ratep2}</Typography>
            <Typography variant="body2" gutterBottom>{tips.ratep3}</Typography>

            <Typography variant="h6" align="center" gutterBottom>{tips.alg}</Typography>

            <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>{tips.algp1}</Typography>

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
                        <li>
                            {tips.algul1.li4}
                        </li>
                    </ul>
                </Typography>
            </Grid>



            <Typography variant="h6" align="center" gutterBottom>{tips.move}</Typography>

            <Typography variant="body2" gutterBottom>{tips.movep1}</Typography>
            <Typography variant="body2" gutterBottom>{tips.movep2}</Typography>
            <Typography variant="body2" gutterBottom>{tips.movep3}</Typography>

        </Grid>
    )

});

export default RatingDescr;

