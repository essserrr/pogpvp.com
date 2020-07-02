import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

class NavigationBlock extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {};
    }

    buttonsConfig() {
        if (this.props.list[this.props.position - 1] && this.props.list[this.props.position + 1]) {
            return "justify-content-between"
        }
        if (this.props.list[this.props.position - 1]) {
            return "justify-content-start"
        }
        return "justify-content-end"
    }

    render() {
        return (
            <div className={"row m-0 p-0 mb-2 " + this.buttonsConfig()}>
                {this.props.list[this.props.position - 1] &&
                    <a
                        title={strings.dexentr +
                            "#" + this.props.list[this.props.position - 1][1].Number + " " +
                            this.props.list[this.props.position - 1][0]}
                        href={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" +
                            encodeURIComponent(this.props.list[this.props.position - 1][0])}
                    ><i class="fas fa-angle-double-left fa-2x clickable"></i></a>
                }
                {this.props.list[this.props.position + 1] &&
                    <a
                        title={strings.dexentr +
                            "#" + this.props.list[this.props.position + 1][1].Number + " " +
                            this.props.list[this.props.position + 1][0]}
                        href={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" +
                            encodeURIComponent(this.props.list[this.props.position + 1][0])}
                    ><i class="fas fa-angle-double-right fa-2x clickable"></i></a>}
            </div>
        );
    }
}


export default NavigationBlock;