import React from "react";
import LocalizedStrings from 'react-localization';
import ReactTooltip from "react-tooltip";
import { UnmountClosed } from 'react-collapse';

import PokemonIconer from "../PokemonIconer/PokemonIconer"
import Result from "../Result"
import Type from "../CpAndTypes/Type"
import TableBody from "./TableBody"
import TypingThead from "./TypingThead"
import SingleMoveLine from "./SingleMoveLine"
import SinglePokLine from "./SinglePokLine"

import { ReactComponent as Shadow } from "../../../../icons/shadow.svg";
import { locale } from "../../../..//locale/locale"
import { getCookie, typeDecoder, effectivenessData } from "../../..//../js/indexFunctions"


let strings = new LocalizedStrings(locale);



class AdvisorPanel extends React.PureComponent {

    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showCollapse: false,
            colElement: null,
        };
        this.onClick = this.onClick.bind(this);
        this.addStar = this.addStar.bind(this);
    }

    addStar(pokName, moveName) {
        return (this.props.pokemonTable[pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    onClick(event) {
        this.setState({
            showCollapse: !this.state.showCollapse,
            colElement: !this.state.showCollapse ? this.generateBody() : null,
        })

    }

    generateBody() {
        let vun = this.calculateVunerabilities()
        let off = this.calculateOffensiveStats()

        return <div className="col-12 m-0 p-0 px-2" key={"coll" + this.props.i}>
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
            let eff = effectivenessData[j][pok.Type[0]]
            arr[i].push((eff === 0 ? 1 : eff).toFixed(3))
        }
        if (pok.Type.length > 1) {
            for (let j = 0; j < effectivenessData.length; j++) {
                let eff = effectivenessData[j][pok.Type[1]]
                arr[i][j] = (arr[i][j] * (eff === 0 ? 1 : eff)).toFixed(3)
            }
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
            let notZero = false
            for (let j = 0; j < arr.length; j++) {
                cumulative *= (effectivenessData[this.props.moveTable[arr[j]].MoveType][i] === 0 ? 1 : effectivenessData[this.props.moveTable[arr[j]].MoveType][i])
                notZero += (effectivenessData[this.props.moveTable[arr[j]].MoveType][i] > 1 || effectivenessData[this.props.moveTable[arr[j]].MoveType][i] === 0)
            }
            if (!notZero) {
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
            i={arr.length}
            pok={pok}
            pokemonTable={this.props.pokemonTable}
            locale={strings.options.type.shadow}
            addStar={this.addStar}
            vun={vun}
        />])
    }

    render() {
        return (
            <div className={"cardBig row m-0 p-0 py-1 justify-content-between"}>
                <div className={"row m-0 p-0"}>
                    <div className="ml-2 mr-2 bigText align-self-center ">{"#" + (this.props.i + 1)}</div>
                    <div className="posRel">
                        {(this.props.first.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={this.props.pokemonTable[this.props.first.name].Number + (this.props.pokemonTable[this.props.first.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.first.name].Forme : "")}
                            class={"icon48 ml-1 ml-sm-3  mr-2"} />
                    </div>

                    <div className="posRel">
                        {(this.props.second.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={this.props.pokemonTable[this.props.second.name].Number + (this.props.pokemonTable[this.props.second.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.second.name].Forme : "")}
                            class={"icon48 ml-1 ml-sm-3  mr-2"} />
                    </div>

                    <div className="posRel">
                        {(this.props.third.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={this.props.pokemonTable[this.props.third.name].Number + (this.props.pokemonTable[this.props.third.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.third.name].Forme : "")}
                            class={"icon48 ml-1 ml-sm-3 mr-2"} />
                    </div>
                </div>
                <div className={"row m-0 p-0"}>
                    <div className="mr-2 mr-sm-4 w64 bigText text-center align-self-center ">{this.props.list[this.props.i].zeros.length}</div>
                    <div className="mr-2 mr-sm-4 w64 bigText text-center align-self-center ">{(this.props.list[this.props.i].rate / 3).toFixed(1)}</div>
                    <div onClick={this.onClick} className="clickable align-self-center m-0 p-0  px-3">
                        <i className={this.state.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg"}></i>
                    </div>
                </div>

                <div className={"col-12 m-0 p-0 " + (this.state.showCollapse ? "borderTop" : "")}>
                    <UnmountClosed isOpened={this.state.showCollapse}>
                        {this.state.colElement}
                    </UnmountClosed>
                </div>
            </div>

        );
    }
};

export default AdvisorPanel;
