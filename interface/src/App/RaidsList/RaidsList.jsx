import React from "react"
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import Alert from '@material-ui/lab/Alert';

import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import RenderRaidList from "./RenderRaidList/RenderRaidList"
import Loader from "../PvpRating/Loader"
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/getCookie"

import "./RaidsList.scss"

let strings = new LocalizedStrings(locale)

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
                if (!responses[i].ok) { throw (i === 1 ? result.detail : responses[i].detail) }
            }

            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                originalList: result,
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

    onChange(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            filter: {
                ...this.state.filter,
                [attr]: !Boolean(this.state.filter[attr])
            }
        })
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
                    <div className="row justify-content-center px-2 pb-2">
                        <div className="raid-list col-sm-12 col-md-11 col-lg-8 py-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}

                            {this.state.originalList && <>
                                <ButtonsBlock
                                    filter={this.state.filter}
                                    onFilter={this.onChange}
                                />
                            </>}
                            {this.state.isError && <Alert variant="filled" severity="error">{this.state.error}</Alert >}


                            {this.state.originalList &&
                                <RenderRaidList filter={this.state.filter} pokTable={this.props.bases.pokemonBase}>
                                    {this.state.originalList}
                                </RenderRaidList>}
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
