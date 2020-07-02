import React from "react";
import DropWithArrow from "../../PvpRating/DropWithArrow/DropWithArrow"

class CollBlock extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showCollapse: this.props.defOpen,
        };
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
        })
    }

    render() {
        return (
            <DropWithArrow
                onShow={this.onClick}
                show={this.state.showCollapse}
                title={this.props.locale}
                elem={this.props.elem}

                faOpened="align-self-center fas fa-angle-up fa-lg "
                faClosed="align-self-center fas fa-angle-down fa-lg"

                outClass="row justify-content-between m-0 p-0 pb-1 mt-2 clickable"
                midClass="dexFont font-weight-bold"
                inClass="row m-0 p-0" />

        );
    }
}

export default CollBlock;