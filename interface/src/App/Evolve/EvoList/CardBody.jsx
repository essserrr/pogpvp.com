import React, { PureComponent } from 'react';
import Type from "../../PvP/components/CpAndTypes/Type"
import CP from "../../PvP/components/CpAndTypes/CP"
import { typeDecoder } from "../../../js/indexFunctions"

class CardBody extends PureComponent {
    render() {
        return (
            <>
                <div className="col-12 text-center p-0 align-self-start">
                    {(this.props.state.pokemonTable[this.props.name]["Type"][0] !== undefined) && <Type
                        class={"icon18"}
                        code={this.props.state.pokemonTable[this.props.name]["Type"][0]}
                        value={typeDecoder[this.props.state.pokemonTable[this.props.name]["Type"][0]]}
                    />}
                    {(this.props.state.pokemonTable[this.props.name]["Type"][1] !== undefined) && <Type
                        class={"ml-2 icon18"}
                        code={this.props.state.pokemonTable[this.props.name]["Type"][1]}
                        value={typeDecoder[this.props.state.pokemonTable[this.props.name]["Type"][1]]}
                    />}
                </div>
                <div className={"col-12 mt-1 text-center"}>
                    <CP
                        name={this.props.name}
                        Lvl={this.props.state.Lvl}
                        Atk={this.props.state.Atk}
                        Def={this.props.state.Def}
                        Sta={this.props.state.Sta}
                        pokemonTable={this.props.state.pokemonTable}
                    />
                </div>
            </>
        );
    }
}

export default CardBody;