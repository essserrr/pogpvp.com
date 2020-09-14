import React from "react"

import SinglePvpCell from "./SinglePvpCell/SinglePvpCell"
import TriplePvpCell from "./TriplePvpCell/TriplePvpCell"

import Advisor from "../../../Advisor/Advisor"
import TheadElement from "../../../MetrixTable/TheadElement"
import LineElement from "../../../MetrixTable/LineElement"

import MatrixTable from "./MatrixTable/MatrixTable"

class TableBodyRender extends React.PureComponent {
    constructor(props) {
        super(props);
        this.addStar = this.addStar.bind(this)
    }

    makeTableLines() {
        return [
            [
                <th key={"zero"} className="tableBorder theadT p-0 px-1" scope="col" />,

                ...this.props.rightPanel.listForBattle.map((pok, j) =>
                    <TheadElement
                        key={j + pok.name + "thead"} pok={pok} j={j}
                        pokemonTable={this.props.pokemonTable} addStar={this.addStar}
                    />
                ),
            ],

            ...this.props.leftPanel.listForBattle.map((pok, i) =>
                [
                    <LineElement key={i + pok.name + "line"} pok={pok} i={i}
                        pokemonTable={this.props.pokemonTable} addStar={this.addStar}
                    />
                ]
            ),
        ]
    }

    addStar(pokName, moveName) {
        return (this.props.pokemonTable[pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    pvpSingle(data) {
        //markup table
        let arr = this.makeTableLines()


        //fill cells
        data[0].forEach((elem) => {
            let line = elem.I + 1
            let row = elem.K + 1
            arr[line].push(
                <SinglePvpCell
                    key={line + row}
                    rate={elem.Rate}
                    query={"/pvp/single/" + this.props.league + "/" +
                        encodeURIComponent(elem.QueryA) + "/" + encodeURIComponent(elem.QueryB) + this.props.pvpoke}
                />
            )
        })
        return arr
    }



    pvpTriple(data, pvpoke) {
        //markup table
        let arr = this.makeTableLines()

        //fill cells
        data[0].forEach((elem, i) => {
            let line = elem.I + 1
            let row = elem.K + 1
            let rating = Math.round((elem.Rate + data[1][i].Rate + data[2][i].Rate) / 3)
            data[0][i].Rate = rating

            arr[line].push(
                < TriplePvpCell
                    key={line + row}

                    rate0={elem.Rate}
                    rate1={data[1][i].Rate}
                    rate2={data[2][i].Rate}
                    overallRating={rating}
                    queries={
                        [
                            "/pvp/single/" + this.props.league + "/" +
                            encodeURIComponent(elem.QueryA) + "/" + encodeURIComponent(elem.QueryB) + this.props.pvpoke,
                            "/pvp/single/" + this.props.league + "/" +
                            encodeURIComponent(data[1][i].QueryA) + "/" + encodeURIComponent(data[1][i].QueryB) + this.props.pvpoke,
                            "/pvp/single/" + this.props.league + "/" +
                            encodeURIComponent(data[2][i].QueryA) + "/" + encodeURIComponent(data[2][i].QueryB) + this.props.pvpoke
                        ]}
                />
            )
        });
        return arr
    }


    render() {
        return (
            this.props.isAdvisor ?
                <Advisor
                    list={this.props.list}
                    rawResult={this.props.isTriple ? this.pvpTriple(this.props.pvpData) : this.pvpSingle(this.props.pvpData)}

                    pokemonTable={this.props.pokemonTable}
                    moveTable={this.props.moveTable}

                    leftPanel={this.props.leftPanel}
                    rightPanel={this.props.rightPanel}
                /> :
                <MatrixTable
                    tableLines={this.props.isTriple ? this.pvpTriple(this.props.pvpData) : this.pvpSingle(this.props.pvpData)}
                />
        );
    }
};

export default TableBodyRender;
