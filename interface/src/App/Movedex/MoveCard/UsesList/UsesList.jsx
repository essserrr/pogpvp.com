import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import ListElement from "./ListElement";

const UsesList = React.memo(function UsesList(props) {

    const moveCategory = props.move.MoveCategory === "Charge Move" ? "ChargeMoves" : "QuickMoves";

    let list = [];
    for (const [key, value] of Object.entries(props.pokTable)) {
        if (value[moveCategory].includes(props.move.Title)) {
            list.push(<ListElement key={key} name={key} value={value} />)
        }
    }

    return (
        list.length > 0 &&
        <Grid container>
            {list}
        </Grid>
    )

});

export default UsesList;

UsesList.propTypes = {
    pokTable: PropTypes.object,
    move: PropTypes.object,
};