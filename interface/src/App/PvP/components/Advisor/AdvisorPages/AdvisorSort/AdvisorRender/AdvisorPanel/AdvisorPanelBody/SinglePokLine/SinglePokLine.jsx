import React from "react";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';

import Rate from "App/PvP/components/SinglePvpResults/Rate/Rate";
import TableIcon from "App/PvP/components/TableBodyRender/TableIcon/TableIcon";

const SinglePokLine = React.memo(function SinglePokLine(props) {
    return (
        <>
            <TableCell component="th" align="center">
                <TableIcon pok={props.pok} pokemonTable={props.pokemonTable} />
            </TableCell>

            {props.vun[props.i].map((elem, k) => {

                return (
                    <TableCell key={props.i + "defensive" + k} align="center" >
                        <Rate value={elem} forMult></Rate>
                    </TableCell>
                )
            })}
        </>
    )
});

export default SinglePokLine;

SinglePokLine.propTypes = {
    i: PropTypes.number,
    pok: PropTypes.object,
    pokemonTable: PropTypes.object,
    vun: PropTypes.array,
};