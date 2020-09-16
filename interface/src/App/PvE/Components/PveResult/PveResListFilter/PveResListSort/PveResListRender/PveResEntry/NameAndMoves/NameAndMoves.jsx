import React from "react"

import WeatherMoves from "../WeatherMoves/WeatherMoves"
import { calculateCP, calculateEffStat } from "../../../../../../../../../js/indexFunctions"

import "./NameAndMoves.scss"

class NameAndMoves extends React.PureComponent {
    render() {

        return (<>
            <div className="col-12 d-flex p-0 align-items-center">
                <div className="name-and-move__title mr-1">
                    {this.props.formattedName.Name}
                </div>
                <WeatherMoves
                    pokQick={this.props.quick}
                    pokCh={this.props.charge}
                    weather={this.props.snapshot.pveObj.Weather}
                />
            </div>
            <div className="name-and-move--text col-12 p-0">
                {"CP "} {calculateCP(this.props.name, this.props.snapshot[this.props.attr].Lvl, this.props.snapshot[this.props.attr].Atk, this.props.snapshot[this.props.attr].Def, this.props.snapshot[this.props.attr].Sta, this.props.pokemonTable)}
                {" / HP "} {calculateEffStat(this.props.name, this.props.snapshot[this.props.attr].Lvl, this.props.snapshot[this.props.attr].Sta, 0, this.props.pokemonTable, "Sta", false)}
                {this.props.formattedName.Additional && (" / " + this.props.formattedName.Additional)}
            </div>
        </>
        )
    }
};

export default NameAndMoves;


