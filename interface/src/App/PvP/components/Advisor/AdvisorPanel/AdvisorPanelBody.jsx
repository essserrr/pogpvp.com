import React from "react";
import LocalizedStrings from "react-localization";
import ReactTooltip from "react-tooltip";

import PokemonIconer from "../../PokemonIconer/PokemonIconer"
import Result from "../../Result"
import Type from "../../CpAndTypes/Type"
import TableBody from "../TableBody"
import TypingThead from "../TypingThead"
import SingleMoveLine from "../SingleMoveLine"
import SinglePokLine from "../SinglePokLine"

import { ReactComponent as Shadow } from "../../../../../icons/shadow.svg";
import { locale } from "../../../../../locale/locale"
import { effectivenessData } from "../../../../../js/indexFunctions"
import { getCookie } from "../../../../../js/getCookie"

let strings = new LocalizedStrings(locale);



class AdvisorPanelBody extends React.PureComponent {

    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.addStar = this.addStar.bind(this);
    }

    addStar(pokName, moveName) {
        return (this.props.pokemonTable[pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    calculateVunerabilities() {
        let arr = [
            this.pokVunerabilities(this.props.pokemonTable[this.props.first.name]),
            this.pokVunerabilities(this.props.pokemonTable[this.props.second.name]),
            this.pokVunerabilities(this.props.pokemonTable[this.props.third.name]),
        ]

        let strong = []
        let weak = []

        arr[0].forEach((elem, i) => {
            let multipl = (elem * arr[1][i] * arr[2][i]).toFixed(1)
            switch (true) {
                case multipl < 1:
                    strong.push(<Type
                        key={"strongDef" + i}
                        class={"icon24 m-1"}
                        code={i}
                    />)
                    break
                case multipl > 1:
                    weak.push(<Type
                        key={"weakDef" + i}
                        class={"icon24 m-1"}
                        code={i}
                    />)
                    break
                default:
            }
        });
        return [arr, strong, weak]
    }

    pokVunerabilities(pok) {
        return effectivenessData.map((elem) => {
            let eff = 1
            pok.Type.forEach((pokType) => {
                eff *= (elem[pokType] === 0 ? 1 : elem[pokType])
            });
            return eff.toFixed(3)
        });
    }

    calculateOffensiveStats() {
        //add table lines
        let arr = []
        this.singleOffensiveStats(arr, this.props.first)
        this.singleOffensiveStats(arr, this.props.second)
        this.singleOffensiveStats(arr, this.props.third)

        let zeros = []
        let strong = []

        effectivenessData.forEach((elem, i) => {
            let cumulative = 1
            let zeroCount = 0

            arr.forEach((name) => {
                cumulative *= (effectivenessData[this.props.moveTable[name].MoveType][i] === 0 ?
                    1 : effectivenessData[this.props.moveTable[name].MoveType][i])

                zeroCount += (effectivenessData[this.props.moveTable[name].MoveType][i] > 1 ||
                    effectivenessData[this.props.moveTable[name].MoveType][i] === 0) ? 0 : 1

            });
            switch (true) {
                case zeroCount / arr.length > 0.5:
                    zeros.push(<Type
                        key={"zeroOff" + i}
                        class={"icon24 m-1"}
                        code={i}
                    />)
                    break
                case cumulative.toFixed(1) > 1:
                    strong.push(<Type
                        key={"strongOff" + i}
                        class={"icon24 m-1"}
                        code={i}
                    />)
                    break
                default:
            }
        });
        return [zeros, strong]
    }

    singleOffensiveStats(arr, pok) {
        if (pok.QuickMove) {
            arr.push(pok.QuickMove)
        }
        if (pok.ChargeMove1) {
            arr.push(pok.ChargeMove1)
        }
        if (pok.ChargeMove2) {
            arr.push(pok.ChargeMove2)
        }
    }

    makeZerosList() {
        //bad matchups
        let zerosList = this.props.list[this.props.i].zeros.map((elem, i) => {
            let pok = this.props.rightPanel.listForBattle[elem]
            return <div className="posRel" key={pok.name + i + "zero"}>
                {(pok.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                <PokemonIconer
                    src={this.props.pokemonTable[pok.name].Number + (this.props.pokemonTable[pok.name].Forme !== "" ?
                        "-" + this.props.pokemonTable[pok.name].Forme : "")}
                    class={"icon48 mr-2"}
                    for={pok.name + i + "zero"}
                />
                <ReactTooltip
                    className={"infoTip"}
                    id={pok.name + i + "zero"} effect="solid"
                    place={"right"}
                    multiline={true}
                >
                    {pok.name + (pok.IsShadow === "true" ? " (" + strings.options.type.shadow + ")" : "")}
                </ReactTooltip>
            </div>
        })
        return zerosList.length > 0 ? zerosList : strings.options.moveSelect.none
    }

    makeMoveTypingList() {
        let arr = [
            <TypingThead key="movetyping" />,
        ]
        //add table lines
        this.addMoveLine(arr, this.props.first)
        this.addMoveLine(arr, this.props.second)
        this.addMoveLine(arr, this.props.third)
        return arr
    }

    addMoveLine(arr, pok) {
        if (pok.QuickMove) {
            this.singleMoveLine(arr, pok.QuickMove, pok)
        }
        if (pok.ChargeMove1) {
            this.singleMoveLine(arr, pok.ChargeMove1, pok)
        }
        if (pok.ChargeMove2) {
            this.singleMoveLine(arr, pok.ChargeMove2, pok)
        }
    }

    singleMoveLine(arr, name, pok) {
        arr.push([
            <SingleMoveLine
                key={arr.length + name}
                MoveType={this.props.moveTable[name].MoveType}
                line={arr.length}
                name={name}
                star={this.addStar(pok.name, name)}
            />])
    }

    render() {
        let vun = this.calculateVunerabilities()
        let off = this.calculateOffensiveStats()
        return (
            <div className="col-12 px-2 bigText fBolder text-center" key={"coll" + this.props.i}>
                {strings.advisor.bad}
                <div className="row mx-1 mt-1 justify-content-center">
                    {this.makeZerosList()}
                </div>
                {strings.advisor.all}
                <div className="overflowingx width90vw p-0 m-0">
                    <Result
                        class="tableFixHead"
                        table={<TableBody
                            value={[
                                this.props.rawResult[0],
                                this.props.rawResult[this.props.list[this.props.i].first + 1],
                                this.props.rawResult[this.props.list[this.props.i].second + 1],
                                this.props.rawResult[this.props.list[this.props.i].third + 1],
                            ]}
                        />}
                    />
                </div>
                {strings.advisor.def}
                <div className="col-12 text-left  m-0 p-0 mt-1 mb-2">
                    {strings.advisor.res}{vun[1].length > 0 ? vun[1] : strings.options.moveSelect.none}
                </div>
                <div className="col-12 text-left  m-0 p-0 mt-1 mb-2">
                    {strings.advisor.weak}  {vun[2].length > 0 ? vun[2] : strings.options.moveSelect.none}
                </div>
                <div className="overflowingx width90vw p-0 m-0">
                    <Result
                        class="tableFixHead"
                        table={<TableBody
                            value={[
                                <TypingThead key="poktyping" />,
                                <SinglePokLine
                                    key="typesof1"
                                    i={0}
                                    pok={this.props.first}
                                    pokemonTable={this.props.pokemonTable}
                                    locale={strings.options.type.shadow}
                                    addStar={this.addStar}
                                    vun={vun[0]}
                                />,
                                <SinglePokLine
                                    key="typesof2"
                                    i={1}
                                    pok={this.props.second}
                                    pokemonTable={this.props.pokemonTable}
                                    locale={strings.options.type.shadow}
                                    addStar={this.addStar}
                                    vun={vun[0]}
                                />,
                                <SinglePokLine
                                    key="typesof2"
                                    i={2}
                                    pok={this.props.third}
                                    pokemonTable={this.props.pokemonTable}
                                    locale={strings.options.type.shadow}
                                    addStar={this.addStar}
                                    vun={vun[0]}
                                />
                            ]}
                        />}
                    />
                </div>
                {strings.advisor.off}
                <div className="col-12 text-left  p-0 mt-1 mb-2">
                    {strings.advisor.notcov} {off[0].length > 0 ? off[0] : strings.options.moveSelect.none}
                </div>
                <div className="col-12 text-left  p-0 mt-1 mb-2">
                    {strings.advisor.strong} {off[1].length > 0 ? off[1] : strings.options.moveSelect.none}
                </div>
                <div className="overflowingxy height400resp width90vw p-0 m-0">
                    <Result
                        class="tableFixHead"
                        table={<TableBody
                            value={this.makeMoveTypingList()}
                        />}
                    />
                </div>
            </div>

        );
    }
};

export default AdvisorPanelBody;
