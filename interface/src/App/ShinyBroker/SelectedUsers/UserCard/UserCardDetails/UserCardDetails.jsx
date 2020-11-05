import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import UserShinyCard from "App/Userpage/UserShinyBroker/UserShinyList/UserShinyCard/UserShinyCard";

import { getCookie } from "js/getCookie";
import { shinyBroker } from "locale/UserPage/ShinyBroker/ShinyBroker";

let strings = new LocalizedStrings(shinyBroker)

const UserCardDetails = React.memo(function UserCardDetails(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justify="center">
                    <Typography variant="h6">
                        {strings.shbroker.int.detcont}
                    </Typography>
                    <Box ml={2}>
                        <Typography variant="body1">
                            {props.value.Broker.Contacts}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container alignItems="center" justify="center" spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            {strings.shbroker.int.dethave}
                        </Typography>
                    </Grid>
                    {props.value.Broker.Have && Object.values(props.value.Broker.Have).map((value) =>
                        <UserShinyCard pokemonTable={props.pokemonTable} value={value} attr="have" key={`outerHave${value.Name}`} />)}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container alignItems="center" justify="center" spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            {strings.shbroker.int.detwant}
                        </Typography>
                    </Grid>
                    {props.value.Broker.Want && Object.values(props.value.Broker.Want).map((value) =>
                        <UserShinyCard pokemonTable={props.pokemonTable} value={value} attr="want" key={`outerWant${value.Name}`} />)}
                </Grid>
            </Grid>
        </Grid>
    )
});



export default UserCardDetails;

UserCardDetails.propTypes = {
    value: PropTypes.object,
    pokemonTable: PropTypes.object,
};