import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import CustomPvePlayer from "./CustomPvePlayer/CustomPvePlayer";
import AddRow from "./AddRow/AddRow";

const GroupsSettings = React.memo(function GroupsSettings(props) {

    return (
        <Grid container alignItems="center" justify="center" spacing={1}>

            {props.value.map((player, playerNumber) =>
                <Grid item xs={12} key={playerNumber}>
                    <CustomPvePlayer
                        playerNumber={playerNumber}
                        group1={player[0]} group2={player[1]} group3={player[2]}
                        userParties={props.userParties} onChange={props.onChange}
                    />
                </Grid>
            )}

            {props.value.length < 5 &&
                <Grid item xs={12}>
                    <AddRow name="addPlayer" onClick={props.onChange} />
                </Grid>}

        </Grid>
    )
});

export default GroupsSettings;

GroupsSettings.propTypes = {
    attr: PropTypes.string,

    userParties: PropTypes.object,
    value: PropTypes.array,

    onChange: PropTypes.func,
};