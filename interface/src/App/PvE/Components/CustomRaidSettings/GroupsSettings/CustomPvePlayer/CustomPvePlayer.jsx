import React from "react"
import LocalizedStrings from "react-localization"

import PlayerParty from "./PlayerParty/PlayerParty"

import { pveLocale } from "../../../../../../locale/pveLocale"
import { getCookie } from "../../../../../../js/getCookie"

let strings = new LocalizedStrings(pveLocale)

class CustomPvePlayer extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        const list = [{ value: "", label: <div style={{ textAlign: "left" }}>{strings.none}</div> },
        ...Object.keys(this.props.userParties).map((value) => ({ value: value, label: <div style={{ textAlign: "left" }}>{value}</div> }))]
        return (
            <div className="row m-0 my-1 align-itmes-center justify-conten-center text-left">
                <div className="col-4 px-0 pr-1">
                    <PlayerParty
                        list={list}
                        title={strings.party}

                        value={this.props.group1.title}
                        partyNumber={0}
                        playerNumber={this.props.playerNumber}

                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-4  px-0 pr-1">
                    <PlayerParty
                        list={list}
                        title={strings.party}

                        value={this.props.group2.title}
                        partyNumber={1}
                        playerNumber={this.props.playerNumber}

                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-4 px-0">
                    <PlayerParty
                        list={list}
                        title={strings.party}

                        value={this.props.group3.title}
                        partyNumber={2}
                        playerNumber={this.props.playerNumber}

                        onChange={this.props.onChange}
                    />
                </div>
            </div>
        )
    }

}


export default CustomPvePlayer