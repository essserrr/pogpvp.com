import React from "react"
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import Alert from '@material-ui/lab/Alert';

import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import RenderEggList from "./RenderEggList/RenderEggList"
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock"
import Loader from "../PvpRating/Loader"
import SingleSliderButton from "./SingleSliderButton/SingleSliderButton"

import { getCookie } from "../../js/getCookie"
import { locale } from "../../locale/locale"

import "./EggsList.scss"

let strings = new LocalizedStrings(locale)

class EggsList extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            isError: false,
            error: "",
            loading: false,

            filter: {
                showReg: false,
            },
        };
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        //get pok and eggs db
        try {
            let fetches = [
                this.props.getPokemonBase(),
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/eggs", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }),
            ];

            let responses = await Promise.all(fetches)
            let result = await responses[1].json()

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (i === 1 ? result.detail : responses[i].detail) }
            }

            this.setState({
                isError: false,
                loading: false,
                tierList: result,
            })

        } catch (e) {
            this.setState({
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

    filter(elem, filter) {
        if (!filter) {
            return true
        }
        let filterProduct = Object.entries(filter).reduce((sum, value) => { return value[0].includes("eggs") ? sum * !value[1] : sum }, true)
        if (filterProduct) { return true }
        return filter[elem.key]
    }

    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/eggs"
                    header={strings.pageheaders.eggs}
                    descr={strings.pagedescriptions.eggs}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className="row justify-content-center px-2 pb-2">
                        <div className="eggs-list col-sm-12 col-md-11 col-lg-8 mx-0 py-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.tierList &&
                                <>
                                    <ButtonsBlock
                                        filter={this.state.filter}
                                        onFilter={this.onChange}
                                    />
                                    <div className="row justify-content-center m-0">
                                        <div className="col-12 col-sm-6 p-0 mb-3" >
                                            <SingleSliderButton
                                                attr="showReg"
                                                title={strings.tierlist.regionals}
                                                isActive={this.state.filter.showReg}
                                                onClick={this.onChange}
                                            />
                                        </div>
                                    </div>
                                </>}
                            {this.state.isError && <Alert variant="filled" severity="error">{this.state.error}</Alert >}
                            {this.state.tierList &&
                                <RenderEggList
                                    list={this.state.tierList}
                                    pokTable={this.props.bases.pokemonBase}
                                    filter={this.state.filter}
                                />}
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
)(EggsList)






