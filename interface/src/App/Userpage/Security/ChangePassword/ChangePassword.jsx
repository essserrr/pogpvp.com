import React from "react";
import { getCookie } from "../../../../js/getCookie";
import LocalizedStrings from "react-localization";
import { connect } from 'react-redux';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';

import { refresh } from "../../../../AppStore/Actions/refresh";
import { userLocale } from "../../../../locale/UserPage/Security/Security";

import PassChangeForm from "./PassChangeForm/PassChangeForm";

let strings = new LocalizedStrings(userLocale);

class ChangePassword extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            loading: false,
            form: {
                password: {
                    value: "",
                    error: "",
                },
                checkPassword: {
                    value: "",
                    error: "",
                },
                newPassword: {
                    value: "",
                    error: "",
                },
            },
            error: "",
        }
    }

    onChange = (event) => {
        this.setState({
            form: {
                ...this.state.form,
                [event.target.name]: {
                    ...this.state.form[event.target.name],
                    value: event.target.value,
                },
            },
        })
    }

    onBlur = (event) => {
        this.setState({
            form: {
                ...this.state.form,
                [event.target.name]: {
                    ...this.state.form[event.target.name],
                    error: this.check(event.target.value, event.target.name, this.state.form.newPassword.value),
                },
            },
        })
    }

    onBlurNewPassword = (event) => {
        const checkPassErr = this.state.form.checkPassword.value !== "" ? this.check(this.state.form.checkPassword.value, "checkPassword", event.target.value) : ""
        this.setState({
            form: {
                ...this.state.form,
                [event.target.name]: {
                    ...this.state.form[event.target.name],
                    error: this.check(event.target.value, event.target.name),
                },
                checkPassword: {
                    ...this.state.form.checkPassword,
                    error: checkPassErr,
                }
            },
        })
    }

    check(str, type, newPass) {
        if (!str || str.replace(" ", "") === "") { return (strings.err.ness) }
        switch (type) {
            case "checkPassword":
                return this.checkPass(str, true, newPass)
            default:
                return this.checkPass(str)
        }
    }

    checkPass(str, isCheck, newPass) {
        if (str.length < 6) return strings.security.pass + strings.err.longer.l2 + "6" + strings.err.lesseq.c;
        if (str.length > 20) return strings.security.pass + strings.err.lesseq.l2 + "20" + strings.err.lesseq.c;
        if (this.checkRegexp(str)) return strings.security.pass + strings.err.symb;
        if (isCheck && newPass && str !== newPass) return strings.err.match;
        return ""
    }

    checkRegexp = str => !str.match("^([A-Za-z0-9@_\\-\\.!$%^&*+=]*)$")


    onSubmit = () => {
        if (!this.validate()) {
            return
        }
        this.chPass()
    }


    validate() {
        let checkedForm = {}
        for (const [fieldKey, fieldValue] of Object.entries(this.state.form)) {
            checkedForm[fieldKey] = { value: fieldValue.value, error: this.check(fieldValue.value, fieldKey), }
        }

        this.setState({
            form: checkedForm,
        })

        return Object.values(this.state.form).reduce((sum, value) => sum && value.error === "", true)
    }

    async chPass() {
        this.setState({
            loading: true,
            error: "",
            ok: false,
        })
        await this.props.refresh()
        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/chpass", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                    password: this.state.form.password.value,
                    newPassword: this.state.form.newPassword.value,
                    checkPassword: this.state.form.checkPassword.value,
                })
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.setState({
                loading: false,
                ok: true,
                form: {
                    password: { value: "", error: "", },
                    checkPassword: { value: "", error: "", },
                    newPassword: { value: "", error: "", },
                },
            })
            await new Promise(res => setTimeout(res, 4000));
            this.setState({ ok: false })

        } catch (e) {
            this.setState({
                loading: false,
                error: String(e),
            })
        }
    }

    render() {
        return (
            <Grid container justify="center">
                <Grid item xs={12}>
                    <PassChangeForm
                        loading={this.state.loading}
                        form={this.state.form}
                        onChange={this.onChange}
                        onSubmit={this.onSubmit}
                        onBlur={this.onBlur}
                        onBlurNewPassword={this.onBlurNewPassword}
                    />
                </ Grid>
                {this.state.error !== "" &&
                    <Box mt={2}>
                        <Alert variant="filled" severity="error">{this.state.error}</Alert >
                    </Box>}
                <Snackbar open={this.state.ok} onClose={() => { this.setState({ ok: false }) }}>
                    <Alert variant="filled" severity="success">{strings.security.ok}</Alert >
                </Snackbar>
            </ Grid>
        )
    }
};

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
    }
};

export default connect(
    null, mapDispatchToProps
)(ChangePassword);