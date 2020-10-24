import React from "react"
import LocalizedStrings from "react-localization"
import Loader from "../../PvpRating/Loader"
import { Link } from "react-router-dom"

import Alert from '@material-ui/lab/Alert';

import SiteHelm from "../../SiteHelm/SiteHelm"
import "./Confirmation.scss"

import { getCookie } from "../../../js/getCookie"
import { userLocale } from "../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);

class Confirmation extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            loading: true,
            error: false,
            ok: false,
        }

    }

    async componentDidMount() {

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST :
                process.env.REACT_APP_PRERENDER) + "/api/auth/confirm/" + this.props.match.params.type, {
                method: "GET",
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.setState({ ok: true, loading: false, })
        } catch (e) {
            this.setState({ loading: false, error: true, })
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
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 mt-4 confirmation align-self-center">
                        {this.state.loading && <Loader
                            color="black"
                            weight="500"
                            locale={strings.loading}
                            loading={this.state.loading}

                            class="row justify-content-center text-white"
                            innerClass="col-auto mt-1  mt-md-2"
                        />}
                        <div className="row mx-0 justify-content-center">
                            {this.state.ok &&
                                <>
                                    <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                                        <Alert variant="filled" severity="error">{strings.restore.confok}</Alert >
                                    </div>
                                    <div className="col-12 col-md-10 col-lg-9 px-0 pt-3 confirmation__text text-center">
                                        <Link title={strings.signin.tolog} to="/login">{strings.signin.tolog}</Link>
                                    </div>
                                </>}
                            {this.state.error &&
                                <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                                    <Alert variant="filled" severity="error">{strings.restore.confnotok}</Alert >
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Confirmation

