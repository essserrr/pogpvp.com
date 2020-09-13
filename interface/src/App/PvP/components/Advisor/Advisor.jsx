import React from "react"
import LocalizedStrings from "react-localization"

import DoubleSlider from "../../../Movedex/MoveCard/DoubleSlider/DoubleSlider"
import PokemonIconer from "../PokemonIconer/PokemonIconer"
import AdvisorPages from "./AdvisorPages/AdvisorPages"
import SubmitButton from "../SubmitButton/SubmitButton"

import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

let strings = new LocalizedStrings(locale);

class Advisor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.advisor = React.createRef();

        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            n: 1,
            sortParam: "zeros",
        }

        this.focusDiv = this.focusDiv.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.loadMore = this.loadMore.bind(this);
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
        this.setState({
            isNextPage: this.props.list.length > 50 ? true : false,
            n: 1,
        })
    }

    focusDiv() {
        this.advisor.current.focus();
    };

    loadMore() {
        this.setState({
            isNextPage: this.props.list.length > (this.state.n + 1) * 50 ? true : false,
            n: this.props.list.length > this.state.n * 50 ? this.state.n + 1 : this.state.n,
        })
    }


    onSortChange(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
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
                    <AdvisorPages
                        n={this.state.n}

                        leftPanel={this.props.leftPanel}
                        rightPanel={this.props.rightPanel}

                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}

                        rawResult={this.props.rawResult}
                        filter={this.state.sortParam}
                        list={this.props.list}
                    />
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
