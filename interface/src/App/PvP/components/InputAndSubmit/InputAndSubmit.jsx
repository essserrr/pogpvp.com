import React from "react";
import SubmitButton from "../SubmitButton/SubmitButton"
import Input from "../Input/Input"
import Errors from "../Errors/Errors"
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
                {this.state.isError && <Errors class="alert alert-danger p-2 mt-2" value={this.state.error} />}
                <ReactTooltip
                    className={"infoTip"}
                    id={"partyNameInput" + this.props.attr} effect="solid"
                    place={"top"}
                    multiline={true}
                >{this.props.tip}</ReactTooltip>

                <div className="row justify-content-center px-2">
                    <Input
                        name="partyName"
                        class="col-11 mb-2"
                        place={this.props.placeholder}
                        for={"partyNameInput" + this.props.attr}
                        value={this.state.value}
                        onChange={this.onChange}
                    />
                    <SubmitButton
                        action={this.props.action}
                        label={this.props.label}
                        attr={this.props.attr}
                        onSubmit={this.onSubmit}
                        class="submit-button btn btn-primary btn-sm p-0 m-0"
                    />
                </div>
            </>
        )
    }

}

export default InputAndSubmit