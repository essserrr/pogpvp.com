import React from "react"
import ReactTooltip from "react-tooltip"

import PokemonIconer from "../../../../../../../PokemonIconer/PokemonIconer"
import { ReactComponent as Shadow } from "../../../../../../../../../../icons/shadow.svg"

import "./ZeroPokemon.scss"

class ZeroPokemon extends React.PureComponent {

    render() {
        return (
            <div className="zero-pok__container">
                {this.props.shadow && <Shadow className="zero-pok__shadow" />}
                <PokemonIconer
                    src={this.props.src}
                    class={"zero-pok__pok mr-2"}
                    for={this.props.for}
                />
                <ReactTooltip
                    className={"infoTip"}
                    id={this.props.for} effect="solid"
                    place={"right"}
                    multiline={true}
                >
                    {this.props.name + (this.props.shadow ? " (" + this.props.shadow + ")" : "")}
                </ReactTooltip>
            </div>

        );
    }
};

export default ZeroPokemon;
