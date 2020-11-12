import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Iconer from "App/Components/Iconer/Iconer";
import NameAndMoves from "../NameAndMoves/NameAndMoves";
import NumberAndIcon from "../NumberAndIcon/NumberAndIcon";
import { extractName } from "js/indexFunctions";

class CommonPveNamePlate extends React.PureComponent {
    render() {
        const partyLen = this.props.pokemonRes.Party.length
        return (
            <Grid container>

                <Grid item xs={12} container>
                    <Grid item xs="auto">
                        <NumberAndIcon
                            isShadow={String(this.props.pokemonRes.Party[partyLen - 1].IsShadow) === "true"}
                            pok={this.props.pokemonTable[this.props.pokemonRes.Party[partyLen - 1].Name]}
                            index={"#" + (this.props.i + 1)}
                        />
                    </Grid>

                    <Grid item xs>
                        <NameAndMoves
                            formattedName={extractName(this.props.pokemonRes.Party[partyLen - 1].Name)}
                            quick={this.props.moveTable[this.props.pokemonRes.Party[partyLen - 1].Quick]}
                            charge={this.props.moveTable[this.props.pokemonRes.Party[partyLen - 1].Charge]}
                            snapshot={this.props.snapshot}

                            attr="attackerObj"
                            name={this.props.pokemonRes.Party[partyLen - 1].Name}
                            pokemonTable={this.props.pokemonTable}
                        />
                    </Grid>
                </Grid>


                {partyLen > 1 &&
                    <Grid item xs={12} container>
                        <Grid item xs="auto">
                            <NumberAndIcon
                                index={<Iconer fileName={"mega"} folderName="/" size={24} />}
                                isShadow={false}
                                pok={this.props.pokemonTable[this.props.pokemonRes.Party[0].Name]}
                            />
                        </Grid>

                        <Grid item xs>
                            <NameAndMoves
                                formattedName={extractName(this.props.pokemonRes.Party[0].Name)}
                                quick={this.props.moveTable[this.props.pokemonRes.Party[0].Quick]}
                                charge={this.props.moveTable[this.props.pokemonRes.Party[0].Charge]}
                                snapshot={this.props.snapshot}

                                attr="supportPokemon"
                                name={this.props.pokemonRes.Party[0].Name}
                                pokemonTable={this.props.pokemonTable}
                            />
                        </Grid>
                    </Grid>}
            </Grid>
        );
    }
};

export default CommonPveNamePlate;

CommonPveNamePlate.propTypes = {
    snapshot: PropTypes.object,
    i: PropTypes.number,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
    pokemonRes: PropTypes.object,
};