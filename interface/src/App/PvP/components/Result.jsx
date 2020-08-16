import React from "react";
import ResultsTable from "./ResultsTable/ResultsTable"

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
                <ResultsTable
                    value={this.props.value}
                    table={this.props.table}
                    class={this.props.class}
                />
            </div>
        );
    }
};

export default Result;
