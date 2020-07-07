import React from "react";
import LocalizedStrings from 'react-localization';
import ReactTooltip from "react-tooltip";

import PokemonIconer from "../PokemonIconer/PokemonIconer"
import Result from "../Result"
import Type from "../CpAndTypes/Type"
import TableBody from "./TableBody"
import TypingThead from "./TypingThead"
import SingleMoveLine from "./SingleMoveLine"
import SinglePokLine from "./SinglePokLine"

import { ReactComponent as Shadow } from "../../../../icons/shadow.svg";
import { locale } from "../../../../locale/locale"
import { getCookie, typeDecoder, effectivenessData } from "../../../../js/indexFunctions"


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
        let arr = []
        this.pokVunerabilities(arr, this.props.pokemonTable[this.props.first.name])
        this.pokVunerabilities(arr, this.props.pokemonTable[this.props.second.name])
        this.pokVunerabilities(arr, this.props.pokemonTable[this.props.third.name])

        let strong = []
        let weak = []

        for (let i = 0; i < arr[0].length; i++) {
            let multipl = (arr[0][i] * arr[1][i] * arr[2][i]).toFixed(1)
            if (multipl < 1) {
                strong.push(<Type
                    key={"strongDef" + i}
                    class={"icon24 m-1"}
                    code={i}
                    value={typeDecoder[i]}
                />)
                continue
            }
            if (multipl > 1) {
                weak.push(<Type
                    key={"weakDef" + i}
                    class={"icon24 m-1"}
                    code={i}
                    value={typeDecoder[i]}
                />)
                continue
            }
        }
        return [arr, strong, weak]
    }

    pokVunerabilities(arr, pok) {
        let i = arr.push([]) - 1
        for (let j = 0; j < effectivenessData.length; j++) {
            let eff = 1
            for (let k = 0; k < pok.Type.length; k++) {
                eff *= (effectivenessData[j][pok.Type[k]] === 0 ? 1 : effectivenessData[j][pok.Type[k]])
            }
            arr[i].push(eff.toFixed(3))
        }
    }

    calculateOffensiveStats() {
        //add table lines
        let arr = []
        this.singleOffensiveStats(arr, this.props.first)
        this.singleOffensiveStats(arr, this.props.second)
        this.singleOffensiveStats(arr, this.props.third)

        let zeros = []
        let strong = []

        for (let i = 0; i < effectivenessData.length; i++) {
            let cumulative = 1
            let zeroCount = 0
            for (let j = 0; j < arr.length; j++) {
                cumulative *= (effectivenessData[this.props.moveTable[arr[j]].MoveType][i] === 0 ? 1 : effectivenessData[this.props.moveTable[arr[j]].MoveType][i])
                zeroCount += (effectivenessData[this.props.moveTable[arr[j]].MoveType][i] > 1 ||
                    effectivenessData[this.props.moveTable[arr[j]].MoveType][i] === 0) ? 0 : 1
            }
            if (zeroCount / arr.length > 0.5) {
                zeros.push(<Type
                    key={"zeroOff" + i}
                    class={"icon24 m-1"}
                    code={i}
                    value={typeDecoder[i]}
                />)
            }
            if (cumulative.toFixed(1) > 1) {
                strong.push(<Type
                    key={"strongOff" + i}
                    class={"icon24 m-1"}
                    code={i}
                    value={typeDecoder[i]}
                />)

            }
        }
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
        let zerosList = []
        for (let z = 0; z < this.props.list[this.props.i].zeros.length; z++) {
            let pok = this.props.rightPanel.listForBattle[this.props.list[this.props.i].zeros[z]]
            zerosList.push(
                <div className="posRel" key={pok.name + z + "zero"}>
                    {(pok.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                    <PokemonIconer
                        src={this.props.pokemonTable[pok.name].Number + (this.props.pokemonTable[pok.name].Forme !== "" ? "-" + this.props.pokemonTable[pok.name].Forme : "")}
                        class={"icon48 mr-2"}
                        for={pok.name + z + "zero"}
                    />

                    <ReactTooltip
                        className={"infoTip"}
                        id={pok.name + z + "zero"} effect='solid'
                        place={"top"}
                        multiline={true}
                    >
                        {pok.name + (pok.IsShadow === "true" ? " (" + strings.options.type.shadow + ")" : "")}
                    </ReactTooltip>
                </div>
            )
        }
        return zerosList.length > 0 ? zerosList : strings.options.moveSelect.none
    }

    recombineTable() {
        var arr = []
        //markup table
        arr.push(this.props.rawResult[0])
        arr.push(this.props.rawResult[this.props.list[this.props.i].first + 1])
        arr.push(this.props.rawResult[this.props.list[this.props.i].second + 1])
        arr.push(this.props.rawResult[this.props.list[this.props.i].third + 1])
        return arr
    }

    makeMoveTypingList() {
        let arr = [
            [<TypingThead key="movetyping" />],
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
        arr.push([<SingleMoveLine
            MoveType={this.props.moveTable[name].MoveType}
            line={arr.length}
            name={name}
            star={this.addStar(pok.name, name)}
        />])
    }

    makePokTypingList(vun) {
        let arr = [
            [<TypingThead key="poktyping" />],
        ]

        //add table lines
        this.addPokLine(arr, this.props.first, vun)
        this.addPokLine(arr, this.props.second, vun)
        this.addPokLine(arr, this.props.third, vun)

        return arr
    }

    addPokLine(arr, pok, vun) {
        arr.push([<SinglePokLine
            i={arr.length - 1}
            pok={pok}
            pokemonTable={this.props.pokemonTable}
            locale={strings.options.type.shadow}
            addStar={this.addStar}
            vun={vun}
        />])
    }

    render() {
        let vun = this.calculateVunerabilities()
        let off = this.calculateOffensiveStats()
        return (
            <div className="col-12 m-0 p-0 px-2" key={"coll" + this.props.i}>
                <div className="row m-0 p-0 mx-1 my-2  justify-content-center fBolder">
                    <div className="col-12 text-center bigText m-0 p-0">
                        {strings.advisor.bad}
                    </div>
                    {this.makeZerosList()}
                </div>

                <div className="col-12 text-center bigText m-0 p-0 mt-1 mb-2">
                    {strings.advisor.all}

                </div>
                <div className="overflowingx width90vw p-0 m-0">
                    <Result
                        class="tableFixHead"
                        table={<TableBody
                            value={this.recombineTable()}
                        />}
                    />
                </div>
                <div className="col-12 text-center bigText m-0 p-0 mt-1 mb-2">
                    {strings.advisor.def}

                </div>
                <div className="col-12 text-left  m-0 p-0 mt-1 mb-2 fBolder">
                    {strings.advisor.res}{vun[1].length > 0 ? vun[1] : strings.options.moveSelect.none}
                </div>
                <div className="col-12 text-left  m-0 p-0 mt-1 mb-2 fBolder">
                    {strings.advisor.weak}  {vun[2].length > 0 ? vun[2] : strings.options.moveSelect.none}
                </div>
                <div className="overflowingx width90vw p-0 m-0">
                    <Result
                        class="tableFixHead"
                        table={<TableBody
                            value={this.makePokTypingList(vun[0])}
                        />}
                    />
                </div>
                <div className="col-12 text-center bigText m-0 p-0 mt-1 mb-2">
                    {strings.advisor.off}

                </div>
                <div className="col-12 text-left  m-0 p-0 mt-1 mb-2 fBolder">
                    {strings.advisor.notcov} {off[0].length > 0 ? off[0] : strings.options.moveSelect.none}
                </div>
                <div className="col-12 text-left  m-0 p-0 mt-1 mb-2 fBolder">
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
