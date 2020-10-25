import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import InputWithError from "../../../../Components/InputWithError/InputWithError";
import AuthButton from "../../../../Registration/RegForm/AuthButton/AuthButton";

import { getCookie } from "../../../../../js/getCookie";
import { userLocale } from "../../../../../locale/UserPage/Security/Security";

let strings = new LocalizedStrings(userLocale)

const PassChangeForm = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container justify="center" spacing={2}>
            <Grid item xs={12} md={6}>
                <InputWithError
                    label={strings.security.oldpass}
                    type="password"
                    name="password"

                    errorText={props.form.password.error}
                    value={props.form.password.value}
                    onChange={props.onChange}
                    onBlur={props.onBlur}

                    autoComplete="off"
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <InputWithError
                    label={strings.security.npass}
                    type="password"
                    name="newPassword"

                    errorText={props.form.newPassword.error}
                    value={props.form.newPassword.value}
                    onChange={props.onChange}
                    onBlur={props.onBlurNewPassword}

                    autoComplete="off"

                />
            </Grid>
            <Grid item xs={12} md={6}>
                <InputWithError
                    label={strings.security.confnpass}
                    type="password"
                    name="checkPassword"

                    errorText={props.form.checkPassword.error}
                    value={props.form.checkPassword.value}
                    onChange={props.onChange}
                    onBlur={props.onBlur}

                    autoComplete="off"
                />
            </Grid>
            <Grid item container justify="center" xs={12}>
                <Box mt={1}>
                    <AuthButton
                        loading={props.loading}
                        title={strings.security.chpass}
                        onClick={props.onSubmit}
                        disabled={Object.values(props.form).reduce((sum, value) => sum || value.error !== "", false)}
                    />
                </Box>
            </Grid>
        </Grid>
    )
});

export default PassChangeForm;

PassChangeForm.propTypes = {
    form: PropTypes.object,
    props: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onBlurNewPassword: PropTypes.func,
    onBlur: PropTypes.func,
};