import React from "react";

class Errors extends React.PureComponent {
    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };
    focusDiv() {
        this.refs.errorBox.focus();
    };
    render() {
        return (
            <div data-nosnippet className={"text-center " + (this.props.class ? this.props.class : "")} tabIndex="0" ref="errorBox">
                {this.props.value}
            </div>
        )
    }

}

export default Errors;