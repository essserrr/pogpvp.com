import React from "react";

import TimelineGenerator from "./TimelineGenerator"
import ReactTooltip from "react-tooltip"
import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { getCookie } from '../../../../js/indexFunctions'

let strings = new LocalizedStrings(locale);

class Reconstruction extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            constructor: false,
        };
        this.onEnableConstructor = this.onEnableConstructor.bind(this);
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

    onEnableConstructor(event) {
        this.setState({
            constructor: !this.state.constructor,
        })
    }

    render() {
        return (
            <div className="row m-0 p-0">
                <div className="col-12 m-0 p-0 text-right">
                    <ReactTooltip
                        className={"strategyTips"}
                        id={"constructorButton"} effect='solid'
                        place={"top"}
                        multiline={true}>
                        {strings.tips.constructor}
                    </ReactTooltip>
                    <div
                        data-tip data-for={"constructorButton"}
                        onClick={this.onEnableConstructor}
                        className={"clickable ml-auto mb-1 constructorButton " + (this.state.constructor ? "on" : "")} >
                        {strings.reconstruction.contructor}
                    </div>
                </div>
                <div className="col-12 m-0 p-0">
                    <div className={"timeline " + (this.state.constructor ? "modeon" : "")} tabIndex="0" ref="reconstruction" >
                        <table cellSpacing="0" cellPadding="0" border="0" style={{ width: "100%", justifyContent: "center", }} >
                            <tbody >
                                <TimelineGenerator
                                    log={this.props.value.Log}
                                    moveTable={this.props.moveTable}
                                    onMouseEnter={this.props.onMouseEnter}
                                    constructorOn={this.state.constructor ? this.props.constructorOn : null}
                                />
                            </tbody>
                        </table >
                    </div>
                </div>
            </div>
        )
    }

}


export default Reconstruction;