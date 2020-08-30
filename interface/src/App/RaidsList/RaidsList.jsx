import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization";
import { connect } from "react-redux"

import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
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
                this.props.getPokemonBase(),
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/raids", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }),
            ]

            let responses = await Promise.all(fetches)
            let result = await responses[1].json()

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (i === 1 ? result.detail : this.props.bases.error) }
            }

            let list = this.returnRaidsList(result, this.props.bases.pokemonBase)
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
        const tiers = [{ name: "Mega Raids", value: 5, key: "megaRaids" },
        { name: "Tier 5", value: 5, key: "tier5" },
        { name: "Tier 3", value: 3, key: "tier3" },
        { name: "Tier 1", value: 1, key: "tier1" }]

        return tiers.map((value) => <RaidTier
            key={value.key}
            class="separator capsSeparator"

            title={
                <IconMultiplicator title={value.name !== "Mega Raids" ?
                    strings.tierlist.raidtier + " " + value.value : strings.tierlist.mega}
                    n={value.value} />}
            list={tierList[value.name]}
            pokTable={pokTable}
            i={value.value}
        />
        )
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
        if (!filter.tier1 && !filter.tier2 && !filter.tier3 && !filter.tier4 && !filter.tier5 && !filter.megaRaids) {
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

const mapDispatchToProps = dispatch => {
    return {
        getPokemonBase: () => dispatch(getPokemonBase()),
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(RaidsList)
