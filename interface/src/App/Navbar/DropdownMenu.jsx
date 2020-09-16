import React from "react"

import "./DropdownMenu.scss"

export default class DropdownMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();

        this.state = {
            showDropdown: false,
        };
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    onClick = () => this.setState({ showDropdown: !this.state.showDropdown });
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }
    handleClickOutside(event) {
        if (this.state.showDropdown && this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ showDropdown: false });
        }
    }


    render() {
        return (
            <li className={"cust-dropdown-menu nav-item dropdown " + (this.props.class ? this.props.class : "")}
                ref={this.wrapperRef} onClick={this.onClick}>
                <div className="cust-dropdown-menu--font  nav-link dropdown-toggle d-flex align-items-center"
                    id="navbarDropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    {this.props.label}
                </div>
                <div className={(this.props.dropClass ? this.props.dropClass : "")
                    + ((this.state.showDropdown) ? " dropdown-menu show" : " dropdown-menu")}
                    aria-labelledby="navbarDropdownMenuLink"
                    onClick={this.onClick}
                >
                    {this.props.list}
                </div>
            </li>
        );
    }
}


