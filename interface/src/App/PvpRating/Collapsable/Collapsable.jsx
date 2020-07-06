import React from "react";
import { UnmountClosed } from 'react-collapse';
import { checkShadow, getCookie, encodeQueryData, calculateMaximizedStats } from "../../../js/indexFunctions"
import RMoveRow from "../RMoveRow/RMoveRow"
import RRateRow from "../RRateRow/RRateRow"
import RowWrap from "../RowWrap/RowWrap"

import LocalizedStrings from 'react-localization';
import { locale } from "../../../locale/locale"

let strings = new LocalizedStrings(locale);

class Collapsable extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showCollapse: false,
        };
        this.onClick = this.onClick.bind(this);
        this.onClickRedirect = this.onClickRedirect.bind(this);
        this.createMovesetList = this.createMovesetList.bind(this);
    }



    async onClick(event) {
        this.setState({
            showCollapse: !this.state.showCollapse,
        })
    }

    onClickRedirect(event) {
        let defenderOriginalName = event.currentTarget.getAttribute('name')
        let defenderName = checkShadow(defenderOriginalName, this.props.pokemonTable)
        let league = (this.props.league === "Premier" ? "master" : this.props.league.toLowerCase())
        let maxStatsD = calculateMaximizedStats(defenderName, 40, this.props.pokemonTable)[league].Overall

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

        let defender = this.props.ratingList.find(element => element.Name === defenderOriginalName);
        let defenderString = encodeQueryData(
            this.generatePokObj(defenderName, maxStatsD, shields[1], defenderName !== defenderOriginalName, defender)
        )

        let attackerOriginalName = this.props.container.Name
        let attackerName = checkShadow(attackerOriginalName, this.props.pokemonTable)
        let maxStatsA = calculateMaximizedStats(attackerName, 40, this.props.pokemonTable)[league].Overall

        let attackerString = encodeQueryData(
            this.generatePokObj(attackerName, maxStatsA, shields[0], attackerName !== attackerOriginalName, this.props.container)
        )

        window.open("/pvp/single/great/" + attackerString + "/" + defenderString, "_blank")
    }

    generatePokObj(name, stat, shields, isShadow, movelist) {
        return {
            name: name, Lvl: stat.Level, Atk: stat.Atk, Def: stat.Def, Sta: stat.Sta, Shields: shields,
            AtkStage: 0, DefStage: 0, InitialHP: 0, InitialEnergy: 0,
            IsGreedy: true, IsShadow: isShadow,
            QuickMove: movelist.Movesets[0].Quick, ChargeMove1: movelist.Movesets[0].Charge[0], ChargeMove2: movelist.Movesets[0].Charge[1],
        }
    }

    createSublist(array) {
        //if null array, return empty array
        if (!array) {
            return []
        }
        return array.reduce((result, elem) => {
            let pokName = checkShadow(elem.Name, this.props.pokemonTable)
            if (!this.props.pokemonTable[pokName]) {
                console.log(pokName + " not found")
                return result
            }
            result.push(<RRateRow
                key={elem.Name}
                pokName={pokName}
                pokemonTable={this.props.pokemonTable}
                value={elem}
                onClickRedirect={this.onClickRedirect}
            />)
            return result
        }, [])
    }

    createMovesetList(array) {
        let sublist = []
        //if null array, return empty array
        if (!array) {
            return sublist
        }
        return (array.length > 3 ? array.slice(0, 3) : array).map((elem) =>
            <RMoveRow
                key={elem.Quick + elem.Charge[0] + elem.Charge[1]}
                moveTable={this.props.moveTable}
                value={elem}
            />)
    }

    render() {
        return (
            <>
                <div onClick={this.onClick} className="row clickable justify-content-end m-0 p-0 px-3 pb-1">
                    <i className={this.state.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg"}></i>
                </div>
                <UnmountClosed isOpened={this.state.showCollapse}>
                    <div className="row justify-content-center m-0 p-0 px-2">
                        <RowWrap
                            outClass="col-12 col-sm-6 p-0 m-0"
                            locale={strings.rating.bestMatchups}
                            value={this.createSublist(this.props.container.BestMetaMatchups)}
                        />
                        <RowWrap
                            outClass="col-12 col-sm-6 p-0 m-0"
                            locale={strings.rating.bestCounter}
                            value={this.createSublist(this.props.container.Counters)}
                        />
                        <RowWrap
                            outClass="col-12 col-sm-11 col-md-10 p-0 m-0 text-center"
                            locale={strings.rating.movesets}
                            class="row p-0 mx-2 mx-md-3"
                            value={this.createMovesetList(this.props.container.Movesets)}
                        />
                    </div>
                </UnmountClosed>
            </>

        )
    }

}
export default Collapsable;