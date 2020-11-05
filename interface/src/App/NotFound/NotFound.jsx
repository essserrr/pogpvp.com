import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import SiteHelm from "App/SiteHelm/SiteHelm";
import NotFoundIcon from "./NotFoundIcon/NotFoundIcon";
import { locale } from "locale/NotFound/NotFound";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale)

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.notFound = React.createRef();

        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
        };
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };

    focusDiv() {
        this.notFound.current.focus();
    };


    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/"
                    header={strings.notfound}
                    descr={strings.notfound}
                />

                <Grid item xs={12} md={7} lg={5}>
                    <GreyPaper elevation={4} enablePadding>
                        <Grid container justify="center" alignItems="center">

                            <Grid item xs={12} ref={this.notFound}>
                                <NotFoundIcon />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" align="center">
                                    {strings.notfound}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} ref={this.notFound}>
                                <Grid container justify="center">

                                    <Typography variant="h6" align="center">
                                        <Link title={strings.buttons.home} to={"/"} style={{ display: "flex", alignItems: "center" }}>
                                            <DoubleArrowIcon style={{ transform: "rotate(180deg)" }} />
                                            {strings.return}
                                        </Link>
                                    </Typography>

                                </Grid>
                            </Grid>

                        </Grid>
                    </GreyPaper>
                </Grid>
            </Grid>
        );
    }
}

export default NotFound;

