import React from "react";
import LocalizedStrings from 'react-localization';
import ReactTooltip from "react-tooltip";
import { UnmountClosed } from 'react-collapse';

import PokemonIconer from "../PokemonIconer/PokemonIconer"
import Result from "../Result"
import Type from "../CpAndTypes/Type"

import { ReactComponent as Shadow } from "../../../../icons/shadow.svg";
import { locale } from "../../../..//locale/locale"
import { getCookie, returnVunStyle, typeDecoder, effectivenessData } from "../../..//../js/indexFunctions"


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
            <div className="row m-0 p-0 mx-1 my-2  justify-content-center">
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
                    table={this.makeTableBody(this.recombineTable())}
                />
            </div>
            <div className="col-12 text-center bigText m-0 p-0 mt-1 mb-2">
                {strings.advisor.def}

            </div>
            <div className="col-12 text-left  m-0 p-0 mt-1 mb-2">
                {strings.advisor.res}{vun[1].length > 0 ? vun[1] : strings.options.moveSelect.none}
            </div>
            <div className="col-12 text-left  m-0 p-0 mt-1 mb-2">
                {strings.advisor.weak}  {vun[2].length > 0 ? vun[2] : strings.options.moveSelect.none}
            </div>
            <div className="overflowingx width90vw p-0 m-0">
                <Result
                    class="tableFixHead"
                    table={this.makeTableBody(this.makePokTypingList(this.addTypingThead(), vun[0]))}
                />
            </div>
            <div className="col-12 text-center bigText m-0 p-0 mt-1 mb-2">
                {strings.advisor.off}

            </div>
            <div className="col-12 text-left  m-0 p-0 mt-1 mb-2">
                {strings.advisor.notcov} {off[0].length > 0 ? off[0] : strings.options.moveSelect.none}
            </div>
            <div className="col-12 text-left  m-0 p-0 mt-1 mb-2">
                {strings.advisor.strong} {off[1].length > 0 ? off[1] : strings.options.moveSelect.none}
            </div>
            <div className="overflowingxy height400resp width90vw p-0 m-0">
                <Result
                    class="tableFixHead"
                    table={this.makeTableBody(this.makeMoveTypingList(this.addTypingThead()))}
                />
            </div>
        </div>
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

    addTypingThead() {
        let arr = []
        //add thead
        //zero element
        arr.push([])
        arr[0].push(<th key={"zero"} className="modifiedBorderTable theadT p-0 px-1" scope="col" />)
        //other elements
        for (let j = 0; j < typeDecoder.length; j++) {

            arr[0].push(<th key={j + "thead"} className="modifiedBorderTable  text-center theadT p-0 px-1" scope="col" >
                <Type
                    class={"icon36 m-1"}
                    code={j}
                    value={typeDecoder[j]}
                />
            </th>
            )
        }
        return arr
    }

    makeMoveTypingList(arr) {
        //add table lines
        this.addMoveLine(arr, this.props.first)
        this.addMoveLine(arr, this.props.second)
        this.addMoveLine(arr, this.props.third)
        return arr
    }

    addMoveLine(arr, pok) {
        if (pok.QuickMove) {
            this.singleMoveLine(arr, pok.QuickMove)
        }
        if (pok.ChargeMove1) {
            this.singleMoveLine(arr, pok.ChargeMove1)
        }
        if (pok.ChargeMove2) {
            this.singleMoveLine(arr, pok.ChargeMove2)
        }
    }

    singleMoveLine(arr, name) {
        let i = arr.push([])
        arr[i - 1].push(<td key={i + "line"}
            className={"modifiedBorderTable text-center align-middle theadT fixFirstRow  m-0 p-0 px-1 typeColor color" + this.props.moveTable[name].MoveType + " text"} >
            {name}
        </td>)

        for (let j = 0; j < effectivenessData[this.props.moveTable[name].MoveType].length; j++) {
            let multipl = effectivenessData[this.props.moveTable[name].MoveType][j] === 0 ? "1.000" :
                (effectivenessData[this.props.moveTable[name].MoveType][j]).toFixed(3);
            let rateStyle = returnVunStyle(multipl === "1.000" ? multipl : (1 / multipl).toFixed(3))

            arr[i - 1].push(<td key={i - 1 + "offensive" + j} className="modifiedBorderTable matrixColor defaultFont m-0 p-0 align-middle" >
                <div className={"rateTyping hover rateColor " + rateStyle} >
                    {multipl}
                </div>

            </td >)
        }
    }


    makePokTypingList(arr, vun) {
        //add table lines
        this.addPokLine(arr, this.props.first)
        this.addPokLine(arr, this.props.second)
        this.addPokLine(arr, this.props.third)



        for (let j = 1; j < arr.length; j++) {
            for (let k = 1; k < vun[j - 1].length + 1; k++) {
                let rateStyle = returnVunStyle(vun[j - 1][k - 1])

                arr[j].push(<td key={j + "defensive" + k} className="modifiedBorderTable matrixColor defaultFont m-0 p-0 align-middle" >
                    <div className={"rateTyping hover rateColor " + rateStyle}>
                        {vun[j - 1][k - 1]}
                    </div>
                </td >)
            }
        }

        return arr
    }

    addPokLine(arr, pok) {
        let i = arr.push([])
        arr[i - 1].push(<td key={i + "line"} className="modifiedBorderTable text-center theadT fixFirstRow m-0 p-0 px-1" >
            {(pok.IsShadow === "true") && <Shadow className="posAbs icon16" />}
            <PokemonIconer
                src={this.props.pokemonTable[pok.name].Number +
                    (this.props.pokemonTable[pok.name].Forme !== "" ? "-" + this.props.pokemonTable[pok.name].Forme : "")}
                class={"icon36"}
                for={pok.name + i + "R"}
            />
            <ReactTooltip
                className={"infoTip"}
                id={pok.name + i + "R"} effect='solid'
                place={"right"}
                multiline={true}
            >
                {pok.name + (pok.IsShadow === "true" ? " (" + strings.options.type.shadow + ")" : "")}
            </ReactTooltip>
            <div className="row m-0 p-0 justify-content-center">
                {pok.QuickMove.replace(/[a-z -]/g, '')}
                {(pok.ChargeMove1 || pok.ChargeMove2) ? "+" : ""}
                {pok.ChargeMove1 ? pok.ChargeMove1.replace(/[a-z -]/g, '') : ""}
                {(pok.ChargeMove1 && pok.ChargeMove2) ? "/" : ""}
                {pok.ChargeMove2 ? pok.ChargeMove2.replace(/[a-z -]/g, '') : ""}
            </div>
        </td>)

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



    makeTableBody(arr) {
        var tableBody = []
        //create table body
        tableBody.push(
            <thead key={"thead0"} className="thead thead-light" >
                <tr >
                    {arr[0]}
                </tr>
            </thead>
        )
        var arrWithTr = []
        for (let i = 1; i < arr.length; i++) {
            arrWithTr.push(
                <tr key={"tableline" + i}>
                    {arr[i]}
                </tr>
            )
        }
        tableBody.push(
            <tbody key={"tablebody"} className="modifiedBorderTable">
                {arrWithTr}
            </tbody>
        )
        return tableBody
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
