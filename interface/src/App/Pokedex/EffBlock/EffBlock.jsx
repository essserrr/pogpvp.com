import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import DropWithArrow from "../../PvpRating/DropWithArrow/DropWithArrow"
import EffTable from "./EffTable"

let strings = new LocalizedStrings(dexLocale);

class EffBlock extends React.PureComponent {
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
                title={this.props.locale}
                elem={<EffTable
                    type={this.props.type}
                    title={this.props.title}
                    reverse={this.props.reverse}
                />}

                faOpened="align-self-center fas fa-angle-up fa-lg "
                faClosed="align-self-center fas fa-angle-down fa-lg"

                outClass="row justify-content-between m-0 p-0 pb-1 mt-2 clickable"
                midClass="dexFont font-weight-bold"
                inClass="row m-0 p-0" />

        );
    }
}

export default EffBlock;