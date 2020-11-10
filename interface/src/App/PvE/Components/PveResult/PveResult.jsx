import React from "react"
import LocalizedStrings from "react-localization"

import URL from "../../../PvP/components/URL/URL"
import MagicBox from "../../../PvP/components/MagicBox/MagicBox"
import DoubleSlider from "../../../Movedex/MoveCard/DoubleSlider/DoubleSlider"
import Breakpoints from "./Breakpoints/Breakpoints"
import PveWillow from "./PveWillow/PveWillow"
import PveResListFilter from "./PveResListFilter/PveResListFilter"
import SingleSliderButton from "../../../EggsList/SingleSliderButton/SingleSliderButton"
import PlayerResProcessor from "./PlayerResProcessor/PlayerResProcessor"
import PveResTitle from "./PveResTitle/PveResTitle"

import { locale } from "../../../../locale/locale"
import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie } from "../../../../js/getCookie"

import "./PveResult.scss"

let strings = new LocalizedStrings(locale)
let pvestrings = new LocalizedStrings(pveLocale)

class PveResult extends React.PureComponent {
    constructor(props) {
        super(props);
        this.pveres = React.createRef();

        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            n: 0,
            breakpoints: false,

            param: "damage",
            filter: {}
        };


        this.onClick = this.onClick.bind(this);
        this.showBreakpoints = this.showBreakpoints.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.onFilter = this.onFilter.bind(this);

        this.loadMore = this.loadMore.bind(this);

        this.focusDiv = this.focusDiv.bind(this);
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        this.generateList()
        this.focusDiv();
    };
    componentDidUpdate(prevProps) {
        if (this.props.date === prevProps.date) {
            return
        }
        this.generateList()
        this.focusDiv();
    };

    focusDiv() {
        this.pveres.current.focus();
    };

    generateList() {
        this.setState({
            n: 1,
        })
    }

    loadMore() {
        this.setState({
            n: this.props.result.length >= (this.state.n + 1) * 25 ? (this.state.n + 1) : this.state.n,
        })
    }

    onSortChange(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            param: attr,
        })
    }

    onFilter(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            filter: {
                ...this.state.filter,
                [attr]: !this.state.filter[attr],
            },
        })
    }

    showBreakpoints(obj) {
        this.setState({
            showBreakpoints: true,
            breakpObj: obj,
        })
    }

    onClick(event) {
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }
        this.setState({
            showBreakpoints: false,
        });
    }

    render() {
        return (
            <>
                {(this.state.showBreakpoints) && <MagicBox
                    onClick={this.onClick}
                    attr={"breakpoints"}
                    element={<Breakpoints
                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}
                        snapshot={this.state.breakpObj}
                    />}
                />}
                <div className="pveresult row m-0 justify-content-center p-2" tabIndex="0" ref={this.pveres}>
                    <PveWillow
                        pokemonTable={this.props.pokemonTable}
                        snapshot={this.props.snapshot}
                    />
                    {this.props.url && <div className="col-12 mb-2" >
                        <URL
                            label={strings.title.url}
                            for="pvpURLLabel"
                            tip={<>
                                {strings.tips.url.first}
                                < br />
                                {strings.tips.url.second}
                            </>}
                            place="top"
                            message={strings.tips.url.message}
                            value={this.props.url}
                        />
                    </div>}
                    {!this.props.customResult && <div className="col-12 mb-1 px-3">
                        <DoubleSlider
                            onClick={this.onSortChange}
                            attrs={["damage", "dps"]}
                            titles={[pvestrings.sortd, pvestrings.sortdps]}
                            active={[this.state.param === "damage", this.state.param === "dps"]}
                        />
                    </div>}
                    {!this.props.customResult &&
                        <div className={"col-12 col-sm-6 p-0 mb-3 text-center justify-content-center"} >
                            <SingleSliderButton
                                attr="unique"
                                title={pvestrings.unique}
                                isActive={this.state.filter.unique}
                                onClick={this.onFilter}
                            />
                        </div>}
                    {this.props.needsAvg &&
                        <>
                            <div className={"col-12 px-0 mt-2"}>
                                <PveResTitle>
                                    {`${pvestrings.resType.player}:`}
                                </PveResTitle>
                            </div>
                            <div className={"col-12 px-0"}>
                                <PlayerResProcessor
                                    value={this.props.result}

                                    snapshot={this.props.snapshot}
                                    tables={this.props.tables}

                                    pokemonTable={this.props.pokemonTable}
                                    moveTable={this.props.moveTable}
                                />
                            </div>
                            <div className={"col-12 px-0 mt-2"}>
                                <PveResTitle>
                                    {`${pvestrings.resType.individ}:`}
                                </PveResTitle>
                            </div>
                        </>}
                    <div className={"col-12 p-0 " + (this.state.isNextPage ? "mb-3" : "")}>
                        <PveResListFilter
                            needsAvg={this.props.needsAvg}
                            n={this.state.n}
                            customResult={this.props.customResult}

                            snapshot={this.props.snapshot}
                            tables={this.props.tables}

                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.moveTable}

                            filter={this.state.filter}
                            sort={this.state.param}

                            list={this.props.result}
                            raplace={this.raplace}
                            showBreakpoints={this.showBreakpoints}
                            loadMore={this.loadMore}
                        />
                    </div>
                </div>
            </>
        )
    }

}


export default PveResult;