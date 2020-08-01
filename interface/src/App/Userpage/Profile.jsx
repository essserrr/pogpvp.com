import React from "react"
import LocalizedStrings from "react-localization";
import { connect } from 'react-redux'
import { Switch, Route } from "react-router-dom"

import { setSession } from "../../AppStore/Actions/actions"
import UpageButtons from "./ProfileButtons/ProfileButtons"
import SiteHelm from "../SiteHelm/SiteHelm"
import Info from "./Info/Info"
import Security from "./Security/Security"
import Pokemon from "./Pokemon/Pokemon"
import Move from "./Move/Move"
import Shbroker from "./Shbroker/Shbroker"

import "./Profile.scss"

import { getCookie } from "../../js/getCookie"
import { userLocale } from "../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);

class Userpage extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {}
    }

    componentDidMount() {
    }

    componentDidUpdate() {
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
                <div className="row m-0 justify-content-center">
                    <div className="col-12 col-lg-12 mt-4 p-0 profile align-self-center">
                        <div className="row mx-0">
                            <div className="col-12 px-0 text-center profile__title">{strings.upage.prof}</div>
                            <UpageButtons history={this.props.history} activePath={this.props.match.params.type} />
                            <Switch>
                                <Route path="/profile/pokemon" component={Pokemon} />
                                <Route path="/profile/move" component={Move} />
                                <Route path="/profile/shinybroker" component={Shbroker} />
                                <Route path="/profile/info" component={Info} />
                                <Route path="/profile/security" component={Security} />
                            </Switch>
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

