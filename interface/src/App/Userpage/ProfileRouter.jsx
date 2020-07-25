
import React, { Suspense, lazy } from "react"
import Loader from "../PvpRating/Loader"
import { Switch, Route } from "react-router-dom"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../js/getCookie"
import { loaderLocale } from "../../locale/loaderLocale"

let strings = new LocalizedStrings(loaderLocale)

const NotFound = lazy(() => import("../NotFound/NotFound"))
const Profile = lazy(() => import("./Profile"))

class ProfileRouter extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <Suspense fallback={<Loader
                color="white"
                weight="500"
                locale={strings.loading}
                loading={true}

                class="row justify-content-center text-white"
                innerClass="col-auto mt-1  mt-md-2"
            />}>
                <Switch>
                    <Route path="/profile/:type(pokemon|move|shinybroker)/" component={Profile} />
                    <Route path="/profile" component={Profile} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Suspense>
        )
    }
}

export default ProfileRouter