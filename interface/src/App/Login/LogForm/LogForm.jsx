import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import ReCaptchaWithErr from "./ReCaptchaWithErr/ReCaptchaWithErr"
import Input from "App/Components/Input/Input";
import AuthButton from "App/Registration/RegForm//AuthButton/AuthButton";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/Login/Login";

let strings = new LocalizedStrings(userLocale);

class LoginForm extends React.PureComponent {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onLoadRecaptcha() {
        console.log(this.pogCaptcha)
        if (this.pogCaptcha) {
            this.pogCaptcha.reset();
        }
    }

    onSubmit() {
        this.props.onSubmit(this.onLoadRecaptcha)
    }

    render() {
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
                    <ReCaptchaWithErr
                        reference={(el) => { this.pogCaptcha = el }}
                        errorText={this.props.notOk.token}
                        onloadCallback={this.onLoadRecaptcha}
                        verifyCallback={this.props.verifyCallback}
                    />
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
                <Grid item xs={12}>
                    <Typography component="div" variant="caption" align="center" >
                        {strings.signin.newsup} <Link title={strings.signin.toreg} to="/registration">{strings.signin.toreg}</Link>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography component="div" variant="caption" align="center" >
                        {strings.signin.forg} <Link title={strings.signin.rest} to="/restore">{strings.signin.rest}</Link>
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default LoginForm;

LoginForm.propTypes = {
    verifyCallback: PropTypes.func,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,

    notOk: PropTypes.object,
    inputs: PropTypes.object,
};