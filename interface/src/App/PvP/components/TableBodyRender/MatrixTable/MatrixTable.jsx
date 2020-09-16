import React from "react"

class MatrixTable extends React.PureComponent {
    render() {
        return (
            <>
                <thead key={"thead0"} className="thead" >
                    <tr >
                        {this.props.tableLines[0]}
                    </tr>
                </thead>
                <tbody key={"tablebody"}>
                    {this.props.tableLines.slice(1).map((elem, i) =>
                        <tr key={"tableline" + i}>
                            {elem}
                        </tr>
                    )}
                </tbody>
            </>
        );
    }
};

export default MatrixTable
