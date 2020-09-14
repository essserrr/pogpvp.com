import React from "react"
import { Link } from "react-router-dom"

import { returnRateStyle } from "../../../../../js/indexFunctions.js"

class SinglePvpCell extends React.PureComponent {
    render() {
        return (
            <td className="tableBorder matrixColor font80 m-0 p-0 align-middle" >
                <Link className={"rateSquare hover rateColor" + returnRateStyle(this.props.rate)[1]}
                    to={{
                        pathname: this.props.query,
                        state: { needsUpdate: true }
                    }}>
                    {this.props.rate}
                </Link>
            </td >
        );
    }
};

export default SinglePvpCell;
