import React from "react";
import propTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import ShinyTableThead from "./ShinyTableThead/ShinyTableThead";
import ShinyTableTr from "./ShinyTableTr/ShinyTableTr";

const ShinyTable = React.memo(function ShinyTable(props) {
    return (
        <Table size="medium">
            <ShinyTableThead
                onClick={props.onClick}
                active={props.active}
            />
            <TableBody>
                {props.children.map((value) =>
                    <ShinyTableTr
                        key={value[1].Name + value[0]}
                        pok={value[1]}
                        pokTable={props.pokTable}
                    />)}
            </TableBody>
        </Table>
    )
});

export default ShinyTable;

ShinyTable.propTypes = {
    active: propTypes.object.isRequired,
    pokTable: propTypes.object.isRequired,

    onClick: propTypes.func,

    children: propTypes.arrayOf(propTypes.array),
};