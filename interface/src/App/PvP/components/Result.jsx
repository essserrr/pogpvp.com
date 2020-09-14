import React from "react"

import SinglePvpResults from "./SinglePvpResults/SinglePvpResults"
import TableWrapper from "./TableWrapper/TableWrapper"

class Result extends React.PureComponent {

    constructor(props) {
        super(props);
        this.matrixres = React.createRef();
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };

    focusDiv() {
        this.matrixres.current.focus();
    };

    render() {
        return (
            <div tabIndex="0" ref={this.matrixres}>
                {this.props.isSingle ?
                    <SinglePvpResults
                        value={this.props.value}
                        class={this.props.class}
                    /> :

                    <TableWrapper
                        table={this.props.table}
                        class={this.props.class}
                    />}
            </div>
        );
    }
};

export default Result;
