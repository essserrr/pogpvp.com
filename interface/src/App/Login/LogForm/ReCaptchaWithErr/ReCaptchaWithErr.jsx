import React from "react";
import { ReCaptcha } from 'react-recaptcha-google';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import { getCookie } from "js/getCookie";

const styles = theme => ({
    errorText: {
        color: theme.palette.error.main,
        textAlign: "center",
    },
    questions: {
        textAlign: "center",
    },
});

class ReCaptchaWithErr extends React.PureComponent {
    render() {
        const { classes, errorText, reference, onloadCallback, verifyCallback } = this.props;

        return (
            <Grid container justify="center">
                <Grid item xs={"auto"}>
                    {navigator.userAgent !== "ReactSnap" &&
                        <ReCaptcha
                            ref={reference}
                            hl={getCookie("appLang")}
                            data-theme="dark"
                            render="explicit"
                            sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                            onloadCallback={onloadCallback}
                            verifyCallback={verifyCallback}
                        />}
                </Grid>
                {errorText !== "" &&
                    <Grid item xs={12} className={classes.errorText}>
                        {errorText}
                    </Grid>}
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ReCaptchaWithErr);

ReCaptchaWithErr.propTypes = {
    onloadCallback: PropTypes.func,
    verifyCallback: PropTypes.func,
    reference: PropTypes.func.isRequired,

    notOk: PropTypes.object,
    errorText: PropTypes.string,
};