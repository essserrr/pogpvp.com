import React from "react"

import FaButton from "../../../PveResult/Breakpoints/FaButton/FaButton"

import "./AddRow.scss"

class AddRow extends React.PureComponent {
    render() {
        return (
            <div className="add-row row m-0 align-items-center justify-content-between">
                <FaButton
                    onClick={this.props.onClick}
                    class="fas fa-plus-circle fa-2x"
                    name={this.props.name}
                />
                <div className="add-row__line col px-0"></div>
            </div>
        )
    }

}


export default AddRow