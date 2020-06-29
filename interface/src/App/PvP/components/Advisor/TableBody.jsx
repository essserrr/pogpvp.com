import React from "react";

const TableBody = React.memo(function Pokemon(props) {
    var arrWithTr = []
    for (let i = 1; i < props.value.length; i++) {
        arrWithTr.push(
            <tr key={"tableline" + i}>
                {props.value[i]}
            </tr>
        )
    }

    return (
        <>
            <thead key={"thead0"} className="thead thead-light" >
                <tr >
                    {props.value[0]}
                </tr>
            </thead>
            <tbody key={"tablebody"} className="modifiedBorderTable">
                {arrWithTr}
            </tbody>
        </>
    )
});

export default TableBody;