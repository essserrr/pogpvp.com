import React from "react"
import LocalizedStrings from "react-localization";

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
            inputs: {},
            notOk: {},
            loading: false,
            error: "",
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
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
            return true
        }
        switch (type) {
            case "uname":
                return this.checkUname(str)
            case "password":
                return this.checkPass(str)
            default:
                return this.checkEmail(str)
        }
    }

    checkPass(str) {
        let len = str.length
        if (len < 6) {
            return "Password must be longer than 6 characters"
        }
        if (len > 20) {
            return "Password must be less than or equal 20 characters"
        }
        if (!this.checkRegexp(str)) {
            return "Password contains prohibited symbols"
        }
        return ""
    }

    checkUname(str) {
        let len = str.length
        if (len < 6) {
            return "Username must be longer than 6 characters"
        }
        if (len > 16) {
            return "Username must be less than or equal 16 characters"
        }
        if (!this.checkRegexp(str)) {
            return "Username contains prohibited symbols"
        }
        return ""
    }

    checkEmail(str) {
        let len = str.length
        if (len < 5) {
            return "Email must be longer than 5 characters"
        }
        if (len > 320) {
            return "Email must be less than or equal 320 characters"
        }
        if (!this.checkRegexp(str)) {
            return "Email contains prohibited symbols"
        }
        return ""
    }

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.!$%^&*+=]*)$")
    }

    onSubmit(event) {
        event.preventDefault()

        if (!this.validate()) {
            return
        }

        this.setState({ loading: true, error: "", })
        this.login()

    }


    validate() {
        let notLog = this.check(this.state.inputs.login, "login")
        let notSublog = this.check(this.state.inputs.sublogin, "sublogin")
        let notPass = this.check(this.state.inputs.password, "password")

        switch (notLog || notSublog || notPass) {
            case true:
                this.setState({
                    notOk: { login: notLog, sublogin: notSublog, password: notPass },
                })
                return false
            default:
                return true
        }
    }

    login() {

    }

    render() {
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
                                onSubmit={this.onSubmit} onChange={this.onChange} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
