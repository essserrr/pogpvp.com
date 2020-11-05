import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import UserCard from "./UserCard/UserCard";

import { getCookie } from "js/getCookie";
import { shinyBroker } from "locale/UserPage/ShinyBroker/ShinyBroker";

let strings = new LocalizedStrings(shinyBroker);

const SelectedUsers = React.memo(function SelectedUsers(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="left">{strings.shbroker.int.name}</TableCell>
                    <TableCell align="center">{strings.shbroker.int.country}</TableCell>
                    <TableCell align="center">{strings.shbroker.int.region}</TableCell>
                    <TableCell align="center">{strings.shbroker.int.city}</TableCell>
                    <TableCell align="center">{strings.shbroker.int.have}</TableCell>
                    <TableCell align="center">{strings.shbroker.int.want}</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.values(props.list).map((value, key) => <UserCard key={key} value={value} pokemonTable={props.pokemonTable} />)}
            </TableBody>
        </Table>
    )
});


export default SelectedUsers;

UserCard.propTypes = {
    list: PropTypes.object,
    pokemonTable: PropTypes.object,
};