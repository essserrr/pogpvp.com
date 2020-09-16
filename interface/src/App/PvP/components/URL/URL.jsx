import React from "react"

import LabelPrepend from "../SelectGroup/LabelPrepend"
import Input from "../Input/Input"

import "./URL.scss"

class URL extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTip: ""
        };
        this.onClick = this.onClick.bind(this);
    }

    async onClick(event) {
        event.target.select();
        document.execCommand("copy");
        this.setState({
            showTip: true
        })

        await new Promise(res => setTimeout(res, 600));
        this.setState({ showTip: false })
    }

    onChange() {
        //mock on change to avoid lint warnings
    }

    render() {
        return (
            <div className="input-group input-group-sm">
                <LabelPrepend
                    tipClass="infoTip"
                    label={this.props.label}

                    for={this.props.for}
                    tip={this.props.tip}
                    place={this.props.place}
                />
                {this.state.showTip && <div className="url__abstip">
                    {this.props.message}
                </div>}
                <Input
                    class="url__input"
                    value={this.props.value}
                    onClick={this.onClick}
                    onChange={this.onChange}
                    readonly={true}
                />

            </div>
        )
    }

}
export default URL;