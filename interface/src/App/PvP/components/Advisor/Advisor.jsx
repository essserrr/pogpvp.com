import React from "react";
import LocalizedStrings from "react-localization";
import AdvisorPanel from "./AdvisorPanel/AdvisorPanel"
import DoubleSlider from "../../../Movedex/DoubleSlider/DoubleSlider"
import PokemonIconer from "../PokemonIconer/PokemonIconer"
import { locale } from "../../../../locale/locale"
import { getCookie, } from "../../../../js/getCookie"
import SubmitButton from "../SubmitButton/SubmitButton"


let strings = new LocalizedStrings(locale);

class Advisor extends React.PureComponent {
    constructor(props) {
        super();
        this.advisor = React.createRef();

        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            n: 1,
            original: [],
            toShow: [],
            sortParam: "zeros",
        }

        this.focusDiv = this.focusDiv.bind(this);
        this.returnRatingList = this.returnRatingList.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
        this.makeAdvice()
    };
    componentDidUpdate(prevProps) {
        if (prevProps.rawResult === this.props.rawResult) {
            return
        }
        this.focusDiv();
        this.makeAdvice()
    };

    makeAdvice() {
        let list = this.sortList(this.state.sortParam)
        list = this.returnRatingList(list)


        this.setState({
            original: list,
            toShow: list.slice(0, (list.length >= 50 ? 50 : list.length)),
            isNextPage: list.length > 50 ? true : false,
            n: list.length > 50 ? 2 : 1,
        })
    }

    returnRatingList(list) {
        return list.map((elem, i) =>
            <div key={i} className={"col-12 p-0 m-0 mb-1"} rate={elem.rate} zeros={elem.zeros.length}>
                <AdvisorPanel
                    first={this.props.leftPanel.listForBattle[elem.first]}
                    second={this.props.leftPanel.listForBattle[elem.second]}
                    third={this.props.leftPanel.listForBattle[elem.third]}
                    i={i}

                    pokemonTable={this.props.pokemonTable}
                    list={list}
                    rawResult={this.props.rawResult}

                    leftPanel={this.props.leftPanel}
                    rightPanel={this.props.rightPanel}
                    moveTable={this.props.moveTable}
                />
            </div>
        );
    }

    sortList(filter) {
        switch (filter) {
            case "rating":
                return this.props.list.sort((a, b) => {
                    if (a.rate === b.rate) { return a.zeros.length - b.zeros.length }
                    return b.rate - a.rate
                });
            default:
                return this.props.list.sort((a, b) => {
                    if (a.zeros.length === b.zeros.length) { return b.rate - a.rate }
                    return a.zeros.length - b.zeros.length
                });
        }
    }

    focusDiv() {
        this.advisor.current.focus();
    };

    loadMore() {
        let upperBound = this.state.original.length >= this.state.n * 50 ? this.state.n * 50 : this.state.original.length
        this.setState({
            isNextPage: this.state.original.length > this.state.n * 50 ? true : false,
            n: this.state.original.length > this.state.n * 50 ? this.state.n + 1 : this.state.n,

            toShow: this.state.original.slice(0, upperBound),
        })
    }


    onSortChange(event) {
        let attr = event.target.getAttribute("attr")

        let result = this.sortList(attr)
        result = this.returnRatingList(result)


        let upperBound = this.state.original.length >= (this.state.n - 1) * 50 ? (this.state.n - 1) * 50 : this.state.original.length

        this.setState({
            original: result,
            toShow: result.slice(0, upperBound),
            sortParam: attr,
        })
    }

    render() {
        return (
            <div className="results max600 px-2 py-2 col-12 ">
                <div tabIndex="0" ref={this.advisor} className="col-12  d-flex justify-content-center p-0">
                    <PokemonIconer
                        src="willow3"
                        folder="/"
                        class={"willow p-2"} />
                    <div className="bubbleText posAbsB px-2 py-1 fBolder">
                        {strings.advisor.willow}
                    </div>
                </div>
                <div className="col-12 p-0 pb-2">
                    <DoubleSlider
                        onClick={this.onSortChange}

                        attr1="zeros"
                        title1={strings.buttons.byzeros}
                        active1={this.state.sortParam === "zeros"}

                        attr2="rating"
                        title2={strings.buttons.byrating}
                        active2={this.state.sortParam === "rating"}
                    />
                </div>
                <div className="col-12 p-0 ">
                    {this.state.toShow}
                </div>
                {this.state.isNextPage &&
                    <div className="row justify-content-center m-0 mt-3">
                        <SubmitButton
                            action="Load more"
                            label={strings.buttons.loadmore}
                            onSubmit={this.loadMore}
                            class="longButton btn btn-primary btn-sm"
                        />
                    </div>}
            </div>
        );
    }
};

export default Advisor;
