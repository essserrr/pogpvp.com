import React from "react"
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import Errors from "../PvP/components/Errors/Errors"
import RenderEggList from "./RenderEggList/RenderEggList"
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock"
import Button from "../Movedex/MoveCard/DoubleSlider/Button/Button"
import Loader from "../PvpRating/Loader"

import { getCookie } from "../../js/getCookie"
import { locale } from "../../locale/locale"


let strings = new LocalizedStrings(locale);

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
        if (!filter.eggs0 && !filter.eggs1 && !filter.eggs2 && !filter.eggs3 && !filter.eggs4 && !filter.eggs5) {
            return true
        }
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
                <div className=" container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews max1200-1 col-sm-12 col-md-11 col-lg-8 mx-0 py-4">
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
                                    <div className=" row justify-content-center m-0">
                                        <div className={"col-12 col-sm-6 p-0 mb-3 text-center sliderGroup justify-content-center"} >
                                            <Button
                                                attr="showReg"
                                                title={strings.tierlist.regionals}
                                                class={this.state.filter.showReg ?
                                                    "col py-1 sliderButton active" : "col py-1 sliderButton"}
                                                onClick={this.onChange}
                                            />
                                        </div>
                                    </div>
                                </>}
                            {this.state.isError && <Errors class="alert alert-danger p-2" value={this.state.error} />}
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






