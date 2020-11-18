import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import ReCaptchaWithErr from "App/Login/LogForm/ReCaptchaWithErr/ReCaptchaWithErr";
import Input from "App/Components/Input/Input"
import Button from "App/Components/Button/Button";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/Restore/Restore";

let strings = new LocalizedStrings(userLocale)

class RestorePassForm extends React.PureComponent {
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
                        label={strings.restore.email}
                        type="email"
                        name="email"
                        autoComplete="off"

                        errorText={this.props.notOk.email}
                        value={this.props.inputs.email}
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
                        <Button
                            title={strings.restore.tores}
                            onClick={this.onSubmit}
                            loading={this.props.loading}
                            endIcon={<RotateLeftIcon />}
                            disabled={Object.values(this.props.notOk).reduce((sum, val) => sum || (val !== ""), false)}
                        />
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default RestorePassForm;

RestorePassForm.propTypes = {
    verifyCallback: PropTypes.func,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,

    notOk: PropTypes.object,
    inputs: PropTypes.object,
};