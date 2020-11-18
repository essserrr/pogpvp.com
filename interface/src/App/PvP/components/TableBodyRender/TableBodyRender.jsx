import React from "react";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';

import TableIcon from "./TableIcon/TableIcon";
import PvpSingleCell from "./PvpSingleCell/PvpSingleCell";
import PvpTripleCell from "./PvpTripleCell/PvpTripleCell";
import Advisor from "../Advisor/Advisor";
import MatrixTable from "./MatrixTable/MatrixTable";

const TableBodyRender = React.memo(function TableBodyRender(props) {

    const makeTableLines = () => {
        //creates arrays fir lines and adds head and first th sell to them
        return (
            [
                [
                    <TableCell key={"zero"} component="th" align="center" scope="col" />,

                    ...props.rightPanel.listForBattle.map((pok, j) =>
                        <TableCell key={j + pok.name + "head"} component="th" align="center" scope="col" >
                            <TableIcon pok={pok} j={j} pokemonTable={props.pokemonTable} moveTable={props.moveTable} />
                        </TableCell>
                    ),
                ],

                ...props.leftPanel.listForBattle.map((pok, i) =>
                    [
                        <TableCell key={i + pok.name + "line"} component="th" align="center" scope="row" >
                            <TableIcon pok={pok} i={i} pokemonTable={props.pokemonTable} moveTable={props.moveTable} />
                        </TableCell>
                    ]
                ),
            ])
    }

    const pvpSingle = (data) => {
        //markup table
        let arr = makeTableLines()

        //fill cells
        data[0].forEach((elem) => {
            let line = elem.I + 1
            let row = elem.K + 1
            arr[line].push(
                <PvpSingleCell
                    key={line + row}
                    rate={elem.Rate}
                    query={"/pvp/single/" + props.league + "/" +
                        encodeURIComponent(elem.QueryA) + "/" + encodeURIComponent(elem.QueryB) + props.pvpoke}
                />
            )
        })
        return arr
    }



    const pvpTriple = (data) => {
        //markup table
        let arr = makeTableLines()

        //fill cells
        data[0].forEach((elem, i) => {
            let line = elem.I + 1
            let row = elem.K + 1
            let rating = Math.round((elem.Rate + data[1][i].Rate + data[2][i].Rate) / 3)
            data[0][i].Rate = rating

            arr[line].push(
                <PvpTripleCell
                    key={line + row}

                    rate0={elem.Rate}
                    rate1={data[1][i].Rate}
                    rate2={data[2][i].Rate}
                    overallRating={rating}
                    queries={
                        [
                            "/pvp/single/" + props.league + "/" +
                            encodeURIComponent(elem.QueryA) + "/" + encodeURIComponent(elem.QueryB) + props.pvpoke,
                            "/pvp/single/" + props.league + "/" +
                            encodeURIComponent(data[1][i].QueryA) + "/" + encodeURIComponent(data[1][i].QueryB) + props.pvpoke,
                            "/pvp/single/" + props.league + "/" +
                            encodeURIComponent(data[2][i].QueryA) + "/" + encodeURIComponent(data[2][i].QueryB) + props.pvpoke
                        ]}
                />
            )
        });
        return arr
    }

    return (
        props.isAdvisor ?
            <Advisor
                list={props.list}
                rawResult={props.isTriple ? pvpTriple(props.pvpData) : pvpSingle(props.pvpData)}

                pokemonTable={props.pokemonTable}
                moveTable={props.moveTable}

                leftPanel={props.leftPanel}
                rightPanel={props.rightPanel}
            /> :
            <MatrixTable>
                {props.isTriple ? pvpTriple(props.pvpData) : pvpSingle(props.pvpData)}
            </MatrixTable>
    )
});

export default TableBodyRender;

MatrixTable.propTypes = {
    pvpData: PropTypes.arrayOf(PropTypes.object),
    pvpoke: PropTypes.bool,
    isAdvisor: PropTypes.bool,
    isTriple: PropTypes.bool,
    league: PropTypes.string,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,

    leftPanel: PropTypes.object,
    rightPanel: PropTypes.object,
};
