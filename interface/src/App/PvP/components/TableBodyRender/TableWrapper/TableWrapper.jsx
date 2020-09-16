import React from "react"

import "./TableWrapper.scss"

const TableWrapper = React.memo(function (props) {
    return (
        <table className={"table-wrapper table table-sm table-hover text-center mb-0 " + (props.class ? props.class : "")} >
            {props.table}
        </table>
    )
});

export default TableWrapper