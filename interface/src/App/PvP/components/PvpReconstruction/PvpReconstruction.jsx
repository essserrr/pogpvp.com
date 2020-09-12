import React from "react"

import TimelineGenerator from "./TimelineGenerator/TimelineGenerator"
import ReconstructionButton from "./ReconstructionButton/ReconstructionButton"

import "./PvpReconstruction.scss"

class PvpReconstruction extends React.PureComponent {
    constructor(props) {
        super(props);
        this.reconstruction = React.createRef();

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
        this.reconstruction.current.focus();
    };

    onEnableConstructor(event) {
        this.setState({
            constructor: !this.state.constructor,
        })
    }

    render() {
        return (
            <div className="row m-0">
                <div className="col-12 p-0 text-right">
                    <ReconstructionButton
                        enabled={this.state.constructor}
                        onClick={this.onEnableConstructor}
                    />
                </div>
                <div className="col-12 p-0">
                    <div className={"pvp-reconstruction__timeline " + (this.state.constructor ? "pvp-reconstruction__modeon" : "")} tabIndex="0" ref={this.reconstruction} >
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


export default PvpReconstruction;