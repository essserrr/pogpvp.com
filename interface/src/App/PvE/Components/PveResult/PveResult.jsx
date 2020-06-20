import React from "react";

import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { getCookie } from '../../../../js/indexFunctions'
import PveResEntry from "./PveResEntry"

let strings = new LocalizedStrings(locale);

class PveResult extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            constructor: false,
        };
        this.generateList = this.generateList.bind(this);
        this.focusDiv = this.focusDiv.bind(this);
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };
    focusDiv() {
        //strings.reconstruction
        this.refs.reconstruction.focus();
    };

    generateList() {
        let arr = []

        let arrLen = this.props.result.length >= 25 ? 25 : this.props.result.length

        for (let i = 0; i < arrLen; i++) {
            arr.push(
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
                />
            )
        }

        return arr
    }

    render() {
        return (
            <div className="row m-0 p-0 justify-content-center matrixResult p-2" tabIndex="0" ref="reconstruction">
                <div className="col-12 m-0 p-0">
                    {this.generateList()}
                </div>

            </div>
        )
    }

}


export default PveResult;