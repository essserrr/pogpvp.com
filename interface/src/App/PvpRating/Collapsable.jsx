import React from "react";
import { UnmountClosed } from 'react-collapse';
import { ReactComponent as Shadow } from "../../icons/shadow.svg";
import { checkShadow, getCookie, encodeQueryData, calculateMaximizedStats } from "../../js/indexFunctions"
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"

import LocalizedStrings from 'react-localization';
import { locale } from "../../locale/locale"

let strings = new LocalizedStrings(locale);

class Collapsable extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showCollapse: false,
        };
        this.onClick = this.onClick.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.onClickRedirect = this.onClickRedirect.bind(this);

    }



    async onClick(event) {
        this.setState({
            showCollapse: !this.state.showCollapse
        })

    }

    onClickRedirect(event) {
        var defenderOriginalName = event.currentTarget.getAttribute('name')
        var defenderName = checkShadow(defenderOriginalName, this.props.pokemonTable)
        var league = (this.props.league === "Premier" ? "master" : this.props.league.toLowerCase())


        var maxStatsD = calculateMaximizedStats(defenderName, 40, this.props.pokemonTable)[league].Overall


        switch (this.props.combination) {
            case "00":
                var shields = [0, 0]
                break
            case "11":
                shields = [1, 1]
                break
            case "22":
                shields = [2, 2]
                break
            case "01":
                shields = [0, 1]
                break
            case "12":
                shields = [1, 2]
                break
            default:
                shields = [2, 2]
                break
        }

        var defender = this.props.ratingList.find(element => element.Name === defenderOriginalName);
        var defenderString = encodeQueryData({
            name: defenderName,
            Lvl: maxStatsD.Level,
            Atk: maxStatsD.Atk,
            Def: maxStatsD.Def,
            Sta: maxStatsD.Sta,
            Shields: shields[1],

            AtkStage: 0,
            DefStage: 0,
            InitialHP: 0,
            InitialEnergy: 0,

            IsGreedy: true,
            IsShadow: defenderName !== defenderOriginalName,

            QuickMove: defender.Movesets[0].Quick,
            ChargeMove1: defender.Movesets[0].Charge[0],
            ChargeMove2: defender.Movesets[0].Charge[1],
        })

        var attackerOriginalName = this.props.container.Name
        var attackerName = checkShadow(attackerOriginalName, this.props.pokemonTable)

        var maxStatsA = calculateMaximizedStats(attackerName, 40, this.props.pokemonTable)[league].Overall

        var attackerString = encodeQueryData({
            name: attackerName,
            Lvl: maxStatsA.Level,
            Atk: maxStatsA.Atk,
            Def: maxStatsA.Def,
            Sta: maxStatsA.Sta,
            Shields: shields[0],

            AtkStage: 0,
            DefStage: 0,
            InitialHP: 0,
            InitialEnergy: 0,

            IsGreedy: true,
            IsShadow: attackerName !== attackerOriginalName,

            QuickMove: this.props.container.Movesets[0].Quick,
            ChargeMove1: this.props.container.Movesets[0].Charge[0],
            ChargeMove2: this.props.container.Movesets[0].Charge[1],
        })

        window.open("/pvp/single/great/" + attackerString + "/" + defenderString, "_blank")
    }

    createSublist(array) {
        var sublist = []
        //if null array, return empty array
        if (!array) {
            return sublist
        }
        for (var i = 0; i < array.length; i++) {
            var pokName = checkShadow(array[i].Name, this.props.pokemonTable)
            if (!this.props.pokemonTable[pokName]) {
                console.log(pokName + " not found")
                continue
            }
            sublist.push(
                <div key={array[i].Name}
                    name={pokName}
                    onClick={this.onClickRedirect}
                    className="row collapseList clickable animRating justify-content-between px-2 mb-1 mx-2 mx-md-3">
                    <div >
                        <PokemonIconer
                            src={this.props.pokemonTable[pokName].Number + (this.props.pokemonTable[pokName].Forme !== "" ? "-" + this.props.pokemonTable[pokName].Forme : "")}

                            class={"icon24 mr-1"} />
                        {pokName}
                        {(pokName !== array[i].Name) &&
                            <abbr title={strings.options.type.shadow} className="initialism">
                                <Shadow className="allign-self-center icon24 py-1 ml-1" />
                            </abbr>}
                    </div>
                    <div >
                        {array[i].Rate}
                    </div>
                </div>
            )
        }
        return sublist
    }

    createMovesetList(array) {
        var sublist = []
        //if null array, return empty array
        if (!array) {
            return sublist
        }
        var maxLength = (array.length > 3) ? 3 : array.length
        for (var i = 0; i < maxLength; i++) {
            sublist.push(
                <div key={array[i].Quick + array[i].Charge[0] + array[i].Charge[1]}
                    className="col-12  collapseList animRating m-0 mb-1 p-0">
                    <div className="row justify-content-between  m-0 p-0">
                        <div className="col-10 m-0 p-0">
                            <div className="row justify-content-md-left m-0 p-0">
                                {this.props.moveTable[array[i].Quick] && <div className={"mx-1 moveStyle color" + this.props.moveTable[array[i].Quick].MoveType + " text"}>
                                    {array[i].Quick}
                                </div>}
                                {this.props.moveTable[array[i].Charge[0]] && <div className={"mx-1  moveStyle color" + this.props.moveTable[array[i].Charge[0]].MoveType + " text"}>
                                    {array[i].Charge[0]}
                                </div>}
                                {this.props.moveTable[array[i].Charge[1]] && <div className={"mx-1 moveStyle  color" + this.props.moveTable[array[i].Charge[1]].MoveType + " text"}>
                                    {array[i].Charge[1]}
                                </div>}
                            </div>
                        </div>
                        <div className="col-2 text-right align-self-center m-0 p-0 pr-2">
                            {array[i].Rate}
                        </div>
                    </div>
                </div>
            )
        }
        return sublist
    }

    generateBody() {
        var body = []

        var best = this.createSublist(this.props.container.BestMetaMatchups)
        body.push(
            <div key={"Best meta matchups"} className="col-12 col-sm-6 p-0 m-0">
                <div className="row bigCardHeader justify-content-center p-0 mb-1 mx-2 mx-md-3">
                    {strings.rating.bestMatchups}
                </div>
                {best}
            </div>
        )

        var counters = this.createSublist(this.props.container.Counters)
        body.push(
            <div key={"Meta counters"} className="col-12 col-sm-6 p-0 m-0">
                <div className="row bigCardHeader justify-content-center p-0 mb-1 mx-2 mx-md-3">
                    {strings.rating.bestCounter}
                </div>
                {counters}
            </div>
        )

        var movesets = this.createMovesetList(this.props.container.Movesets)
        body.push(
            <div key={"Best movesets"} className="col-12 col-sm-11 col-md-8 p-0 m-0 text-center">
                <div className="row bigCardHeader justify-content-center p-0 mb-1 mx-2 mx-md-3">
                    {strings.rating.movesets}
                </div>
                <div className="row p-0 mx-2 mx-md-3">
                    {movesets}
                </div>
            </div>
        )

        return body
    }

    render() {
        return (
            <>
                <div onClick={this.onClick} className="row clickable justify-content-end m-0 p-0 px-3 pb-1">
                    <i className={this.state.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg"}></i>
                </div>
                <UnmountClosed isOpened={this.state.showCollapse}>
                    <div className="row justify-content-center m-0 p-0 px-2">
                        {this.generateBody()}
                    </div>
                </UnmountClosed>
            </>

        )
    }

}
export default Collapsable;