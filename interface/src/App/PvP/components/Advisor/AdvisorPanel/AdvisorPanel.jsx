import React from "react";
import { UnmountClosed } from "react-collapse";

import PokemonIconer from "../../PokemonIconer/PokemonIconer"
import AdvisorPanelBody from "./AdvisorPanelBody"

import { ReactComponent as Shadow } from "../../../../../icons/shadow.svg";
import { getAbbriviation } from "./getMovesAbbriviation"

import "./AdvisorPanel.scss"


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
            <div className={"pokCard bigFont row m-0 py-1 justify-content-between"}>
                <div className={"col d-flex p-0"}>

                    <span className="mx-2 align-self-center ">{"#" + (this.props.i + 1)}</span>

                    <div className="col-auto px-0 mx-1 mx-sm-2 text-center advisorbody--minwidth">
                        <div className="col-auto px-0 posRel">
                            {(this.props.first.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                            <PokemonIconer
                                src={this.props.pokemonTable[this.props.first.name].Number + (this.props.pokemonTable[this.props.first.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.first.name].Forme : "")}
                                class={"icon48"} />

                        </div>
                        <div className="col-auto px-0 advisorbody__text">
                            {getAbbriviation(this.props.first.QuickMove, this.props.first.ChargeMove1, this.props.first.ChargeMove2,
                                this.props.first.name, this.props.pokemonTable)}
                        </div>
                    </div>

                    <div className="col-auto px-0 mx-1 mx-sm-2 text-center advisorbody--minwidth">
                        <div className="col-auto px-0 posRel">
                            {(this.props.second.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                            <PokemonIconer
                                src={this.props.pokemonTable[this.props.second.name].Number + (this.props.pokemonTable[this.props.second.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.second.name].Forme : "")}
                                class={"icon48"} />
                        </div>
                        <div className="col-auto px-0 advisorbody__text">
                            {getAbbriviation(this.props.second.QuickMove, this.props.second.ChargeMove1, this.props.second.ChargeMove2,
                                this.props.second.name, this.props.pokemonTable)}
                        </div>
                    </div>

                    <div className="col-auto px-0 mx-1 mx-sm-2 text-center advisorbody--minwidth">
                        <div className="col-auto px-0 posRel">
                            {(this.props.third.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                            <PokemonIconer
                                src={this.props.pokemonTable[this.props.third.name].Number + (this.props.pokemonTable[this.props.third.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.third.name].Forme : "")}
                                class={"icon48"} />
                        </div>
                        <div className="col-auto px-0 advisorbody__text">
                            {getAbbriviation(this.props.third.QuickMove, this.props.third.ChargeMove1, this.props.third.ChargeMove2,
                                this.props.third.name, this.props.pokemonTable)}
                        </div>
                    </div>

                </div>

                <div className="col-auto mx-auto align-self-center ">
                    <i className="fas fa-skull-crossbones mr-1"></i>
                    {this.props.list[this.props.i].zeros.length}
                </div>
                <div className="col-auto mx-auto align-self-center ">
                    <i className="fas fa-trophy mr-1"></i>
                    {(this.props.list[this.props.i].rate / 3).toFixed(1)}
                </div>

                <i onClick={this.onClick}
                    className={"clickable align-self-center mr-3 " +
                        (this.state.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg")}></i>
                <div className={"col-12 p-0 " + (this.state.showCollapse ? "borderTop" : "")}>
                    <UnmountClosed isOpened={this.state.showCollapse}>
                        {this.state.colElement}
                    </UnmountClosed>
                </div>
            </div>

        );
    }
};

export default AdvisorPanel;
/*
<div className="col-auto px-0">
                            {this.props.third.QuickMove.replace(/[a-z -]/g, "")}
                            {(this.props.third.ChargeMove1 || this.props.third.ChargeMove2) ? "+" : ""}
                            {this.props.third.ChargeMove1 ? (this.props.third.ChargeMove1.replace(/[a-z -]/g, "")) : ""}
                            {(this.props.third.ChargeMove1 && this.props.third.ChargeMove2) ? "/" : ""}
                            {this.props.third.ChargeMove2 ? (this.props.third.ChargeMove2.replace(/[a-z -]/g, "")) : ""}
                        </div>
{this.props.third.QuickMove.replace(/[a-z -]/g, "") + props.addStar(props.pok.name, props.pok.QuickMove)}
{(props.pok.ChargeMove1 || props.pok.ChargeMove2) ? "+" : ""}
{props.pok.ChargeMove1 ? (props.pok.ChargeMove1.replace(/[a-z -]/g, "") + props.addStar(props.pok.name, props.pok.ChargeMove1)) : ""}
{(props.pok.ChargeMove1 && props.pok.ChargeMove2) ? "/" : ""}
{props.pok.ChargeMove2 ? (props.pok.ChargeMove2.replace(/[a-z -]/g, "") + props.addStar(props.pok.name, props.pok.ChargeMove2)) : ""}

*/