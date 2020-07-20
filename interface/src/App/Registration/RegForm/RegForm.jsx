import React from "react"
import LocalizedStrings from "react-localization";
import { ReCaptcha } from 'react-recaptcha-google'

import AuthInput from "./AuthInput/AuthInput"
import AuthButton from "./AuthButton/AuthButton"
import "./RegForm.scss"

import { getCookie } from "../../../js/indexFunctions"
import { userLocale } from "../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);

class LoginForm extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this)
    }

    onLoadRecaptcha() {
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
    }


    render() {
        return (
            <>
                <div className="col-12 p-0">
                    <AuthInput
                        labelLeft={strings.signup.uname}
                        place={strings.signup.uname}
                        type="text"
                        name="username"
                        aCompleteOff={true}

                        notOk={this.props.notOk.username}
                        value={this.props.username}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <AuthInput
                        labelLeft={strings.signup.email}
                        place={strings.signup.email}
                        type="email"
                        name="email"
                        aCompleteOff={true}

                        notOk={this.props.notOk.email}
                        value={this.props.email}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <AuthInput
                        labelLeft={strings.signup.pass}
                        place={strings.signup.pass}
                        type="password"
                        name="password"
                        aCompleteOff={true}

                        notOk={this.props.notOk.password}
                        value={this.props.password}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <AuthInput
                        labelLeft={strings.signup.cpass}
                        place={strings.signup.cpass}
                        type="password"
                        name="checkPassword"
                        aCompleteOff={true}

                        notOk={this.props.notOk.checkPassword}
                        value={this.props.checkPassword}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="row m-0 pt-3 justify-content-center ">
                    <div className={"col-auto px-0"}>
                        <ReCaptcha
                            ref={(el) => { this.captchaDemo = el }}
                            hl={getCookie("appLang")}
                            data-theme="dark"
                            render="explicit"
                            sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                            onloadCallback={this.onLoadRecaptcha}
                            verifyCallback={this.props.verifyCallback}
                        />
                    </div>
                    {this.props.notOk.token !== "" &&
                        <div className="col-12 px-0 text-center reg-form__alert-text">{this.props.notOk.token}</div>}
                </div>
                <div className="row m-0 pt-3 justify-content-center">
                    <AuthButton
                        title={strings.signup.toreg}
                        onClick={this.props.onSubmit}
                        loading={this.props.loading}
                        disabled={
                            Object.values(this.props.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)} />

                </div>
            </>
        );
    }
}

export default LoginForm
