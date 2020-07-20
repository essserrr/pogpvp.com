import React from "react"
import LocalizedStrings from "react-localization";

import AuthInput from "./AuthInput/AuthInput"
import AuthButton from "./AuthButton/AuthButton"
import "./RegForm.css"

import { getCookie } from "../../../js/indexFunctions"
import { userLocale } from "../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);

const LoginForm = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <div className="col-12 p-0">
                <AuthInput
                    labelLeft={strings.signup.uname}
                    place={strings.signup.uname}
                    type="text"
                    name="username"
                    aCompleteOff={true}

                    notOk={props.notOk.username}
                    value={props.username}
                    onChange={props.onChange}
                />
            </div>
            <div className="col-12 p-0 pt-2">
                <AuthInput
                    labelLeft={strings.signup.email}
                    place={strings.signup.email}
                    type="email"
                    name="email"
                    aCompleteOff={true}

                    notOk={props.notOk.email}
                    value={props.email}
                    onChange={props.onChange}
                />
            </div>
            <div className="col-12 p-0 pt-2">
                <AuthInput
                    labelLeft={strings.signup.pass}
                    place={strings.signup.pass}
                    type="password"
                    name="password"
                    aCompleteOff={true}

                    notOk={props.notOk.password}
                    value={props.password}
                    onChange={props.onChange}
                />
            </div>
            <div className="col-12 p-0 pt-2">
                <AuthInput
                    labelLeft={strings.signup.cpass}
                    place={strings.signup.cpass}
                    type="password"
                    name="checkPassword"
                    aCompleteOff={true}

                    notOk={props.notOk.checkPassword}
                    value={props.checkPassword}
                    onChange={props.onChange}
                />
            </div>
            <div className="col-12 p-0 pt-3">
                <AuthButton
                    title={strings.signup.toreg}
                    onClick={props.onSubmit}
                    loading={props.loading}
                    disabled={
                        Object.values(props.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)} />
            </div>
        </>
    )
})

export default LoginForm
