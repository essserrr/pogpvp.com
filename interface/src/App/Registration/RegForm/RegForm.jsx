import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import ReCaptchaWithErr from "App/Login/LogForm/ReCaptchaWithErr/ReCaptchaWithErr";
import Input from "App/Components/Input/Input"
import Button from "App/Components/Button/Button";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/Registration/Registration";

let strings = new LocalizedStrings(userLocale)

class RegForm extends React.PureComponent {
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
        return (
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12}>
                    <Input
                        label={strings.signup.uname}
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
                        label={strings.signup.email}
                        type="email"
                        name="email"
                        autoComplete="off"

                        errorText={this.props.notOk.email}
                        value={this.props.inputs.email}
                        onChange={this.props.onChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Input
                        label={strings.signup.pass}
                        type="password"
                        name="password"
                        autoComplete="off"

                        errorText={this.props.notOk.password}
                        value={this.props.inputs.password}
                        onChange={this.props.onChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Input
                        label={strings.signup.cpass}
                        type="password"
                        name="checkPassword"
                        autoComplete="off"

                        errorText={this.props.notOk.checkPassword}
                        value={this.props.inputs.checkPassword}
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
                    <Typography component="div" variant="caption" align="center" >
                        {strings.propc}
                        <Link title={strings.pol.p} to="/privacy">{strings.pol.p}</Link> {strings.and} <Link title={strings.pol.t} to="/terms">{strings.pol.t}</Link>
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Button
                            title={strings.signup.toreg}
                            onClick={this.onSubmit}
                            loading={this.props.loading}
                            endIcon={<PersonAddIcon />}
                            disabled={Object.values(this.props.notOk).reduce((sum, val) => sum || (val !== ""), false)} />
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Typography component="div" variant="caption" align="center" >
                        {strings.signup.newlin} <Link title={strings.signup.tolog} to="/login">{strings.signup.tolog}</Link>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography component="div" variant="caption" align="center" >
                        {strings.signup.forg} <Link title={strings.signup.toreg} to="/restore">{strings.signup.rest}</Link>
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default RegForm;

RegForm.propTypes = {
    verifyCallback: PropTypes.func,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,

    notOk: PropTypes.object,
    inputs: PropTypes.object,
};
