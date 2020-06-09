import React from "react";
import LocalizedStrings from 'react-localization';
import AdvisorPanel from "./AdvisorPanel"
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
            <div tabIndex="0" ref="advisor">
                {this.returnRatingList()}
            </div>
        );
    }
};

export default Advisor;
