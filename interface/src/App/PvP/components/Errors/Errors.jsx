import React from "react";

class Errors extends React.PureComponent {
    constructor(props) {
        super(props);
        this.errorBox = React.createRef();
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };
    focusDiv() {
        this.errorBox.current.focus();
    };
    render() {
        return (
            <div data-nosnippet className={"fBolder text-center " + (this.props.class ? this.props.class : "")} tabIndex="0" ref={this.errorBox}>
                {this.props.value}
            </div>
        )
    }

}

export default Errors;