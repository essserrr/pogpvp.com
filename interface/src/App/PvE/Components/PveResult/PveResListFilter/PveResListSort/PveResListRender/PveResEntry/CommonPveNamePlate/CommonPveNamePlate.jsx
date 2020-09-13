import React from "react"

import PokemonIconer from "../../../../../../../../PvP/components/PokemonIconer/PokemonIconer"
import NameAndMoves from "../../../../../NameAndMoves/NameAndMoves"
import NumberAndIcon from "../../../../../NumberAndIcon/NumberAndIcon"
import { extractName } from "../../../../../../../../../js/indexFunctions"

class CommonPveNamePlate extends React.PureComponent {
    render() {
        const partyLen = this.props.pokemonRes.Party.length
        return (
            <>
                <div className="col-auto p-0 mr-1">
                    <div className="row mx-0 justify-content-start">
                        <NumberAndIcon
                            isShadow={String(this.props.pokemonRes.Party[partyLen - 1].IsShadow) === "true" ? true : false}
                            pok={this.props.pokemonTable[this.props.pokemonRes.Party[partyLen - 1].Name]}
                            index={"#" + (this.props.i + 1)}
                        />
                        <div className="col px-0">
                            <NameAndMoves
                                formattedName={extractName(this.props.pokemonRes.Party[partyLen - 1].Name)}
                                quick={this.props.moveTable[this.props.pokemonRes.Party[partyLen - 1].Quick]}
                                charge={this.props.moveTable[this.props.pokemonRes.Party[partyLen - 1].Charge]}
                                snapshot={this.props.snapshot}

                                attr="attackerObj"
                                name={this.props.pokemonRes.Party[partyLen - 1].Name}
                                pokemonTable={this.props.pokemonTable}
                            />
                        </div>
                    </div>
                </div>


                {partyLen > 1 && <div className="col-auto p-0 mr-3">
                    <div className="row mx-0 justify-content-start align-items-center">
                        <NumberAndIcon
                            index={<PokemonIconer src={"mega"} folder="/" class={"icon24"} />}
                            isShadow={false}
                            pok={this.props.pokemonTable[this.props.pokemonRes.Party[0].Name]}
                        />
                        <div className="col px-0">
                            <NameAndMoves
                                formattedName={extractName(this.props.pokemonRes.Party[0].Name)}
                                quick={this.props.moveTable[this.props.pokemonRes.Party[0].Quick]}
                                charge={this.props.moveTable[this.props.pokemonRes.Party[0].Charge]}
                                snapshot={this.props.snapshot}

                                attr="supportPokemon"
                                name={this.props.pokemonRes.Party[0].Name}
                                pokemonTable={this.props.pokemonTable}
                            />
                        </div>
                    </div>
                </div>}
            </>
        );
    }
};

export default CommonPveNamePlate;


