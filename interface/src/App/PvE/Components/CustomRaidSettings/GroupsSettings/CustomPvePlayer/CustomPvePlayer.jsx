import React from "react"
import LocalizedStrings from "react-localization"

import PlayerParty from "./PlayerParty/PlayerParty"
import CloseButton from "../../../../../PvP/components/MagicBox/CloseButton"

import { pveLocale } from "../../../../../../locale/pveLocale"
import { getCookie } from "../../../../../../js/getCookie"

import "./CustomPvePlayer.scss"

let strings = new LocalizedStrings(pveLocale)

class CustomPvePlayer extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        const list = [{ value: "", label: <div style={{ textAlign: "left" }}>{strings.none}</div> },
        ...Object.keys(this.props.userParties).map((value) => ({ value: value, label: <div style={{ textAlign: "left" }}>{value}</div> }))]
        return (
            <div className="row m-0 my-1 align-items-center justify-conten-center text-left">
                <div className="custom-player__title col-12 d-flex px-0 mb-2 justify-content-between">
                    {`${strings.player} ${this.props.playerNumber + 1}`}
                    {this.props.playerNumber !== 0 && <CloseButton
                        attr={"deletePlayer"}
                        index={this.props.playerNumber}
                        onClick={this.props.onChange}
                    />}
                </div>
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