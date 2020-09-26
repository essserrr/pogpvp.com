import React, { PureComponent } from "react"

import "./CloseButton.scss"

class CloseButton extends PureComponent {
    render() {
        return (
            <button
                onClick={this.props.onClick}
                type="button"
                className="close-button"
                aria-label="Close"
            >
                <span name="closeButton" attr={this.props.attr} index={this.props.index} aria-hidden="true">&times;</span>
            </button>
        );
    }
}

export default CloseButton;