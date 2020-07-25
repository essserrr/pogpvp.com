
import React, { Suspense, lazy } from "react"
import Loader from "../PvpRating/Loader"
import { Switch, Route } from "react-router-dom"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../js/getCookie"
import { loaderLocale } from "../../locale/loaderLocale"

let strings = new LocalizedStrings(loaderLocale)

const NotFound = lazy(() => import("../NotFound/NotFound"))
const PvpPage = lazy(() => import("./PvpPage.jsx"))

class PvpRouter extends React.Component {
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
                    <Route path="/pvp/:type(matrix|single)/:league/:pok1/:pok2/:simtype" component={PvpPage} />
                    <Route path="/pvp/:type(matrix|single)/:league/:pok1/:pok2" component={PvpPage} />
                    <Route path="/pvp/:type(matrix|single)/:league/:pok1/" component={PvpPage} />
                    <Route path="/pvp/:type(matrix|single)/" component={PvpPage} />
                    <Route path="/pvp/:type(matrix|single)/*" component={PvpPage} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Suspense>
        )
    }
}

export default PvpRouter