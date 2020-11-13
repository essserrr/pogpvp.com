import React from "react"
import ReactTooltip from "react-tooltip"

import Iconer from "App/Components/Iconer/Iconer";
import { ReactComponent as Shadow } from "../../../../../../../../../../icons/shadow.svg"

import "./ZeroPokemon.scss"

class ZeroPokemon extends React.PureComponent {

    render() {
        return (
            <div className="zero-pok__container">
                {this.props.shadow && <Shadow className="zero-pok__shadow" />}

                <Iconer folderName="/pokemons/" fileName={this.props.src} className={"mr-2"} size={48} />

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
