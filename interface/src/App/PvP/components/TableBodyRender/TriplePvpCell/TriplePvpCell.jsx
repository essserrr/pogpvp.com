import React from "react"
import { Link } from "react-router-dom"

import { returnRateStyle } from "../../../../../js/indexFunctions.js"

class TriplePvpCell extends React.PureComponent {
    render() {
        const rate00 = returnRateStyle(this.props.rate0)
        const rate11 = returnRateStyle(this.props.rate1)
        const rate22 = returnRateStyle(this.props.rate2)
        const rateOverall = returnRateStyle(this.props.overallRating)

        return (
            <td className="tripleWidth tableBorder font80 p-0 m-0 px-1 align-middle" >
                <div className="matrixTriple row justify-content-center m-0 p-0 mr-auto ml-auto">
                    <Link className={"col-4 m-0 p-0 text-center hover rateColor" + rate00[1]}
                        to={{
                            pathname: this.props.queries[0],
                            state: { needsUpdate: true }
                        }}>
                        {rate00[0]}
                    </Link>
                    <Link className={"col-4 m-0 p-0 text-center  hover  rateColor" + rate11[1]}
                        to={{
                            pathname: this.props.queries[1],
                            state: { needsUpdate: true }
                        }}>
                        {rate11[0]}
                    </Link>
                    <Link className={"col-4 m-0 p-0 text-center hover rateColor" + rate22[1]}
                        to={{
                            pathname: this.props.queries[2],
                            state: { needsUpdate: true }
                        }}>
                        {rate22[0]}
                    </Link>
                    <div className={" col-12 m-0 p-0 rateColor" + rateOverall[1]}>
                        {this.props.overallRating}
                    </div>

                </div>
            </td >
        );
    }
};

export default TriplePvpCell;
