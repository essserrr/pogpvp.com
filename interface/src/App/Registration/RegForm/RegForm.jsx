import React from "react"
import LocalizedStrings from "react-localization"
import { ReCaptcha } from 'react-recaptcha-google'
import { Link } from "react-router-dom"

import InputWithError from "../../Components/InputWithError/InputWithError"
import AuthButton from "./AuthButton/AuthButton"
import "./RegForm.scss"

import { getCookie } from "../../../js/getCookie"
import { userLocale } from "../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale)

class LoginForm extends React.PureComponent {
    constructor(props) {
        super(props);
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
            <>
                <div className="col-12 p-0">
                    <InputWithError
                        label={strings.signup.uname}
                        type="text"
                        name="username"
                        autoComplete="off"

                        errorText={this.props.notOk.username}
                        value={this.props.username}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <InputWithError
                        label={strings.signup.email}
                        type="email"
                        name="email"
                        autoComplete="off"

                        errorText={this.props.notOk.email}
                        value={this.props.email}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <InputWithError
                        label={strings.signup.pass}
                        type="password"
                        name="password"
                        autoComplete="off"

                        errorText={this.props.notOk.password}
                        value={this.props.password}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <InputWithError
                        label={strings.signup.cpass}
                        type="password"
                        name="checkPassword"
                        autoComplete="off"

                        errorText={this.props.notOk.checkPassword}
                        value={this.props.checkPassword}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="row m-0 pt-3 justify-content-center ">
                    <div className={"col-auto px-0"}>
                        {navigator.userAgent !== "ReactSnap" && <ReCaptcha
                            ref={(el) => { this.pogCaptcha = el }}
                            hl={getCookie("appLang")}
                            data-theme="dark"
                            render="explicit"
                            sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                            onloadCallback={this.onLoadRecaptcha}
                            verifyCallback={this.props.verifyCallback}
                        />}
                    </div>
                    {this.props.notOk.token !== "" &&
                        <div className="col-12 px-0 text-center reg-form__alert-text">{this.props.notOk.token}</div>}
                </div>
                <div className="col-12 p-0 pt-2 reg-form--text text-center">
                    {strings.propc}
                    <Link title={strings.pol.p} to="/privacy">{strings.pol.p}</Link> {strings.and} <Link title={strings.pol.t} to="/terms">{strings.pol.t}</Link>
                </div>
                <div className="row m-0 pt-3 justify-content-center">
                    <AuthButton
                        title={strings.signup.toreg}
                        onClick={this.onSubmit}
                        loading={this.props.loading}
                        disabled={
                            Object.values(this.props.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)} />

                </div>
                <div className="col-12 p-0 pt-3 reg-form--text text-center">
                    {strings.signup.newlin} <Link title={strings.signin.tolog} to="/login">{strings.signin.tolog}</Link>
                </div>
                <div className="col-12 p-0 pt-2 reg-form--text text-center">
                    {strings.signin.forg} <Link title={strings.signup.toreg} to="/restore">{strings.signin.rest}</Link>
                </div>
            </>
        );
    }
}

export default LoginForm
