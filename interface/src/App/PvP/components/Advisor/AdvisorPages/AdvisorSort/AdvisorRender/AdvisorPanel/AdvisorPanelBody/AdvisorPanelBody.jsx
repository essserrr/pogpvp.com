import React from "react"
import LocalizedStrings from "react-localization"

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import MatrixTable from "App/PvP/components/TableBodyRender/MatrixTable/MatrixTable";
import Iconer from "App/Components/Iconer/Iconer"
import TypingHead from "./TypingHead/TypingHead"
import MoveTypingTable from "./MoveTypingTable/MoveTypingTable";
import SinglePokLine from "./SinglePokLine/SinglePokLine"
import ZeroList from "./ZeroList/ZeroList"

import { pvp } from "locale/Pvp/Pvp"
import { advisor } from "locale/Pvp/Advisor/Advisor"
import { options } from "locale/Components/Options/locale"
import { effectivenessData } from "js/indexFunctions"
import { getCookie } from "js/getCookie"


import "./AdvisorPanelBody.scss"

let strings = new LocalizedStrings(pvp);
let advisorStrings = new LocalizedStrings(advisor);
let optionStrings = new LocalizedStrings(options);

class AdvisorPanelBody extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        advisorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
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
                    strong.push(<Iconer
                        key={"strongDef" + i}
                        className={"icon24 m-1"}
                        size={24}
                        folderName="/type/"
                        fileName={String(i)}
                    />)
                    break
                case multipl > 1:
                    weak.push(<Iconer
                        key={"weakDef" + i}
                        className={"icon24 m-1"}
                        size={24}
                        folderName="/type/"
                        fileName={String(i)}
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
                    zeros.push(<Iconer
                        key={"zeroOff" + i}
                        className={"icon24 m-1"}
                        size={24}
                        folderName="/type/"
                        fileName={String(i)}
                    />)
                    break
                case cumulative.toFixed(1) > 1:
                    strong.push(<Iconer
                        key={"strongOff" + i}
                        className={"icon24 m-1"}
                        size={24}
                        folderName="/type/"
                        fileName={String(i)}
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



    render() {
        let vun = this.calculateVunerabilities()
        let off = this.calculateOffensiveStats()
        return (
            <div className="advpanel-body col-12 px-2 text-center" key={"coll" + this.props.i}>

                <Grid item xs={12}>
                    <ZeroList pokemonTable={this.props.pokemonTable} moveTable={this.props.moveTable}
                        rightPanel={this.props.rightPanel}>
                        {this.props.list[this.props.i].zeros}
                    </ZeroList>
                </Grid>


                {advisorStrings.advisor.all}
                <Box clone overflow="auto" style={{ maxHeight: "90vh" }}>
                    <Grid item xs={12}>
                        <MatrixTable variant="secondary">
                            {[
                                this.props.rawResult[0],
                                this.props.rawResult[this.props.list[this.props.i].first + 1],
                                this.props.rawResult[this.props.list[this.props.i].second + 1],
                                this.props.rawResult[this.props.list[this.props.i].third + 1],
                            ]}
                        </MatrixTable>
                    </Grid>
                </Box>

                {advisorStrings.advisor.def}
                <div className="col-12 text-left  m-0 p-0 mt-1 mb-2">
                    {advisorStrings.advisor.res}{vun[1].length > 0 ? vun[1] : optionStrings.options.moveSelect.none}
                </div>
                <div className="col-12 text-left  m-0 p-0 mt-1 mb-2">
                    {advisorStrings.advisor.weak}  {vun[2].length > 0 ? vun[2] : optionStrings.options.moveSelect.none}
                </div>


                <Box clone overflow="auto" style={{ maxHeight: "90vh" }}>
                    <Grid item xs={12}>
                        <MatrixTable variant="secondary">
                            {[
                                <TypingHead key="poktyping" />,
                                <SinglePokLine key="typesof1" i={0}
                                    pok={this.props.first} pokemonTable={this.props.pokemonTable}
                                    vun={vun[0]}
                                />,
                                <SinglePokLine key="typesof2" i={1}
                                    pok={this.props.second} pokemonTable={this.props.pokemonTable}
                                    vun={vun[0]}
                                />,
                                <SinglePokLine key="typesof3" i={2}
                                    pok={this.props.third} pokemonTable={this.props.pokemonTable}
                                    vun={vun[0]}
                                />
                            ]}
                        </MatrixTable>
                    </Grid>
                </Box>


                {advisorStrings.advisor.off}
                <div className="col-12 text-left  p-0 mt-1 mb-2">
                    {advisorStrings.advisor.notcov} {off[0].length > 0 ? off[0] : optionStrings.options.moveSelect.none}
                </div>
                <div className="col-12 text-left  p-0 mt-1 mb-2">
                    {advisorStrings.advisor.strong} {off[1].length > 0 ? off[1] : optionStrings.options.moveSelect.none}
                </div>


                <Box clone overflow="auto" style={{ maxHeight: "90vh" }}>
                    <Grid item xs={12}>
                        <MoveTypingTable
                            pokemons={[this.props.first, this.props.second, this.props.third]}
                            moveTable={this.props.moveTable}
                            pokemonTable={this.props.pokemonTable}
                        />
                    </Grid>
                </Box>
            </div>

        );
    }
};

export default AdvisorPanelBody;
