import React from "react";
import ResultsTable from "./ResultsTable/ResultsTable"

const Result = React.memo(function (props) {
    return (
        <ResultsTable
            value={props.value}
            table={props.table}
            class={props.class}
        />
    );
});

export default Result;
