import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import UserCardDetails from "./UserCardDetails/UserCardDetails";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const UserCard = React.memo(function UserCard(props) {
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <>
            <TableRow className={classes.root}>
                <TableCell component="th" scope="row" align="left">{props.value.Username}</TableCell>
                <TableCell align="center">{props.value.Broker.Country}</TableCell>
                <TableCell align="center">{props.value.Broker.Region}</TableCell>
                <TableCell align="center">{props.value.Broker.City}</TableCell>
                <TableCell align="center">
                    {props.value.Broker.Have ? Object.values(props.value.Broker.Have).length : 0}
                </TableCell>
                <TableCell align="center">
                    {props.value.Broker.Want ? Object.values(props.value.Broker.Want).length : 0}
                </TableCell>

                <TableCell>
                    <IconButton aria-label="expand row" size="small" style={{ outline: "none" }} onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ padding: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <UserCardDetails
                                value={props.value}
                                pokemonTable={props.pokemonTable}
                            />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
});



export default UserCard;

UserCard.propTypes = {
    value: PropTypes.object,
    pokemonTable: PropTypes.object,
};