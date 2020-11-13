import React from "react";

import Alert from '@material-ui/lab/Alert';

import Button from "App/Components/Button/Button";
import Input from "App/Components/Input/Input";
import ReactTooltip from "react-tooltip"

class InputAndSubmit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            isError: false,
            error: "",
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.state.value === "") {
            this.setState({
                isError: true,
                error: this.props.errortext,
            })
            return
        }
        this.setState({
            isError: false,
            error: "",
        })
        this.props.onChange({ action: this.props.action, value: this.state.value, attr: this.props.attr, })
    }

    onChange(event) {
        if (event.target.value.length > 15) {
            return
        }
        this.setState({
            value: event.target.value,
        })
    }

    render() {
        return (
            <>
                {this.state.isError && <Alert variant="filled" severity="error">{this.state.error}</Alert >}
                <ReactTooltip
                    className={"infoTip"}
                    id={"partyNameInput" + this.props.attr} effect="solid"
                    place={"top"}
                    multiline={true}
                >{this.props.tip}</ReactTooltip>

                <div className="row justify-content-center px-2">
                    <Input
                        name="partyName"
                        label={this.props.placeholder}
                        value={this.state.value}
                        onChange={this.onChange}
                    />


                    <Button
                        title={this.props.label}
                        onClick={this.onSubmit}
                        attr={this.props.attr}
                    />

                </div>
            </>
        )
    }

}

export default InputAndSubmit