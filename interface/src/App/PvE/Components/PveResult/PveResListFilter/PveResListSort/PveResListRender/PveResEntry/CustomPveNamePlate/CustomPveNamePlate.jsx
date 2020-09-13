import React from "react"

import PlateGroup from "./PlateGroup/PlateGroup"

class CustomPveNamePlate extends React.PureComponent {

    render() {
        return (
            <div className="col-12 px-0">
                <div className="row mx-0 justify-content-around my-2">
                    {this.props.pokemonRes.Party.length > 0 &&
                        <PlateGroup
                            attr={this.props.attr}
                            i={this.props.i}
                            subGroup={0}

                            moveTable={this.props.moveTable}
                            pokemonTable={this.props.pokemonTable}

                            party={this.props.pokemonRes.Party.slice(0, this.props.pokemonRes.Party.length > 6 ? 6 : this.props.pokemonRes.Party.length)}

                            defineBreakpoints={this.props.defineBreakpoints}
                        />}
                    {this.props.pokemonRes.Party.length > 6 && <PlateGroup
                        attr={this.props.attr}
                        i={this.props.i}
                        subGroup={1}

                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}

                        party={this.props.pokemonRes.Party.slice(6, this.props.pokemonRes.Party.length > 12 ? 12 : this.props.pokemonRes.Party.length)}

                        defineBreakpoints={this.props.defineBreakpoints}
                    />}
                    {this.props.pokemonRes.Party.length > 12 && <PlateGroup
                        attr={this.props.attr}
                        i={this.props.i}
                        subGroup={2}

                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}

                        party={this.props.pokemonRes.Party.slice(12, this.props.pokemonRes.Party.length)}

                        defineBreakpoints={this.props.defineBreakpoints}
                    />}
                </div>
            </div>
        );
    }
};

export default CustomPveNamePlate;


