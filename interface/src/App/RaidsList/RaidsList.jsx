import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization";

import Errors from "../PvP/components/Errors/Errors"
import IconMultiplicator from "./IconMultiplicator/IconMultiplicator"
import Loader from "../PvpRating/Loader"
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock"
import RaidTier from "./RaidTier/RaidTier"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/getCookie"

let strings = new LocalizedStrings(locale);


class RaidsList extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
            isError: false,
            error: "",
            loading: false,

            filter: {},
        };
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        try {
            let fetches = [
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }),
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/raids", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }),
            ]

            let responses = await Promise.all(fetches)

            let parses = [
                responses[0].json(),
                responses[1].json(),
            ]

            let results = await Promise.all(parses)

            for (let i = 0; i < responses.length; i++) { if (!responses[i].ok) { throw results[i].detail } }

            let list = this.returnRaidsList(results[1], results[0])
            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                originalList: list,
                listToShow: list,
            })

        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e)
            })
        }
    }

    //generator functions
    returnRaidsList(tierList, pokTable) {
        let raidList = []
        for (let i = 5; i > 0; i--) {
            raidList.push(
                <RaidTier
                    key={"tier" + i}
                    class="separator capsSeparator"
                    title={<IconMultiplicator title={strings.tierlist.raidtier + " " + i} n={i} />}
                    list={tierList["Tier " + i]}
                    pokTable={pokTable}
                    i={i}
                />)
        }
        return raidList
    }

    onChange(event) {
        let attr = event.target.getAttribute("attr")
        let newFilter = { ...this.state.filter, [attr]: !this.state.filter[attr] }
        this.setState({
            listToShow: this.state.originalList.filter(elem =>
                this.filter(elem, newFilter)),
            filter: {
                ...this.state.filter,
                [attr]: !Boolean(this.state.filter[attr])
            }
        })
    }


    filter(elem, filter) {
        if (!filter) {
            return true
        }
        if (!filter.tier1 && !filter.tier2 && !filter.tier3 && !filter.tier4 && !filter.tier5) {
            return true
        }
        return filter[elem.key]
    }



    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/raids"
                    header={strings.pageheaders.raids}
                    descr={strings.pagedescriptions.raids}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews max1200-1 col-sm-12 col-md-11 col-lg-8 py-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}

                            {this.state.listToShow && <>
                                <ButtonsBlock
                                    filter={this.state.filter}
                                    onFilter={this.onChange}
                                />
                            </>}
                            {this.state.isError && <Errors class="alert alert-danger p-2" value={this.state.error} />}
                            {this.state.listToShow && this.state.listToShow}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default RaidsList

