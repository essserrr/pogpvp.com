import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import SiteHelm from "App/SiteHelm/SiteHelm"

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/Restore/Restore";

let strings = new LocalizedStrings(userLocale);

class Confirmation extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            loading: true,
            error: false,
            ok: false,
        }

    }

    async componentDidMount() {
        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST :
                process.env.REACT_APP_PRERENDER) + "/api/auth/confirm/" + this.props.match.params.type, {
                method: "GET",
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.setState({ ok: true, loading: false, })
        } catch (e) {
            this.setState({ loading: false, error: true, })
        }
    }



    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/restore"
                    header={strings.pageheaders.res}
                    descr={strings.pagedescriptions.res}
                    noindex={true}
                />

                <Grid item xs={10} sm={8} md={6} lg={4}>
                    <GreyPaper elevation={4} enablePadding={true} >
                        <Grid container justify="center" spacing={2}>
                            {this.state.loading &&
                                <Grid item xs={12}>
                                    <LinearProgress color="secondary" />
                                </ Grid>}
                            {this.state.ok &&
                                <>
                                    <Grid item xs={12}>
                                        <Alert variant="filled" severity="success">{strings.restore.confok}</Alert >
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" align="center">
                                            <Link title={strings.signin.tolog} to="/login">{strings.signin.tolog}</Link>
                                        </Typography>
                                    </Grid>
                                </>}
                            {this.state.error &&
                                <Grid item xs={12}>
                                    <Alert variant="filled" severity="error">{strings.restore.confnotok}</Alert >
                                </Grid>}
                        </Grid>
                    </GreyPaper>
                </Grid>
            </Grid>
        )
    }
}


export default Confirmation

