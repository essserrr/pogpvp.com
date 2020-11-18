import React from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';

import { privacy } from "locale/Terms/Terms";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(privacy)

const Terms = React.memo(function Terms(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <Grid container justify="center">
            <Grid item xs={10} sm={8} md={6}>
                <GreyPaper elevation={4} enablePadding={true} >
                    <Typography variant="h4" gutterBottom>{strings.terms.h1}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p1}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.terms.h3}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p2}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.terms.h3}</Typography>

                    <Typography variant="body2" gutterBottom>
                        {strings.terms.p3}
                        <Link title={strings.p} to="/privacy">{strings.p}</Link>{strings.terms.p31}
                    </Typography>

                    <Typography variant="h5" gutterBottom>{strings.terms.h4}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p4}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.terms.h5}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p5}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.terms.h6}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p6}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.terms.h7}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p7}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.terms.h8}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p8}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p9}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.terms.h9}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p10}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.terms.h10}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p11}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.terms.p12}</Typography>
                </GreyPaper>
            </Grid>
        </Grid>
    )

});

export default Terms;

