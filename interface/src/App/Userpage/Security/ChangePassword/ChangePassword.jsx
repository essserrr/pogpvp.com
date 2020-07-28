import React from "react"
import { getCookie } from "../../../../js/getCookie"
import LocalizedStrings from "react-localization"

import { userLocale } from "../../../../locale/userLocale"
import Errors from "../../../PvP/components/Errors/Errors"

import PassChangeForm from "./PassChangeForm/PassChangeForm"

import "./ChangePassword.scss"

let strings = new LocalizedStrings(userLocale);

class ChangePassword extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            loading: false,
            form: {
                password: "",
                checkPassword: "",
                newPassword: "",
            },
            notOk: {
                password: "",
                checkPassword: "",
                newPassword: "",
            },
            error: "",
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(event) {
        this.setState({
            form: {
                ...this.state.form,
                [event.target.name]: event.target.value,
            },
            notOk: {
                ...this.state.notOk,
                [event.target.name]: this.check(event.target.value, event.target.name)
            }
        })
    }

    check(str, type) {
        if (!str || str === "") { return (strings.err.ness) }
        switch (type) {
            case "checkPassword":
                return this.checkPass(str, true)
            default:
                return this.checkPass(str)
        }
    }

    checkPass(str, isConf) {
        if (str.length < 6) {
            return strings.signup.pass + strings.err.longer.l2 + "6" + strings.err.lesseq.c
        }
        if (str.length > 20) {
            return strings.signup.pass + strings.err.lesseq.l2 + "20" + strings.err.lesseq.c
        }
        if (this.checkRegexp(str)) {
            return strings.signup.pass + strings.err.symb
        }
        if (isConf && str !== this.state.form.password) {
            return strings.err.match
        }
        return ""
    }

    checkRegexp = str => !str.match("^([A-Za-z0-9@_\\-\\.!$%^&*+=]*)$")


    onSubmit() {
        console.log(this.state.form)
        if (!this.validate()) {
            return
        }
        this.setState({ loading: true, error: "", })
        this.chPass()
        this.setState({ loading: false, error: "", })
    }


    validate() {
        let notPass = this.check(this.state.form.password, "password")
        let notChPass = this.check(this.state.form.checkPassword, "checkPassword")
        let notNewPass = this.check(this.state.form.newPassword, "newPassword")

        switch (notPass !== "" || notChPass !== "" || notNewPass !== "") {
            case true:
                this.setState({
                    notOk: { password: notPass, checkPassword: notChPass, newPassword: notNewPass },
                })
                return false
            default:
                return true
        }
    }

    async chPass() {
        let reason = ""
        this.setState({
            loading: true,
            error: "",
            ok: false,
        })

        const response = await fetch(((navigator.userAgent !== "ReactSnap") ?
            process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/chpass", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.form)
        }).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {
            this.setState({
                loading: false,
                error: String(reason),
            });
            return
        }
        //parse answer
        const data = await response.json();
        //if response is not ok, handle error
        if (!response.ok) {
            this.setState({
                loading: false,
                error: data.detail,
            })
            return
        }

        this.setState({
            ok: true,
            form: {
                password: "",
                checkPassword: "",
                newPassword: "",
            },
        })
        await new Promise(res => setTimeout(res, 2500));
        this.setState({ ok: false })
    }







    render() {
        return (
            <div className="row mx-0 p-3 text-center justify-content-center">
                <div className="col-12 col-md-10 col-lg-9 px-0 chpass__title">
                    {strings.security.chpass}
                </div>

                {this.state.error !== "" &&
                    <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                        <Errors class="alert alert-danger p-2" value={this.state.error} />
                    </div>}
                {this.state.error === "" &&
                    <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                        <PassChangeForm
                            {...this.state.form}
                            notOk={this.state.notOk}
                            onChange={this.onChange}
                            onSubmit={this.onSubmit}
                        />
                    </div>}
                {this.state.ok &&
                    <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                        <Errors
                            class={"alert alert-success p-2"}
                            value={strings.security.ok} />
                    </div>}
            </div>
        )
    }
}


export default ChangePassword
