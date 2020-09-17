import React from "react"
import { Link } from "react-router-dom"

import { returnRateStyle } from "../../../../../js/indexFunctions.js"

import "./PvpSingleCell.scss"

class PvpSingleCell extends React.PureComponent {
    render() {
        return (
            <td className="m-0 p-0 align-middle" >
                <Link className={"pvp-singlecell__rate rate-color" + returnRateStyle(this.props.rate)[1]}
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

export default PvpSingleCell;
