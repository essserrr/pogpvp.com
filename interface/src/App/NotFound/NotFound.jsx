import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import SiteHelm from "App/SiteHelm/SiteHelm";
import NotFoundIcon from "./NotFoundIcon/NotFoundIcon";
import { locale } from "locale/NotFound/NotFound";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const styles = theme => ({
    link: {
        textDecoration: "none",
        color: theme.palette.text.primary,
        "&:hover": {
            color: theme.palette.text.link,
            textDecoration: "underline",
            cursor: "pointer",
        },
    },

    icon: {
        width: "300px !important",
        height: "271px !important",
    },
});

class NotFound extends React.Component {
    constructor() {
        super();
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
        const { classes } = this.props;

        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/"
                    header={strings.notfound}
                    descr={strings.notfound}
                />

                <Grid item xs={12} md={7} lg={5}>
                    <GreyPaper elevation={4} enablePadding>
                        <Grid container justify="center" alignItems="center" spacing={2}>

                            <Grid item xs={12} ref={this.notFound}>
                                <NotFoundIcon />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                    {strings.notfound}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} ref={this.notFound}>

                                <Link title={strings.buttons.home} to={"/"} className={classes.link}>
                                    <Typography variant="h6">

                                        <Box display="flex" alignItems="center" justifyContent="center">
                                            <DoubleArrowIcon style={{ transform: "rotate(180deg)" }} />
                                            {strings.return}
                                        </Box>

                                    </Typography>
                                </Link>

                            </Grid>

                        </Grid>
                    </GreyPaper>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(NotFound);
