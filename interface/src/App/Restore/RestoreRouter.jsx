
import React, { Suspense, lazy } from "react"
import Loader from "../PvpRating/Loader"
import { Switch, Route } from "react-router-dom"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../js/getCookie"
import { loaderLocale } from "../../locale/loaderLocale"

let strings = new LocalizedStrings(loaderLocale)

const Restore = lazy(() => import("./Restore"))
const Confirmation = lazy(() => import("./Confirmation/Confirmation"))

class RestoreRouter extends React.Component {
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
                    <Route exact path="/restore/confirm/:type" component={Confirmation} />
                    <Route exact path="/restore" component={Restore} />
                </Switch>
            </Suspense>
        )
    }
}

export default RestoreRouter