import React from "react";
import LocalizedStrings from "react-localization";
import AdvisorPanel from "./AdvisorPanel"
import PokemonIconer from "../PokemonIconer/PokemonIconer"
import { locale } from "../../../..//locale/locale"
import { getCookie, } from "../../..//../js/indexFunctions"
import SubmitButton from "../SubmitButton/SubmitButton"


let strings = new LocalizedStrings(locale);

class Advisor extends React.PureComponent {

    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            n: 1,
            original: [],
            toShow: [],
        }

        this.focusDiv = this.focusDiv.bind(this);
        this.returnRatingList = this.returnRatingList.bind(this);
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
        let list = this.returnRatingList()
        this.setState({
            original: list,
            toShow: list.slice(0, (list.length >= 50 ? 50 : list.length)),
            isNextPage: list.length > 50 ? true : false,
            n: list.length > 50 ? 2 : 1,
        })
    }

    focusDiv() {
        this.refs.advisor.focus();
    };

    loadMore() {
        let upperBound = this.state.original.length >= this.state.n * 50 ? this.state.n * 50 : this.state.original.length
        this.setState({
            isNextPage: this.state.original.length > this.state.n * 50 ? true : false,
            n: this.state.original.length > this.state.n * 50 ? this.state.n + 1 : this.state.n,

            toShow: this.state.original.slice(0, upperBound),
        })
    }

    returnRatingList() {
        return this.props.list.map((elem, i) => {
            return <div key={i} className={"col-12 p-0 m-0 mb-1"}>
                <AdvisorPanel
                    first={this.props.leftPanel.listForBattle[elem.first]}
                    second={this.props.leftPanel.listForBattle[elem.second]}
                    third={this.props.leftPanel.listForBattle[elem.third]}
                    i={i}

                    pokemonTable={this.props.pokemonTable}
                    list={this.props.list}
                    rawResult={this.props.rawResult}

                    leftPanel={this.props.leftPanel}
                    rightPanel={this.props.rightPanel}
                    moveTable={this.props.moveTable}
                />
            </div>
        });
    }

    render() {
        return (
            <div className="results max600 px-2 py-2 col-12 ">
                <div tabIndex="0" ref="advisor" className="col-12  d-flex justify-content-center p-0">
                    <PokemonIconer
                        src="willow3"
                        folder="/"
                        class={"willow p-2"} />
                    <div className="bubbleText posAbsB px-2 py-1 fBolder">
                        {strings.advisor.willow}
                    </div>
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
