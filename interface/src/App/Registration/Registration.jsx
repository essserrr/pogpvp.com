import React from "react"
import LocalizedStrings from "react-localization";
import { loadReCaptcha } from 'react-recaptcha-google'

import RegForm from "./RegForm/RegForm"
import Errors from "../PvP/components/Errors/Errors"
import "./Registration.scss"

import { getCookie } from "../../js/indexFunctions"
import { userLocale } from "../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);

class Login extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            inputs: { username: "", email: "", password: "", checkPassword: "", token: "" },
            notOk: { username: "", email: "", password: "", checkPassword: "", token: "" },
            loading: false,
            error: "",
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.verifyCallback = this.verifyCallback.bind(this)

    }

    componentDidMount() {
        loadReCaptcha();
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
    }

    verifyCallback(recaptchaToken) {
        console.log(process.env)
        switch (!recaptchaToken) {
            case true:
                this.setState({
                    inputs: {
                        ...this.state.inputs,
                        token: recaptchaToken,
                    },
                    notOk: {
                        ...this.state.notOk,
                        token: strings.err.token,
                    }
                })
                break
            default:
                this.setState({
                    inputs: {
                        ...this.state.inputs,
                        token: recaptchaToken,
                    },
                    notOk: {
                        ...this.state.notOk,
                        token: ""
                    }
                })
        }

    }

    onChange(event) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [event.target.name]: event.target.value,
            },
            notOk: {
                ...this.state.notOk,
                [event.target.name]: this.check(event.target.value, event.target.name)
            }
        })
    }

    check(str, type) {
        if (str === "") {
            return (strings.err.ness)
        }
        switch (type) {
            case "username":
                return this.checkUname(str)
            case "password":
                return this.checkPass(str)
            case "checkPassword":
                return this.checkPass(str, true)
            default:
                return this.checkEmail(str)
        }
    }

    checkPass(str, isControl) {
        if (str.length < 6) {
            return strings.signup.pass + strings.err.longer.l2 + "6" + strings.err.lesseq.c
        }
        if (str.length > 20) {
            return strings.signup.pass + strings.err.lesseq.l2 + "20" + strings.err.lesseq.c
        }
        if (this.checkRegexp(str)) {
            return strings.signup.pass + strings.err.symb
        }
        if (isControl && str !== this.state.inputs.password) {
            return strings.err.match
        }
        return ""
    }

    checkUname(str) {
        if (str.length < 6) {
            return strings.signup.uname + strings.err.longer.l1 + "6" + strings.err.lesseq.c
        }
        if (str.length > 16) {
            return strings.signup.uname + strings.err.lesseq.l1 + "16" + strings.err.lesseq.c
        }
        if (this.checkRegexp(str)) {
            return strings.signup.uname + strings.err.symb
        }
        return ""
    }

    checkEmail(str) {
        if (str.length > 320) {
            return strings.signup.email + strings.err.lesseq.l2 + "320" + strings.err.lesseq.c
        }
        if (this.checkEmailRegexp(str)) {
            return strings.err.emailf
        }
        return ""
    }

    checkEmailRegexp(email) {
        // eslint-disable-next-line
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return !expression.test(String(email).toLowerCase())
    }

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.!$%^&*+=]*)$")
    }

    onSubmit() {
        if (!this.validate()) {
            return
        }
        this.setState({ loading: true, error: "", })
        this.login()

    }


    validate() {
        let notUname = this.check(this.state.inputs.username, "username")
        let notPass = this.check(this.state.inputs.password, "password")
        let notChPass = this.check(this.state.inputs.checkPassword, "checkPassword")
        let notEmail = this.check(this.state.inputs.email, "email")
        let notToken = !this.state.inputs.token ? strings.err.token : ""

        switch (notUname !== "" || notPass !== "" || notChPass !== "" || notEmail !== "" || notToken !== "") {
            case true:
                this.setState({
                    notOk: { username: notUname, password: notPass, checkPassword: notChPass, email: notEmail, token: notToken },
                })
                return false
            default:
                return true
        }
    }



    login() {


    }

    render() {
        console.log(this.state.inputs.token)
        return (
            <div className="container-fluid mb-5">
                <div className="row m-0 justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 mt-4 registration align-self-center">
                        <div className="col-12 p-0 registration__text text-center">
                            {strings.signup.reg}
                        </div>
                        {this.state.error && <div className="col-12 p-0">
                            <Errors value={this.state.error} />
                        </div>}
                        <div className="col-12 p-0">
                            <RegForm {...this.state.inputs} loading={this.state.loading} notOk={this.state.notOk}
                                onSubmit={this.onSubmit} onChange={this.onChange} verifyCallback={this.verifyCallback} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
