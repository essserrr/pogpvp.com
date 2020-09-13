import React from "react";

const TableBody = React.memo(function (props) {
    return (
        <>
            <thead key={"thead0"} className="thead thead-light" >
                <tr >
                    {props.value[0]}
                </tr>
            </thead>
            <tbody key={"tablebody"} className="tableBorder">
                {props.value.slice(1).map((elem, i) => <tr key={"tableline" + i}>{elem}</tr>)}
            </tbody>
        </>
    )
});

export default TableBody;