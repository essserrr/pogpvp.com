import React from "react";
import LocalizedStrings from "react-localization";
import { ReCaptcha } from 'react-recaptcha-google';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withStyles } from "@material-ui/core/styles";

import Input from "App/Components/Input/Input";
import AuthButton from "App/Registration/RegForm//AuthButton/AuthButton";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/Login/Login";

let strings = new LocalizedStrings(userLocale);

const styles = theme => ({
    errorText: {
        color: theme.palette.error.main,
        textAlign: "center",
    },
    questions: {
        textAlign: "center",
    },
});

class LoginForm extends React.PureComponent {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onLoadRecaptcha() {
        if (this.pogCaptcha) {
            this.pogCaptcha.reset();
        }
    }

    onSubmit() {
        this.props.onSubmit(this.onLoadRecaptcha)
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12}>
                    <Input
                        label={strings.signin.uname}
                        type="text"
                        name="username"
                        autoComplete="off"

                        errorText={this.props.notOk.username}
                        value={this.props.inputs.username}
                        onChange={this.props.onChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Input
                        label={strings.signin.pass}
                        type="password"
                        name="password"
                        autoComplete="off"
                        errorText={this.props.notOk.password}
                        value={this.props.inputs.password}
                        onChange={this.props.onChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item xs={"auto"}>
                            {navigator.userAgent !== "ReactSnap" && <ReCaptcha
                                ref={(el) => { this.pogCaptcha = el }}
                                hl={getCookie("appLang")}
                                data-theme="dark"
                                render="explicit"
                                sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                                onloadCallback={this.onLoadRecaptcha}
                                verifyCallback={this.props.verifyCallback}
                            />}
                        </Grid>
                        {this.props.notOk.token !== "" &&
                            <Grid item xs={12} className={classes.errorText}>
                                {this.props.notOk.token}
                            </Grid>}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <AuthButton
                            title={strings.signin.tolog}
                            onClick={this.onSubmit}
                            loading={this.props.loading}
                            disabled={Object.values(this.props.notOk).reduce((sum, val) => sum || (val !== ""), false)}
                            endIcon={<ExitToAppIcon />}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.questions}>
                    {strings.signin.newsup} <Link title={strings.signin.toreg} to="/registration">{strings.signin.toreg}</Link>
                </Grid>
                <Grid item xs={12} className={classes.questions}>
                    {strings.signin.forg} <Link title={strings.signin.rest} to="/restore">{strings.signin.rest}</Link>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(LoginForm);

LoginForm.propTypes = {
    verifyCallback: PropTypes.func,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,

    notOk: PropTypes.object,
    inputs: PropTypes.object,
};