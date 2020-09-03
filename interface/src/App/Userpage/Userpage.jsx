import React, { Suspense, lazy } from "react"
import LocalizedStrings from "react-localization"
import { connect } from 'react-redux'
import { Switch, Route } from "react-router-dom"
import Loader from "../PvpRating/Loader"

import { setSession } from "../../AppStore/Actions/actions"
import UpageButtons from "./ProfileButtons/ProfileButtons"
import SiteHelm from "../SiteHelm/SiteHelm"

import "./Userpage.scss"

import { getCookie } from "../../js/getCookie"
import { userLocale } from "../../locale/userLocale"

const Info = lazy(() => import("./Info/Info"))
const Security = lazy(() => import("./Security/Security"))
const CustomPokemon = lazy(() => import("./CustomPokemon/CustomPokemon"))
const CustomMoves = lazy(() => import("./CustomMoves/CustomMoves"))
const UserShinyBroker = lazy(() => import("./UserShinyBroker/UserShinyBroker"))

let strings = new LocalizedStrings(userLocale)

class Userpage extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }


    render() {
        return (
            <div className="container-fluid mb-5 p-2">
                <SiteHelm
                    url="https://pogpvp.com/profile"
                    header={strings.pageheaders.usr}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />
                <div className="row m-0 justify-content-center" >
                    <div className="col-12 col-lg-12 mt-4 p-0 profile align-self-center">
                        <div className="row mx-0" >

                            <div className="col-12 px-0 text-center profile__title">
                                <div className="row mx-0">
                                    <div style={{ width: "144px", height: "1px" }}></div>
                                    <div className="col px-0">{strings.upage.prof}</div>
                                </div>
                            </div>
                            <UpageButtons history={this.props.history} activePath={this.props.match.params.type} />
                            <Suspense fallback={
                                <div className="col-12 px-0 ">
                                    <Loader
                                        color="black"
                                        weight="500"
                                        locale={strings.loading}
                                        loading={true}

                                        class="row justify-content-center text-white"
                                        innerClass="col-auto mt-1  mt-md-2"
                                    />
                                </div>
                            }>
                                <Switch>
                                    <Route path="/profile/pokemon" component={CustomPokemon} />
                                    <Route path="/profile/move" component={CustomMoves} />
                                    <Route path="/profile/shinybroker" component={UserShinyBroker} />
                                    <Route path="/profile/info" component={Info} />
                                    <Route path="/profile/security" component={Security} />
                                </Switch>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSession: value => dispatch(setSession(value))
    }
}

export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(Userpage)

