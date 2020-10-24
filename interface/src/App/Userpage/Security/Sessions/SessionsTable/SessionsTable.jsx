import React from 'react';
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { getCookie } from "../../../../../js/getCookie";
import { userLocale } from "../../../../../locale/UserPage/Security/Security";

let strings = new LocalizedStrings(userLocale);

const SessionsTable = React.memo(function SessionsTable(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{strings.security.br}</TableCell>
                        <TableCell align="center">{strings.security.os}</TableCell>
                        <TableCell align="center">{strings.security.ip}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.children.map((row, rowKey) => (
                        <TableRow key={rowKey}>
                            <TableCell component="th" scope="row">{row.Browser}</TableCell>
                            <TableCell align="center">{row.OS}</TableCell>
                            <TableCell align="center">{row.IP}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default SessionsTable;

SessionsTable.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                Browser: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node,
                ]),
                OS: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node,
                ]),
                IP: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node,
                ]),
            })
        ),
    ]),
};
