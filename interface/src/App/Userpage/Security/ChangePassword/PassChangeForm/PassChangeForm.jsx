import React from "react"
import LocalizedStrings from "react-localization"

import AuthInput from "../../../../Registration/RegForm/AuthInput/AuthInput"
import AuthButton from "../../../../Registration/RegForm/AuthButton/AuthButton"
import "./PassChangeForm.scss"

import { getCookie } from "../../../../../js/getCookie"
import { userLocale } from "../../../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale)

class PassChangeForm extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <>
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
                <div className="col-12 p-0 pt-2">
                    <AuthInput
                        labelLeft={strings.security.npass}
                        place={strings.security.npass}
                        type="password"
                        name="newPassword"
                        aCompleteOff={true}

                        notOk={this.props.notOk.newPassword}
                        value={this.props.newPassword}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="row m-0 pt-3 justify-content-center">
                    <AuthButton
                        loading={this.props.loading}
                        title={strings.security.chpass}
                        onClick={this.props.onSubmit}
                        disabled={
                            Object.values(this.props.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)}
                    />
                </div>
            </>
        );
    }
}

export default PassChangeForm
