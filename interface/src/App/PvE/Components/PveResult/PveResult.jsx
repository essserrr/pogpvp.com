import React from "react";
import LocalizedStrings from 'react-localization';

import PveResEntry from "./PveResEntry"
import URL from "../../../PvP/components/URL/URL"
import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import MagicBox from "../../../PvP/components/MagicBox/MagicBox"
import Breakpoints from "../Breakpoints/Breakpoints"
import PveWillow from "../PveWillow/PveWillow"
import ButtonsRadio from "../ButtonsRadio/ButtonsRadio"

import { locale } from "../../../../locale/locale"
import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie } from '../../../../js/indexFunctions'


let strings = new LocalizedStrings(locale);
let pvestrings = new LocalizedStrings(pveLocale);

class PveResult extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            n: 1,
            breakpoints: false,

            param: "damage",
        };


        this.onClick = this.onClick.bind(this);
        this.showBreakpoints = this.showBreakpoints.bind(this);
        this.onSortChange = this.onSortChange.bind(this);


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
        this.refs.pveres.focus();
    };

    generateList() {
        let arr = []
        this.appendFromTo(0, (this.props.result.length >= 25 ? 25 : this.props.result.length), arr, this.props.result)

        this.setState({
            isNextPage: this.props.result.length > 25 ? true : false,
            n: this.props.result.length > 25 ? 2 : 1,

            listToShow: arr,
            param: "damage",
        })
    }

    loadMore() {
        let upperBound = this.props.result.length >= this.state.n * 25 ? this.state.n * 25 : this.props.result.length
        let lowerBound = (this.state.n - 1) * 25
        let arr = []
        this.appendFromTo(lowerBound, upperBound, arr, this.props.result)

        this.setState({
            isNextPage: (this.props.result.length > this.state.n * 25 ? true : false) && (this.state.n * 25 < 150),
            n: this.props.result.length > this.state.n * 25 ? this.state.n + 1 : this.state.n,

            listToShow: [...this.state.listToShow, ...arr],
        })
    }

    raplace(data, i) {
        this.setState({
            listToShow: [
                ...this.state.listToShow.slice(0, i),
                <PveResEntry
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

    appendFromTo(from, to, target, res) {
        for (let i = from; i < to; i++) {
            target.push(

                <PveResEntry
                    key={i}

                    i={i}
                    pokemonRes={res[i]}
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

    onSortChange(event) {
        let data = []

        switch (event.target.name) {
            case "dps":
                data = this.sortByDps(this.props.snapshot.bossObj.Tier > 3 ? 300 : 180)
                break
            default:
                data = this.sortByDamage()
        }


        let arr = []
        this.appendFromTo(0, this.state.listToShow.length, arr, data)

        this.setState({
            listToShow: arr,
            param: event.target.name,
        })

        this.props.assignSort(data)
    }

    sortByDamage() {
        return this.props.result.sort(function (a, b) {
            let sumDamageA = 0
            let sumDamageB = 0

            for (let i = 0; i < a.length; i++) {
                sumDamageA += a[i].DAvg
            }
            for (let j = 0; j < b.length; j++) {
                sumDamageB += b[j].DAvg
            }

            return sumDamageB - sumDamageA
        })
    }

    sortByDps(timer) {
        return this.props.result.sort(function (a, b) {
            let sumDamageA = 0
            let sumDamageB = 0

            let timerA = 0
            let timerB = 0

            for (let i = 0; i < a.length; i++) {
                sumDamageA += a[i].DAvg
                timerA += a[i].TAvg
            }
            for (let j = 0; j < b.length; j++) {
                sumDamageB += b[j].DAvg
                timerB += b[j].TAvg
            }

            let dpsA = (sumDamageA / a.length / (timer - timerA / a.length / 1000)).toFixed(1)
            let dpsB = (sumDamageB / b.length / (timer - timerB / b.length / 1000)).toFixed(1)

            if (dpsB - dpsA === 0) {
                return sumDamageB - sumDamageA
            }

            return dpsB - dpsA
        })
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
                <div className="row m-0 p-0 justify-content-center matrixResult p-2" tabIndex="0" ref="pveres">
                    <PveWillow
                        pokemonTable={this.props.pokemonTable}
                        snapshot={this.props.snapshot}
                    />
                    {this.props.url && <div className="col-12 mb-2" >
                        <URL
                            label={strings.title.url}
                            for="pvpURLLabel"
                            tip={<small>
                                {strings.tips.url.first}
                                < br />
                                {strings.tips.url.second}
                            </small>}
                            place="top"
                            message={strings.tips.url.message}
                            value={this.props.url}
                        />
                    </div>}
                    <div className={"col-12 m-0 p-0 font-weight-bold text-center"}>
                        {pvestrings.sort}
                    </div>
                    <ButtonsRadio
                        class="col-10 m-0 p-0 mb-2 btn-group btn-group-toggle"
                        param={this.state.param}
                        onChange={this.onSortChange}
                    />


                    <div className={"col-12 m-0 p-0 " + (this.state.isNextPage ? "mb-3" : "")}>
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