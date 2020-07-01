import React from "react";
import LocalizedStrings from 'react-localization';
import MoveCol from "./MoveCol"

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import DropWithArrow from "../../PvpRating/DropWithArrow/DropWithArrow"


let strings = new LocalizedStrings(dexLocale);

class MoveBlock extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showCollapse: this.props.defOpen,
        };
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
        })
    }

    render() {
        return (
            <DropWithArrow
                onShow={this.onClick}
                show={this.state.showCollapse}
                title={strings.movelist + this.props.value.Title}
                elem={<>
                    {this.props.value.QuickMoves.length > 0 &&
                        <MoveCol value={this.props.value.QuickMoves} class="p-0 pr-0 pr-sm-2"
                            moveTable={this.props.moveTable} title={strings.qm} pok={this.props.value} />}
                    {this.props.value.ChargeMoves.length > 0 &&
                        <MoveCol value={this.props.value.ChargeMoves} class="p-0 pl-0 pl-sm-2"
                            moveTable={this.props.moveTable} title={strings.chm} pok={this.props.value} />}
                </>}

                faOpened="align-self-center fas fa-angle-up fa-lg "
                faClosed="align-self-center fas fa-angle-down fa-lg"

                outClass="row justify-content-between m-0 p-0 pb-1 mt-2 clickable"
                midClass="dexFont font-weight-bold"
                inClass="row m-0 p-0" />

        );
    }
}

export default MoveBlock;