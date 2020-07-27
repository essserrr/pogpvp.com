import React from "react"
import { getCookie } from "../../../../js/getCookie"
import { connect } from 'react-redux'
import LocalizedStrings from "react-localization"

import { userLocale } from "../../../../locale/userLocale"
import { refresh } from "../../../../AppStore/Actions/refresh"
import { setSession } from "../../../../AppStore/Actions/actions"
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
        this.onClick = this.onClick.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    async onClick() {
        this.setState({
            loading: true,
        })

        fetch(((navigator.userAgent !== "ReactSnap") ?
            process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/logout/all", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((resp) => resp.json())
            .then((data) => {
                switch (!data.detail) {
                    case true:
                        this.props.setSession({ token: "", expires: 0, uname: "" })
                        return
                    case false:
                        this.setState({
                            error: data.detail,
                            loading: false,
                        })
                }
            })
            .catch((e) => {
                console.log(e)
                this.setState({
                    error: e,
                    loading: false,
                })
            })

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
        if (!str || str === "") {
            return (strings.err.ness)
        }
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

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.!$%^&*+=]*)$")
    }


    onSubmit(resetCaptcha) {
        console.log(this.state.form)
        /*if (!this.validate()) {
            return
        }
        this.setState({ loading: true, error: "", })
        this.register(resetCaptcha)
        this.setState({ loading: false, error: "", })*/
    }


    validate() {


        /* let notUname = this.check(this.state.form.username, "username")
         let notPass = this.check(this.state.form.password, "password")
         let notChPass = this.check(this.state.form.checkPassword, "checkPassword")
         let notEmail = this.check(this.state.form.email, "email")
         let notToken = !this.state.form.token ? strings.err.token : ""
 
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
 
     async register(resetCaptcha) {
         let reason = ""
         this.setState({
             loading: true,
             error: "",
         })
 
         const response = await fetch(((navigator.userAgent !== "ReactSnap") ?
             process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/reg", {
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
             resetCaptcha()
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
             resetCaptcha()
             this.setState({
                 loading: false,
                 error: data.detail,
             })
             return
         }
 
         //otherwise set token
         switch (!data.Token) {
             case true:
                 this.props.history.push(((navigator.userAgent === "ReactSnap") ? "/" : "/login"))
                 break
             default:
                 this.props.setSession({ token: data.Token, expires: data.Expires, uname: data.Username })
                 this.props.history.push(((navigator.userAgent === "ReactSnap") ? "/" : "/profile/info"))
         }*/
    }







    render() {
        return (
            <div className="row mx-0 p-3 text-center justify-content-center">
                <div className="col-12 col-md-10 col-lg-9 px-0 chpass__title sessions--bor">
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
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        setSession: (value) => dispatch(setSession(value)),

    }
}

export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(ChangePassword)
