import React from "react";
import LocalizedStrings from 'react-localization';
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
        let result = []
        for (var i = 0; i < this.props.list.length; i++) {
            result.push(
                <div key={i} className={"col-12 p-0 m-0 mb-1"}>

                    <AdvisorPanel
                        first={this.props.leftPanel.listForBattle[this.props.list[i].first]}
                        second={this.props.leftPanel.listForBattle[this.props.list[i].second]}
                        third={this.props.leftPanel.listForBattle[this.props.list[i].third]}
                        i={i}

                        pokemonTable={this.props.pokemonTable}
                        list={this.props.list}
                        rawResult={this.props.rawResult}

                        leftPanel={this.props.leftPanel}
                        rightPanel={this.props.rightPanel}
                        moveTable={this.props.moveTable}
                    />
                </div>
            )
        }
        return result

    }

    render() {
        return (
            <div className="matrixResult smallWidth px-2 py-2 col-12 ">
                <div tabIndex="0" ref="advisor" className="col-12  d-flex justify-content-center m-0 p-0">
                    <PokemonIconer
                        src="willow3"
                        folder="/"
                        class={"willow p-2"} />
                    <div className="bubbleText posAbsB px-2 py-1 fBolder">
                        {strings.advisor.willow}
                    </div>
                </div>
                <div className="overflowingy height500resp col-12 m-0 p-0 ">
                    {this.returnRatingList()}
                </div>

            </div>
        );
    }
};

export default Advisor;
