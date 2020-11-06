import React from "react";
import LocalizedStrings from "react-localization"

import Input from "../../PvP/components/Input/Input"
import ShinyTableThead from "./ShinyTableThead/ShinyTableThead"
import ShinyTableTr from "./ShinyTableTr/ShinyTableTr"

import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/getCookie"

let strings = new LocalizedStrings(locale);


class ShinyTable extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    parseShinyRates() {
        return this.props.list.map((value) => <ShinyTableTr
            key={value[1].Name + value[0]}
            pok={value[1]}
            pokTable={this.props.pokTable}
        />)
    }

    render() {
        return (
            <>
                <Input
                    class="mb-2"
                    onChange={this.props.onChange}
                    place={strings.shinyrates.searchplaceholder}
                />
                <table className="table  table-sm text-center">
                    <ShinyTableThead
                        onClick={this.props.onClick}
                        active={this.props.active}
                    />
                    <tbody>
                        {this.parseShinyRates()}
                    </tbody>
                </table>
            </>
        );
    }
}

export default ShinyTable;

