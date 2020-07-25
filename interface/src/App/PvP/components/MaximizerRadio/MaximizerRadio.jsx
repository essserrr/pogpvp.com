import React, { PureComponent } from "react";
import SingleRadio from "./SingleRadio"
import SubmitButton from "../SubmitButton/SubmitButton"

import LocalizedStrings from "react-localization";
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

let strings = new LocalizedStrings(locale);

class MaximizerRadio extends PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            stat: this.props.defaultOptions ? this.props.defaultOptions.stat : "Overall",
            level: this.props.defaultOptions ? this.props.defaultOptions.level : "40",
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    render() {
        return (
            <div className="maximizer">
                <form className="mx-0">
                    <div className="d-flex justify-content-around">
                        <SingleRadio
                            name="stat"
                            value="Overall"
                            label={strings.maximizer.overall}
                            checked={this.state.stat === "Overall"}
                            onChange={this.onChange}
                            attr={this.props.attr}
                        />
                        <SingleRadio
                            name="stat"
                            value="Atk"
                            label={strings.effStats.atk}
                            checked={this.state.stat === "Atk"}
                            onChange={this.onChange}
                            attr={this.props.attr}
                        />
                        <SingleRadio
                            name="stat"
                            value="Def"
                            label={strings.effStats.def}
                            checked={this.state.stat === "Def"}
                            onChange={this.onChange}
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
                            checked={this.state.level === "40"}
                            onChange={this.onChange}
                            attr={this.props.attr}
                        />
                        <SingleRadio
                            name="level"
                            value="41"
                            label="41"
                            checked={this.state.level === "41"}
                            onChange={this.onChange}
                            attr={this.props.attr}
                        />
                    </div>
                </form>
                <div className="d-flex justify-content-around mx-0 px-0 mt-1" >
                    <SubmitButton
                        class="maximizerButton btn btn-primary btn-sm  mx-0"
                        stat={this.state.stat}
                        level={this.state.level}
                        attr={this.props.attr}
                        action="Maximize"
                        label={strings.maximizer.maximize}
                        onSubmit={this.props.maximizerSubmit} />

                    <SubmitButton
                        class="maximizerButton btn btn-primary btn-sm mx-0"
                        stat={this.state.stat}
                        level={this.state.level}
                        attr={this.props.attr}
                        action="Default"
                        label={strings.maximizer.default}
                        onSubmit={this.props.maximizerSubmit} />
                </div>
            </div>
        );
    }
}

export default MaximizerRadio;