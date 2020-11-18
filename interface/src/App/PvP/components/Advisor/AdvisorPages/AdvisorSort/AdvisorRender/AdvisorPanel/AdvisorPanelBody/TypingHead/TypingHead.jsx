import React from "react";

import TableCell from '@material-ui/core/TableCell';

import Iconer from "App/Components/Iconer/Iconer";

import { typeDecoder } from "js/decoders/typeDecoder";

const TypingHead = function TypingHead() {
    return (
        <>
            <TableCell component="th" align="center" scope="col" key={"zero"} />
            {typeDecoder.map((elem, i) =>
                <TableCell component="th" align="center" scope="col" key={i}>
                    <Iconer size={36} folderName="/type/" fileName={String(i)} />
                </TableCell>)}
        </>
    )
};

export default TypingHead;