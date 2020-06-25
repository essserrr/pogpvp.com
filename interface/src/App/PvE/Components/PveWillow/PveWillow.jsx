import React from "react";

import LocalizedStrings from 'react-localization';
import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie, tierHP, weather, culculateCP } from '../../../../js/indexFunctions'
import PokemonIconer from "../../../PvP/components/PokemonIconer/PokemonIconer"
import WeatherList from "./WeatherList"

let pvestrings = new LocalizedStrings(pveLocale);

class PveWillow extends React.PureComponent {
    constructor(props) {
        super(props);
        pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            n: 1,
            breakpoints: false,
        };
    }

    isBoosted() {
        for (let i = 0; i < this.props.pokemonTable[this.props.snapshot.bossObj.Name].Type.length; i++) {
            if (weather[this.props.snapshot.pveObj.Weather][this.props.pokemonTable[this.props.snapshot.bossObj.Name].Type[i]]) {
                return true
            }
        }
        return false
    }

    render() {
        let boost = this.isBoosted()
        return (
            <div className="col-12  d-flex justify-content-center m-0 p-0">
                <PokemonIconer
                    src="willow3"
                    folder="/"
                    class={"willow p-2"} />
                <div className="bubbleText long posAbsB px-2 py-1">
                    {pvestrings.willow1}<span className="fontBolder">{this.props.snapshot.bossObj.Name}</span>.
                    {pvestrings.willow2}<span className="fontBolder">{tierHP[this.props.snapshot.bossObj.Tier]}</span>
                    {pvestrings.willow3}<span className="fontBolder">{(this.props.snapshot.bossObj.Tier > 3 ? 300 : 180) + pvestrings.s}</span>.
                    {pvestrings.willow4}<span className="fontBolder">
                        {pvestrings.weatherList[this.props.snapshot.pveObj.Weather]}
                        {(this.props.snapshot.pveObj.Weather > 0) && <PokemonIconer
                            folder="/weather/"
                            src={this.props.snapshot.pveObj.Weather}
                            class={"icon18"} />}
                    </span>
                    {(this.props.snapshot.pveObj.Weather > 0) && <>.{pvestrings.willow6}: </>}
                    {(this.props.snapshot.pveObj.Weather > 0) && <span className="fontBolder">
                        <WeatherList
                            weather={this.props.snapshot.pveObj.Weather} />
                    </span>}.

                    {pvestrings.willow5}<span className="fontBolder">{boost ? pvestrings.boosted : pvestrings.normal}</span>
                    <span className="fontBolder">
                        {culculateCP(
                            this.props.snapshot.bossObj.Name,
                            boost ? 25 : 20,
                            10,
                            10,
                            10,
                            this.props.pokemonTable
                        )}-
                        {culculateCP(
                            this.props.snapshot.bossObj.Name,
                            boost ? 25 : 20,
                            15,
                            15,
                            15,
                            this.props.pokemonTable
                        )}
                    </span>.
                </div>
            </div>
        )
    }

}


export default PveWillow;