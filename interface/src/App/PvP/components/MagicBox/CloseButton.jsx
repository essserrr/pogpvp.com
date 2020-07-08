import React, { PureComponent } from "react";

class CloseButton extends PureComponent {
    render() {
        return (
            <button
                onClick={this.props.onClick}
                type="button"
                className={this.props.className}
                aria-label="Close"
            >
                <span name="closeButton" attr={this.props.attr} index={this.props.index} aria-hidden="true">&times;</span>
            </button>
        );
    }
}

export default CloseButton;