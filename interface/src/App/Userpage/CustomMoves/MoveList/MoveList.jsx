import React from "react"
import LocalizedStrings from "react-localization"

import UserMove from "./UserMove/UserMove"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

import "./MoveList.scss"

let strings = new LocalizedStrings(userLocale)

class MoveList extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="row mx-0">
                <div className="col-12 px-0 text-center movelist-resp__title">
                    {`${strings.moveconstr.umoves} ${this.props.moves.length}/100`}
                </div>
                <div className="col d-flex pl-0 pl-0 movelist-resp">
                    {this.props.moves.map((move, i) => <UserMove number={i} move={move} key={i}
                        onMoveOpen={this.props.onMoveOpen}
                        onMoveDelete={this.props.onMoveDelete}
                    />)}
                </div>
            </div>
        );
    }
}

export default MoveList
