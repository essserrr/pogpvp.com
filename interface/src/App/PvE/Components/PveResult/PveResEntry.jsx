import React from "react";
import LocalizedStrings from 'react-localization';
import ReactTooltip from "react-tooltip";
import { UnmountClosed } from 'react-collapse';
import HpBar from "../PhBar/HpBar"

import PokemonIconer from "../../../PvP/components/PokemonIconer/PokemonIconer"
import Type from "../../../PvP/components/CpAndTypes/Type"


import { getCookie, weatherDecoder, culculateCP, calculateEffStat, extractName } from "../../../../js/indexFunctions"
import { pveLocale } from "../../../../locale/pveLocale"
import { locale } from "../../../../locale/locale"

let strings = new LocalizedStrings(locale);
let pveStrings = new LocalizedStrings(pveLocale);


class PveResEntry extends React.PureComponent {

    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            showCollapse: false,
            colElement: null,
        };
        this.onClick = this.onClick.bind(this);

    }

    addStar(pokName, moveName) {
        return (this.props.pokemonTable[pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
            colElement: !this.state.showCollapse ? this.generateBody() : null,
        })

    }



    returnTopEntry() {
        let pok = this.props.pokemonTable[this.props.pokemonRes[0].AName]
        let pokQick = this.props.moveTable[this.props.pokemonRes[0].AQ]
        let pokCh = this.props.moveTable[this.props.pokemonRes[0].ACh]
        let name = extractName(pok.Title)

        let avgStats = this.collect()

        console.log(avgStats)

        return <div className={"cardBig row m-0 p-0 py-1 my-1 justify-content-start"} key={name.Name + pokQick.Title + pokCh.Title}>
            <div className="col-auto d-flex m-0 p-0">
                <div className="ml-1 mr-0 bigText align-self-center ">{"#" + (this.props.i + 1)}</div>
                <PokemonIconer
                    src={pok.Number + (pok.Forme !== "" ? "-" + pok.Forme : "")}
                    class={"icon48 ml-1"} />
            </div>
            <div className="verySmallWidth">
                <div className="col-12 d-flex m-0 p-0 ml-2">
                    <div className="align-self-center bigText mr-1">
                        {name.Name}
                    </div>
                    {weatherDecoder[pokQick.MoveType] === this.props.snapshot.Weather &&
                        <PokemonIconer
                            folder="/weather/"
                            src={this.props.snapshot.Weather}
                            class={"icon18"} />
                    }
                    <div className={"mr-1 align-self-center font90 pveMove typeColor color" + pokQick.MoveType + " text"}>
                        {pokQick.Title}
                    </div>
                    {weatherDecoder[pokCh.MoveType] === this.props.snapshot.Weather &&
                        <PokemonIconer
                            folder="/weather/"
                            src={this.props.snapshot.Weather}
                            class={"icon18"} />
                    }
                    <div className={"align-self-center font90 pveMove typeColor color" + pokCh.MoveType + " text"}>
                        {pokCh.Title}
                    </div>

                </div>
                <div className="col-12 d-flex m-0 p-0 ml-2">
                    {"CP "} {culculateCP(pok.Title, this.props.snapshot.Lvl, this.props.snapshot.Atk, this.props.snapshot.Def, this.props.snapshot.Sta, this.props.pokemonTable)}
                    {" / HP "} {calculateEffStat(pok.Title, this.props.snapshot.Lvl, this.props.snapshot.Sta, 0, this.props.pokemonTable, "Sta", false)}
                    {name.Additional && (" / " + name.Additional)}
                </div>
            </div>
            <div className="col-12 m-0 p-0 mx-2">
                <div className="col-12 m-0 p-0">
                    <HpBar
                        upbound={((this.props.tables.hp[this.props.snapshot.Tier] - this.damageString(avgStats.DMin)) / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}
                        lowbound={((this.props.tables.hp[this.props.snapshot.Tier] - this.damageString(avgStats.DMax)) / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}
                        length={((this.props.tables.hp[this.props.snapshot.Tier] - this.damageString(avgStats.DAvg)) / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}
                    />
                </div>

                <div className="col-12 m-0 p-0">
                    Boss remaining HP: {this.damageString(avgStats.DAvg)}
                    {" (" + this.damageString(avgStats.DMax) + "-" + this.damageString(avgStats.DMin) + ")"}
                    {avgStats.NOfWins > 0 ? " Winrate " + avgStats.NOfWins + "%" : ""}
                </div>
                <i class="fas fa-crosshairs mr-1"></i> {(avgStats.DAvg / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}%
                <i class="far fa-clock ml-3 mr-1"></i>{avgStats.TAvg}{pveStrings.s}
                <i class="fab fa-cloudscale ml-3 mr-1"></i> {(avgStats.DAvg / (this.props.tables.timer[this.props.snapshot.Tier] - avgStats.TAvg)).toFixed(1)}
                <i class="fas fa-skull-crossbones ml-3 mr-1"></i> {avgStats.FMin + "-" + avgStats.FMax}
            </div>
        </div>
    }


    damageString(damage) {
        return this.props.tables.hp[this.props.snapshot.Tier] < damage ? this.props.tables.hp[this.props.snapshot.Tier] : damage
    }


    collect() {
        let obj = {
            DAvg: 0,
            DMax: 0,
            DMin: 999999,
            FMax: 0,
            FMin: 200,
            NOfWins: 0,
            TAvg: 0,
            TMax: 0,
            TMint: 9000,
        }
        for (let i = 0; i < this.props.pokemonRes.length; i++) {
            if (this.props.pokemonRes[i].DMax > obj.DMax) {
                obj.DMax = this.props.pokemonRes[i].DMax
            }
            if (this.props.pokemonRes[i].FMax > obj.FMax) {
                obj.FMax = this.props.pokemonRes[i].FMax
            }
            if (this.props.pokemonRes[i].TMax > obj.TMax) {
                obj.TMax = this.props.pokemonRes[i].TMax
            }

            if (this.props.pokemonRes[i].DMin < obj.DMin) {
                obj.DMin = this.props.pokemonRes[i].DMin
            }
            if (this.props.pokemonRes[i].FMin < obj.FMin) {
                obj.FMin = this.props.pokemonRes[i].FMin
            }
            if (this.props.pokemonRes[i].TMint < obj.TMint) {
                obj.TMint = this.props.pokemonRes[i].TMint
            }
            obj.DAvg += this.props.pokemonRes[i].DAvg
            obj.NOfWins += this.props.pokemonRes[i].NOfWins
            obj.TAvg += this.props.pokemonRes[i].TAvg
        }
        obj.DAvg = (obj.DAvg / this.props.pokemonRes.length).toFixed(0)
        obj.NOfWins = (obj.NOfWins / this.props.pokemonRes.length).toFixed(0)
        obj.TAvg = (obj.TAvg / this.props.pokemonRes.length / 1000).toFixed(0)
        obj.TMax = (obj.TMax / 1000).toFixed(0)
        obj.TMint = (obj.TMint / 1000).toFixed(0)

        return obj
    }

    /*
     <div onClick={this.onClick} className="clickable align-self-center m-0 p-0  px-3">
                    <i className={this.state.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg"}></i>
                </div>
                <div className={"col-12 m-0 p-0 " + (this.state.showCollapse ? "borderTop" : "")}>
                    <UnmountClosed isOpened={this.state.showCollapse}>
    
                        {this.state.colElement}
    
                    </UnmountClosed>
    
                </div>
    */


    render() {
        return (
            this.returnTopEntry()
        );
    }
};

export default PveResEntry;
