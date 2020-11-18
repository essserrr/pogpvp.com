import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';

import { privacy } from "locale/Privacy/privacy";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(privacy)

const Privacy = React.memo(function Privacy() {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <Grid container justify="center">
            <Grid item xs={10} sm={8} md={6}>
                <GreyPaper elevation={4} enablePadding={true} >
                    <Typography variant="h4" gutterBottom>{strings.priv.h1}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p1}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p2}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p3}</Typography>

                    <Typography variant="body2" gutterBottom>
                        {strings.priv.p4}
                        <Link title={strings.tandc} to="/terms">{strings.tandc}</Link>
                        {strings.priv.p41}
                        <a href="https://www.privacypolicytemplate.net">Privacy Policy Template</a>
                        {strings.priv.p42}<a href="https://www.disclaimergenerator.org/">Disclaimer Generator</a>.
                    </Typography>

                    <Typography variant="h5" gutterBottom>{strings.priv.h2}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p5}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.priv.h3}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p6}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.priv.h4}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p7}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p8}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p9}
                        <a href="https://www.cookieconsent.com/what-are-cookies/">"What Are Cookies"</a>.
                    </Typography>

                    <Typography variant="h5" gutterBottom>{strings.priv.h5}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p10}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.priv.h6}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p11}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.priv.h7}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p12}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.priv.h8}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p13}</Typography>

                    <Typography variant="h5" gutterBottom>{strings.priv.h9}</Typography>

                    <Typography variant="body2" gutterBottom>{strings.priv.p14}</Typography>
                </GreyPaper>
            </Grid>
        </Grid>
    )

});

export default Privacy;

