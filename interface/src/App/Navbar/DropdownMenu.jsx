import React from "react";

export default class DropdownMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    onClick = () => this.setState({ showDropdown: !this.state.showDropdown });
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    handleClickOutside(event) {
        if (this.state.showDropdown && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ showDropdown: false });
        }
    }


    render() {
        return (
            <li className="nav-item dropdown clickable noselect" ref={this.setWrapperRef} onClick={this.onClick}>
                <div className="nav-link dropdown-toggle"
                    id="navbarDropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    {this.props.label}
                </div>
                <div className={(this.state.showDropdown) ? "dropdown-menu show" : "dropdown-menu"}
                    aria-labelledby="navbarDropdownMenuLink"
                    onClick={this.onClick}
                >
                    {this.props.list}
                </div>
            </li>
        );
    }
}


