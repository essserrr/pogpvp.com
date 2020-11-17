import React from "react";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';

import Rate from "App/PvP/components/SinglePvpResults/Rate/Rate";
import ColoredMove from "App/Components/ColoredMove/ColoredMove";
import { effectivenessData } from "js/indexFunctions";

const SingleMoveLine = React.memo(function SingleMoveLine(props) {
    return (
        <>
            <TableCell component="th" align="center">
                <ColoredMove type={props.MoveType}>{props.name + props.star}</ColoredMove>
            </TableCell>
            {effectivenessData[props.MoveType].map((elem, i) => {
                const multipl = elem === 0 ? "1.000" : elem.toFixed(3);

                return (
                    <TableCell key={props.line + "offensive" + i}>
                        <Rate value={multipl} forMult reverse></Rate>
                    </TableCell>
                )
            })}
        </>
    )
});

export default SingleMoveLine;

SingleMoveLine.propTypes = {
    MoveType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    line: PropTypes.number,
    name: PropTypes.string,
    star: PropTypes.string,
};