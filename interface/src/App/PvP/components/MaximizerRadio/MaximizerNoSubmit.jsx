import React, { PureComponent } from "react";
import SingleRadio from "./SingleRadio"

import LocalizedStrings from "react-localization";
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);

class MaximizerNoSubmit extends PureComponent {
    render() {
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        return (
            <div className="maximizer">
                <form className="mx-0">
                    <div className="d-flex justify-content-around">
                        <SingleRadio
                            name="stat"
                            value="Overall"
                            label={strings.maximizer.overall}
                            action={this.props.action}
                            checked={this.props.value.stat === "Overall"}
                            onChange={this.props.onChange}
                            attr={this.props.attr}
                        />
                        <SingleRadio
                            name="stat"
                            value="Atk"
                            label={strings.effStats.atk}
                            action={this.props.action}
                            checked={this.props.value.stat === "Atk"}
                            onChange={this.props.onChange}
                            attr={this.props.attr}
                        />
                        <SingleRadio
                            name="stat"
                            value="Def"
                            label={strings.effStats.def}
                            action={this.props.action}
                            checked={this.props.value.stat === "Def"}
                            onChange={this.props.onChange}
                            attr={this.props.attr}
                        />
                    </div>

                    <div className="d-flex justify-content-around" >
                        <span className="fBolder align-self-center">
                            {strings.maximizer.levelTitle}
                        </span>


                        <SingleRadio
                            name="level"
                            value="40"
                            label="40"
                            action={this.props.action}
                            checked={this.props.value.level === "40"}
                            onChange={this.props.onChange}
                            attr={this.props.attr}
                        />
                        <SingleRadio
                            name="level"
                            value="41"
                            label="41"
                            action={this.props.action}
                            checked={this.props.value.level === "41"}
                            onChange={this.props.onChange}
                            attr={this.props.attr}
                        />
                    </div>
                    <div className="d-flex justify-content-around">

                        <SingleRadio
                            name="action"
                            value="Maximize"
                            label={strings.maximizer.maximize}
                            action={this.props.action}
                            checked={this.props.value.action === "Maximize"}
                            onChange={this.props.onChange}
                            attr={this.props.attr}
                        />
                        <SingleRadio
                            name="action"
                            value="Default"
                            label={strings.maximizer.default}
                            action={this.props.action}
                            checked={this.props.value.action === "Default"}
                            onChange={this.props.onChange}
                            attr={this.props.attr}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

export default MaximizerNoSubmit;