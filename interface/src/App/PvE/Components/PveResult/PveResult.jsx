import React from "react"
import LocalizedStrings from "react-localization"

import PveResEntry from "./PveResEntry"
import URL from "../../../PvP/components/URL/URL"
import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import MagicBox from "../../../PvP/components/MagicBox/MagicBox"
import Breakpoints from "../Breakpoints/Breakpoints"
import PveWillow from "../PveWillow/PveWillow"
import DoubleSlider from "../../../Movedex/DoubleSlider/DoubleSlider"
import Button from "../../../Movedex/Button/Button"

import { locale } from "../../../../locale/locale"
import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie } from "../../../../js/getCookie"


let strings = new LocalizedStrings(locale);
let pvestrings = new LocalizedStrings(pveLocale);

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

        this.raplace = this.raplace.bind(this);
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
        let result = this.sortAndFilter(this.state.param, this.state.filter)
        let upperBound = this.props.result.length >= 25 ? 25 : this.props.result.length
        this.setState({
            isNextPage: result.length > 25 ? true : false,
            n: result.length > 25 ? 2 : 1,
            listToShow: this.generateRes(result.slice(0, upperBound)),
        })
    }

    generateRes(arr) {
        return arr.map((elem, i) =>
            <PveResEntry
                key={i}
                customResult={this.props.customResult}

                i={i}
                pokemonRes={elem}
                snapshot={this.props.snapshot}
                tables={this.props.tables}

                pokemonTable={this.props.pokemonTable}
                moveTable={this.props.moveTable}
                pokList={this.props.pokList}
                chargeMoveList={this.props.chargeMoveList}
                quickMoveList={this.props.quickMoveList}

                raplace={this.raplace}
                showBreakpoints={this.showBreakpoints}
            />
        )
    }

    loadMore() {
        let result = this.sortAndFilter(this.state.param, this.state.filter)
        let upperBound = result.length >= (this.state.n + 1) * 25 ? (this.state.n + 1) * 25 : result.length
        this.setState({
            isNextPage: (result.length > (this.state.n + 1) * 25 ? true : false) && ((this.state.n + 1) * 25 < 150),
            n: result.length > (this.state.n + 1) * 25 ? (this.state.n + 1) : this.state.n,
            listToShow: this.generateRes(result.slice(0, upperBound)),
        })
    }

    raplace(data, i) {
        this.props.replaceOriginal(data, i)
        this.setState({
            listToShow: [
                ...this.state.listToShow.slice(0, i),
                <PveResEntry
                    customResult={this.props.customResult}
                    key={i}

                    i={i}
                    pokemonRes={data[0]}
                    snapshot={this.props.snapshot}
                    tables={this.props.tables}

                    pokemonTable={this.props.pokemonTable}
                    moveTable={this.props.moveTable}
                    pokList={this.props.pokList}
                    chargeMoveList={this.props.chargeMoveList}
                    quickMoveList={this.props.quickMoveList}

                    raplace={this.raplace}
                    showBreakpoints={this.showBreakpoints}
                />,
                ...this.state.listToShow.slice((i + 1)),
            ]
        })
    }


    onSortChange(event) {
        let attr = event.target.getAttribute("attr")
        let result = this.sortAndFilter(attr, this.state.filter)
        let upperBound = result.length >= this.state.n * 25 ? this.state.n * 25 : result.length
        this.setState({
            listToShow: this.generateRes(result.slice(0, upperBound)),
            isNextPage: (result.length > this.state.n * 25 ? true : false) && (this.state.n * 25 < 150),
            n: result.length > this.state.n * 25 ? this.state.n : Math.ceil(result.length / 25),
            param: attr,
        })
    }

    onFilter(event) {
        let attr = event.target.getAttribute("attr")
        let result = this.sortAndFilter(this.state.param, { ...this.state.filter, [attr]: !this.state.filter[attr] })
        let upperBound = result.length >= this.state.n * 25 ? this.state.n * 25 : result.length
        this.setState({
            listToShow: this.generateRes(result.slice(0, upperBound)),
            isNextPage: (result.length > this.state.n * 25 ? true : false) && (this.state.n * 25 < 150),
            n: result.length > this.state.n * 25 ? this.state.n : Math.ceil(result.length / 25),

            filter: {
                ...this.state.filter,
                [attr]: !this.state.filter[attr],
            },
        })
    }

    sortAndFilter(param, filter) {
        switch (param) {
            case "dps":
                var data = this.sortByDps(this.props.snapshot.bossObj.Tier > 3 ? 300 : 180,)
                break
            default:
                data = this.sortByDamage()
        }
        return data = this.filterArr(data, filter)
    }

    filterArr(arr, filter) {
        switch (filter.unique) {
            case true:
                let list = {}
                return arr.filter(elem => {
                    //check entry in local dict
                    switch (list[`${elem.Party[0].Name}${String(elem.Party[0].IsShadow) === "true"}`]) {
                        //if it exists
                        case true:
                            //otherwise exclude
                            return false
                        default:
                            list[`${elem.Party[0].Name}${String(elem.Party[0].IsShadow) === "true"}`] = true
                            //and return include it
                            return true
                    }
                })
            default:
                return arr
        }
    }

    sortByDamage() {
        return this.props.result.sort(function (a, b) {
            let sumDamageA = 0
            let sumDamageB = 0

            a.Result.forEach((elem) => {
                sumDamageA += elem.DAvg
            });
            b.Result.forEach((elem) => {
                sumDamageB += elem.DAvg
            });

            return sumDamageB - sumDamageA
        })
    }

    sortByDps(timer) {
        return this.props.result.sort(function (a, b) {
            let sumDamageA = 0
            let sumDamageB = 0

            let timerA = 0
            let timerB = 0

            a.Result.forEach((elem) => {
                sumDamageA += elem.DAvg
                timerA += elem.TAvg
            });
            b.Result.forEach((elem) => {
                sumDamageB += elem.DAvg
                timerB += elem.TAvg
            });

            let dpsA = (sumDamageA / a.Result.length / (timer - timerA / a.Result.length / 1000)).toFixed(1)
            let dpsB = (sumDamageB / b.Result.length / (timer - timerB / b.Result.length / 1000)).toFixed(1)

            if (dpsB - dpsA === 0) {
                return sumDamageB - sumDamageA
            }

            return dpsB - dpsA
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
                <div className="row m-0 justify-content-center results p-2" tabIndex="0" ref={this.pveres}>
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

                            attr1="damage"
                            title1={pvestrings.sortd}
                            active1={this.state.param === "damage"}

                            attr2="dps"
                            title2={pvestrings.sortdps}
                            active2={this.state.param === "dps"}
                        />
                    </div>}
                    {!this.props.customResult && <div className={"col-12 col-sm-6 p-0 mb-3 text-center sliderGroup justify-content-center"} >
                        <Button
                            attr="unique"
                            title={pvestrings.unique}
                            class={this.state.filter.unique ?
                                "col py-1 sliderButton active" : "col py-1 sliderButton"}
                            onClick={this.onFilter}
                        />
                    </div>}
                    <div className={"col-12 p-0 " + (this.state.isNextPage ? "mb-3" : "")}>
                        {this.state.listToShow}
                    </div>

                    {this.state.isNextPage &&
                        <SubmitButton
                            action="Load more"
                            label={strings.buttons.loadmore}
                            onSubmit={this.loadMore}
                            class="longButton btn btn-primary btn-sm"
                        />}
                </div>
            </>
        )
    }

}


export default PveResult;