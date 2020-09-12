import React from "react"
import { Link } from "react-router-dom"

import PokemonIconer from "../../../PvP/components/PokemonIconer/PokemonIconer"

class RaidAuthFailed extends React.Component {
    constructor(props) {
        super();
        this.notFound = React.createRef();
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };

    focusDiv() {
        this.notFound.current.focus();
    };


    render() {
        return (
            <>
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2 mt-4">
                        <div className="singleNews col-sm-12 col-md-7 col-lg-5 p-0 pb-4">
                            <div className="row  justify-content-center m-0 mt-3"  >
                                <div className="align-self-center">
                                    <PokemonIconer
                                        src={"ooops"}
                                        folder="/"
                                        class={"ooopsIcon"} />
                                </div>
                                <h5 className="col-12 mt-2 font-weight-bold align-self-center text-center ">
                                    {this.props.description}
                                </h5>
                                <div tabIndex="0" ref={this.notFound}></div>
                                <Link title={this.props.linkTitle}
                                    className="row ml-2 mr-1 linkText font-weight-bold text-center"
                                    to={this.props.link}>
                                    <i className="fas fa-angle-double-left align-self-center  mr-1"></i>
                                    {this.props.linkTitle}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default RaidAuthFailed

