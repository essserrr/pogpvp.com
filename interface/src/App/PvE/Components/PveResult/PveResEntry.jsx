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

    componentDidUpdate(prevProps) {
        if (prevProps.pokemonRes === this.props.pokemonRes) {
            return
        }
        this.setState({
            colElement: this.state.showCollapse ? this.generateBody() : null,
        })
    }

    returnTopEntry() {
        let pok = this.props.pokemonTable[this.props.pokemonRes[0].AName]
        let pokQick = this.props.moveTable[this.props.pokemonRes[0].AQ]
        let pokCh = this.props.moveTable[this.props.pokemonRes[0].ACh]
        let name = extractName(pok.Title)

        let avgStats = this.collect()


        return <div className={"cardBig row m-0 p-0 py-1 my-1 px-2 justify-content-start"} key={name.Name + pokQick.Title + pokCh.Title}>
            <div className="col-auto m-0 p-0">
                <span className="bigText align-self-center ">{"#" + (this.props.i + 1)}</span>
                <PokemonIconer
                    src={pok.Number + (pok.Forme !== "" ? "-" + pok.Forme : "")}
                    class={"icon48 ml-1"} />
            </div>
            <div className="verySmallWidth">
                <div className="col-12 d-flex m-0 p-0">
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
                <div className="col-12 d-flex m-0 p-0">
                    {"CP "} {culculateCP(pok.Title, this.props.snapshot.Lvl, this.props.snapshot.Atk, this.props.snapshot.Def, this.props.snapshot.Sta, this.props.pokemonTable)}
                    {" / HP "} {calculateEffStat(pok.Title, this.props.snapshot.Lvl, this.props.snapshot.Sta, 0, this.props.pokemonTable, "Sta", false)}
                    {name.Additional && (" / " + name.Additional)}
                </div>
            </div>
            <div className="col-12 m-0 p-0">
                <div className="row m-0 p-0 justify-content-between">
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
                        <span className="bigText">{avgStats.NOfWins > 0 ? " Winrate " + avgStats.NOfWins + "%" : ""}</span>
                    </div>
                    <div className="col-auto m-0 p-0">
                        <i className="fas fa-crosshairs mr-1"></i> {(avgStats.DAvg / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}%
                        <i className="far fa-clock ml-3 mr-1"></i>{avgStats.TAvg}{pveStrings.s}
                        <i className="fab fa-cloudscale ml-3 mr-1"></i> {(avgStats.DAvg / (this.props.tables.timer[this.props.snapshot.Tier] - avgStats.TAvg)).toFixed(1)}
                        <i className="fas fa-skull-crossbones ml-3 mr-1"></i> {avgStats.FMin + "-" + avgStats.FMax}
                    </div>

                    <div onClick={this.onClick} className="clickable align-self-end ">
                        <i className={this.state.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg"}></i>
                    </div>

                </div>


                <div className={"col-12 m-0 p-0 " + (this.state.showCollapse ? "borderTop" : "")}>
                    <UnmountClosed isOpened={this.state.showCollapse}>
                        <div className="row p-0 m-0">
                            {this.state.colElement}
                        </div>
                    </UnmountClosed>

                </div>
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
            TMin: 9000,
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
            if (this.props.pokemonRes[i].TMin < obj.TMin) {
                obj.TMin = this.props.pokemonRes[i].TMin
            }
            obj.DAvg += this.props.pokemonRes[i].DAvg
            obj.NOfWins += this.props.pokemonRes[i].NOfWins
            obj.TAvg += this.props.pokemonRes[i].TAvg
        }
        obj.DAvg = (obj.DAvg / this.props.pokemonRes.length).toFixed(0)
        obj.NOfWins = (obj.NOfWins / this.props.pokemonRes.length).toFixed(0)
        obj.TAvg = (obj.TAvg / this.props.pokemonRes.length / 1000).toFixed(0)
        obj.TMax = (obj.TMax / 1000).toFixed(0)
        obj.TMin = (obj.TMin / 1000).toFixed(0)

        return obj
    }

    onClick() {
        console.log(this.props.pokemonRes)
        this.setState({
            showCollapse: !this.state.showCollapse,
            colElement: !this.state.showCollapse ? this.generateBody() : null,
        })
    }

    generateBody() {
        let avgStats = this.collect()

        return <>
            <div className="col-12 m-0 p-0">
                <i className="fas fa-crosshairs mr-1"></i>Damage Dealt: {(avgStats.DAvg / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}% ({(avgStats.DMin / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}% - {(avgStats.DMax / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}%)
            </div>
            <div className="col-12 m-0 p-0">
                <i className="far fa-clock mr-1"></i>Time remaining: {avgStats.TAvg}{pveStrings.s} ({avgStats.TMin}{pveStrings.s} - {avgStats.TMax}{pveStrings.s})
            </div>
            <div className="col-12 m-0 p-0">
                <i className="fab fa-cloudscale mr-1"></i>DPS: {(avgStats.DAvg / (this.props.tables.timer[this.props.snapshot.Tier] - avgStats.TAvg)).toFixed(1)} ({(avgStats.DMin / (this.props.tables.timer[this.props.snapshot.Tier] - avgStats.TAvg)).toFixed(1)} -{(avgStats.DMax / (this.props.tables.timer[this.props.snapshot.Tier] - avgStats.TAvg)).toFixed(1)})
            </div>
            <div className="col-12 m-0 p-0">
                <i className="fas fa-skull-crossbones mr-1"></i>Pokemon fainted: {avgStats.FMin + "-" + avgStats.FMax}
            </div>
            {this.generateCards()}
        </>
    }

    generateCards() {
        let arr = []

        for (let i = 0; i < this.props.pokemonRes.length; i++) {
            arr.push(<div className="col-12 matrixResult m-0 p-0 p-2 my-1 ">
                <div className="col-12 d-flex m-0 p-0">
                    {weatherDecoder[this.props.moveTable[this.props.pokemonRes[i].BQ].MoveType] === this.props.snapshot.Weather &&
                        <PokemonIconer
                            folder="/weather/"
                            src={this.props.snapshot.Weather}
                            class={"icon18"} />
                    }
                    <div className={"mr-1 align-self-center font90 pveMove typeColor color" + this.props.moveTable[this.props.pokemonRes[i].BQ].MoveType + " text"}>
                        {this.props.pokemonRes[i].BQ}
                    </div>
                    {weatherDecoder[this.props.moveTable[this.props.pokemonRes[i].BCh].MoveType] === this.props.snapshot.Weather &&
                        <PokemonIconer
                            folder="/weather/"
                            src={this.props.snapshot.Weather}
                            class={"icon18"} />
                    }
                    <div className={"align-self-center font90 pveMove typeColor color" + this.props.moveTable[this.props.pokemonRes[i].BCh].MoveType + " text"}>
                        {this.props.pokemonRes[i].BCh}
                    </div>

                </div>

                <div className="col-12 m-0 p-0 mt-2">
                    <HpBar
                        upbound={((this.props.tables.hp[this.props.snapshot.Tier] - this.damageString(this.props.pokemonRes[i].DMin)) / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}
                        lowbound={((this.props.tables.hp[this.props.snapshot.Tier] - this.damageString(this.props.pokemonRes[i].DMax)) / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}
                        length={((this.props.tables.hp[this.props.snapshot.Tier] - this.damageString(this.props.pokemonRes[i].DAvg)) / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}
                    />
                </div>
                <div className="col-12 m-0 p-0">
                    Boss remaining HP: {this.damageString(this.props.pokemonRes[i].DAvg)}
                    {" (" + this.damageString(this.props.pokemonRes[i].DMax) + "-" + this.damageString(this.props.pokemonRes[i].DMin) + ")"}
                    <span className="bigText">{this.props.pokemonRes[i].NOfWins > 0 ? " Winrate " + this.props.pokemonRes[i].NOfWins + "%" : ""}</span>
                </div>




                <div className="col-12 m-0 p-0">
                    <i className="fas fa-crosshairs mr-1"></i> {(this.props.pokemonRes[i].DAvg / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}%
                    ({(this.props.pokemonRes[i].DMax / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}% - {(this.props.pokemonRes[i].DMin / (this.props.tables.hp[this.props.snapshot.Tier]) * 100).toFixed(1)}%)
                    <i className="far fa-clock ml-3 mr-1"></i>{(this.props.pokemonRes[i].TAvg / 1000).toFixed(0)}{pveStrings.s}
                    {" ("}{(this.props.pokemonRes[i].TMin / 1000).toFixed(0)}{pveStrings.s} - {(this.props.pokemonRes[i].TMax / 1000).toFixed(0)}{pveStrings.s})
                </div>
                <div className="col-12 m-0 p-0">
                    <i className="fab fa-cloudscale mr-1"></i> {(this.props.pokemonRes[i].DAvg / (this.props.tables.timer[this.props.snapshot.Tier] - (this.props.pokemonRes[i].TAvg / 1000).toFixed(0))).toFixed(1)}
                    {" ("}{(this.props.pokemonRes[i].DMax / (this.props.tables.timer[this.props.snapshot.Tier] - (this.props.pokemonRes[i].TAvg / 1000).toFixed(0))).toFixed(1)} - {(this.props.pokemonRes[i].DMin / (this.props.tables.timer[this.props.snapshot.Tier] - (this.props.pokemonRes[i].TAvg / 1000).toFixed(0))).toFixed(1)})
                    <i className="fas fa-skull-crossbones ml-3 mr-1"></i> {this.props.pokemonRes[i].FMin + " - " + this.props.pokemonRes[i].FMax}
                </div>
            </div>)
        }

        return arr
    }


    /*
    <div className="col-12 m-0 p-0 mx-2">
                <i className="far fa-clock mr-1"></i>Maximum time: {this.props.tables.timer[this.props.snapshot.Tier]}{pveStrings.s}
            </div>
    <div className="col-12 m-0 p-0 mx-2">
                Boss catch CP: {culculateCP(this.props.pokemonRes[0].BName, 20, 10, 10, 10, this.props.pokemonTable)} - {culculateCP(this.props.pokemonRes[0].BName, 20, 15, 15, 15, this.props.pokemonTable)}
                {" ("}<PokemonIconer
                    folder="/weather/"
                    src={weatherDecoder[this.props.pokemonTable[this.props.pokemonRes[0].BName].Type[0]]}
                    class={"icon18"} />
                {(this.props.pokemonTable[this.props.pokemonRes[0].BName].Type.length > 1) && <PokemonIconer
                    folder="/weather/"
                    src={weatherDecoder[this.props.pokemonTable[this.props.pokemonRes[0].BName].Type[1]]}
                    class={"icon18 mr-1"} />}
                {culculateCP(this.props.pokemonRes[0].BName, 25, 10, 10, 10, this.props.pokemonTable)} - {culculateCP(this.props.pokemonRes[0].BName, 25, 15, 15, 15, this.props.pokemonTable)})

            </div>
    */

    render() {
        return (
            this.returnTopEntry()
        );
    }
};

export default PveResEntry;
