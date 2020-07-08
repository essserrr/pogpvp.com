import React from "react";
import LocalizedStrings from "react-localization";
import AdvisorPanel from "./AdvisorPanel"
import PokemonIconer from "../PokemonIconer/PokemonIconer"
import { locale } from "../../../..//locale/locale"
import { getCookie, } from "../../..//../js/indexFunctions"


let strings = new LocalizedStrings(locale);

class Advisor extends React.PureComponent {

    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.focusDiv = this.focusDiv.bind(this);
        this.returnRatingList = this.returnRatingList.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };

    focusDiv() {
        this.refs.advisor.focus();
    };

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
            <div className="matrixResult smallWidth px-2 py-2 col-12 ">
                <div tabIndex="0" ref="advisor" className="col-12  d-flex justify-content-center p-0">
                    <PokemonIconer
                        src="willow3"
                        folder="/"
                        class={"willow p-2"} />
                    <div className="bubbleText posAbsB px-2 py-1 fBolder">
                        {strings.advisor.willow}
                    </div>
                </div>
                <div className="overflowingy height500resp col-12 p-0 ">
                    {this.returnRatingList()}
                </div>

            </div>
        );
    }
};

export default Advisor;
