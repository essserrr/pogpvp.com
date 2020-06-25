import React from "react";

import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { getCookie } from '../../../../js/indexFunctions'
import PveResEntry from "./PveResEntry"
import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import MagicBox from "../../../PvP/components/MagicBox/MagicBox"
import Breakpoints from "../Breakpoints/Breakpoints"
import PveWillow from "../PveWillow/PveWillow"

let strings = new LocalizedStrings(locale);

class PveResult extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            n: 1,
            breakpoints: false,
        };


        this.onClick = this.onClick.bind(this);
        this.showBreakpoints = this.showBreakpoints.bind(this);

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
        this.appendFromTo(0, (this.props.result.length >= 25 ? 25 : this.props.result.length), arr)

        this.setState({
            isNextPage: this.props.result.length > 25 ? true : false,
            n: this.props.result.length > 25 ? 2 : 1,

            listToShow: arr,
        })
    }

    loadMore() {
        let upperBound = this.props.result.length >= this.state.n * 25 ? this.state.n * 25 : this.props.result.length
        let lowerBound = (this.state.n - 1) * 25
        let arr = []
        this.appendFromTo(lowerBound, upperBound, arr)

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

    appendFromTo(from, to, target) {
        for (let i = from; i < to; i++) {
            target.push(
                <PveResEntry
                    key={i}

                    i={i}
                    pokemonRes={this.props.result[i]}
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