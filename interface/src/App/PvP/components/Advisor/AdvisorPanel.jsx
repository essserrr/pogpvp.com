import React from "react";
import { UnmountClosed } from "react-collapse";

import PokemonIconer from "../PokemonIconer/PokemonIconer"
import AdvisorPanelBody from "./AdvisorPanelBody"

import { ReactComponent as Shadow } from "../../../../icons/shadow.svg";





class AdvisorPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showCollapse: false,
            colElement: null,
        };
        this.onClick = this.onClick.bind(this);
    }


    onClick(event) {
        this.setState({
            showCollapse: !this.state.showCollapse,
            colElement: !this.state.showCollapse ? <AdvisorPanelBody {...this.props} /> : null,
        })

    }

    render() {
        return (
            <div className={"cardBig row m-0 p-0 py-1 justify-content-between"}>
                <div className={"row m-0 p-0"}>
                    <div className="ml-2 mr-2 bigText align-self-center ">{"#" + (this.props.i + 1)}</div>
                    <div className="posRel">
                        {(this.props.first.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={this.props.pokemonTable[this.props.first.name].Number + (this.props.pokemonTable[this.props.first.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.first.name].Forme : "")}
                            class={"icon48 ml-1 ml-sm-3  mr-2"} />
                    </div>

                    <div className="posRel">
                        {(this.props.second.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={this.props.pokemonTable[this.props.second.name].Number + (this.props.pokemonTable[this.props.second.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.second.name].Forme : "")}
                            class={"icon48 ml-1 ml-sm-3  mr-2"} />
                    </div>

                    <div className="posRel">
                        {(this.props.third.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={this.props.pokemonTable[this.props.third.name].Number + (this.props.pokemonTable[this.props.third.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.third.name].Forme : "")}
                            class={"icon48 ml-1 ml-sm-3 mr-2"} />
                    </div>
                </div>
                <div className={"row m-0 p-0"}>
                    <div className="mr-2 mr-sm-4 w64 bigText text-center align-self-center ">{this.props.list[this.props.i].zeros.length}</div>
                    <div className="mr-2 mr-sm-4 w64 bigText text-center align-self-center ">{(this.props.list[this.props.i].rate / 3).toFixed(1)}</div>
                    <div onClick={this.onClick} className="clickable align-self-center m-0 p-0  px-3">
                        <i className={this.state.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg"}></i>
                    </div>
                </div>

                <div className={"col-12 m-0 p-0 " + (this.state.showCollapse ? "borderTop" : "")}>
                    <UnmountClosed isOpened={this.state.showCollapse}>
                        {this.state.colElement}
                    </UnmountClosed>
                </div>
            </div>

        );
    }
};

export default AdvisorPanel;
