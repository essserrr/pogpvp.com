import React from "react"

const TableBody = React.memo(function (props) {
    return (
        <>
            <thead className="thead thead-light" >
                <tr >
                    {props.value[0]}
                </tr>
            </thead>
            <tbody>
                {props.value.slice(1).map((elem, i) => <tr key={"tableline" + i}>{elem}</tr>)}
            </tbody>
        </>
    )
});

export default TableBody;