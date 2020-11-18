import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import UsesList from "../UsesList/UsesList";
import EffTable from "App/Pokedex/PokeCard/SliderBody/EffBlock/EffTable";

const SliderBody = React.memo(function SliderBody(props) {

    return (
        <>
            <Collapse in={props.active.eff}>
                <Grid container>
                    <EffTable type={[props.move.MoveType]} reverse={true} />
                </Grid>
            </Collapse>

            <Collapse in={props.active.use}>
                <Grid container>
                    <UsesList move={props.move} pokTable={props.pokemonBase} />
                </Grid>
            </Collapse>
        </>
    )

});

export default SliderBody;

SliderBody.propTypes = {
    pokemonBase: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired,
    move: PropTypes.object.isRequired,
};