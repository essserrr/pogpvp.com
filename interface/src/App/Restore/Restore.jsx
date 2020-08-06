import React from "react"
import LocalizedStrings from "react-localization";
import { loadReCaptcha } from 'react-recaptcha-google'
import { connect } from 'react-redux'

import { setSession } from "../../AppStore/Actions/actions"

import RestorePassForm from "./RestorePassForm/RestorePassForm"
import Errors from "../PvP/components/Errors/Errors"
import SiteHelm from "../SiteHelm/SiteHelm"
import "./Restore.scss"

import { getCookie } from "../../js/getCookie"
import { userLocale } from "../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);

class Restore extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            inputs: { email: "", token: "" },
            notOk: { email: "", token: "" },
            loading: false,
            error: "",
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.verifyCallback = this.verifyCallback.bind(this)
    }

    componentDidMount() {
        loadReCaptcha();
    }

    verifyCallback(recaptchaToken) {
        switch (!recaptchaToken) {
            case true:
                this.setState({
                    inputs: { ...this.state.inputs, token: recaptchaToken, },
                    notOk: { ...this.state.notOk, token: strings.err.token, },
                })
                break
            default:
                this.setState({
                    inputs: { ...this.state.inputs, token: recaptchaToken, },
                    notOk: { ...this.state.notOk, token: "" },
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
                [event.target.name]: this.check(event.target.value)
            }
        })
    }

    check(str) {
        if (!str || str === "") {
            return (strings.err.ness)
        }
        return this.checkEmail(str)
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
        const expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !expression.test(String(email).toLowerCase())
    }

    onSubmit(resetCaptcha) {
        if (!this.validate()) {
            return
        }
        this.restorePass(resetCaptcha)
    }


    validate() {
        let notEmail = this.check(this.state.inputs.email, "email")
        let notToken = !this.state.inputs.token ? strings.err.token : ""

        switch (notEmail !== "" || notToken !== "") {
            case true:
                this.setState({
                    notOk: { email: notEmail, token: notToken },
                })
                return false
            default:
                return true
        }
    }

    async restorePass(resetCaptcha) {
        this.setState({
            loading: true,
            error: "",
            ok: false,
        })

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/restore", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(this.state.inputs)
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            resetCaptcha()
            this.setState({
                ok: true,
                loading: false,
                inputs: { email: "", token: "" },
            })
        } catch (e) {
            resetCaptcha()
            this.setState({
                loading: false,
                error: String(e),
            })
        }
    }

    render() {
        return (
            <div className="container-fluid mb-5">
                <SiteHelm
                    url="https://pogpvp.com/restore"
                    header={strings.pageheaders.reg}
                    descr={strings.pagedescriptions.reg}
                    noindex={true}
                />
                <div className="row m-0 justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 mt-4 restore align-self-center">
                        <div className="col-12 p-0 restore__text text-center">
                            {strings.restore.res}
                        </div>
                        {this.state.error !== "" && <div className="col-12 p-0">
                            <Errors value={this.state.error} class="alert alert-danger m-2 p-2" />
                        </div>}
                        <div className="col-12 p-0">
                            <RestorePassForm {...this.state.inputs} loading={this.state.loading} notOk={this.state.notOk}
                                onSubmit={this.onSubmit} onChange={this.onChange} verifyCallback={this.verifyCallback} />
                        </div>
                        {this.state.ok &&
                            <div className="row mx-0 justify-content-center">
                                <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                                    <Errors
                                        class={"alert alert-success p-2"}
                                        value={strings.restore.ok} />
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        setSession: value => dispatch(setSession(value)),
    }
}


export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(Restore)

