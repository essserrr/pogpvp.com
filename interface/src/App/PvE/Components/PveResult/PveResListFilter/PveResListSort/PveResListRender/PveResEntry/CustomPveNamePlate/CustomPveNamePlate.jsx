import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import PlateGroup from "./PlateGroup/PlateGroup";

const CustomPveNamePlate = React.memo(function CustomPveNamePlate(props) {

    return (
        <Grid container spacing={1}>

            {props.pokemonRes.Party.length > 0 &&
                <Grid item xs={12}>
                    <PlateGroup
                        attr={props.attr}
                        i={props.i}
                        subGroup={0}

                        moveTable={props.moveTable}
                        pokemonTable={props.pokemonTable}

                        party={props.pokemonRes.Party.slice(0, props.pokemonRes.Party.length > 6 ? 6 : props.pokemonRes.Party.length)}

                        defineBreakpoints={props.defineBreakpoints}
                    />
                </Grid>}

            {props.pokemonRes.Party.length > 6 &&
                <Grid item xs={12}>
                    <PlateGroup
                        attr={props.attr}
                        i={props.i}
                        subGroup={1}

                        moveTable={props.moveTable}
                        pokemonTable={props.pokemonTable}

                        party={props.pokemonRes.Party.slice(6, props.pokemonRes.Party.length > 12 ? 12 : props.pokemonRes.Party.length)}

                        defineBreakpoints={props.defineBreakpoints}
                    />
                </Grid>}

            {props.pokemonRes.Party.length > 12 &&
                <Grid item xs={12}>
                    <PlateGroup
                        attr={props.attr}
                        i={props.i}
                        subGroup={2}

                        moveTable={props.moveTable}
                        pokemonTable={props.pokemonTable}

                        party={props.pokemonRes.Party.slice(12, props.pokemonRes.Party.length)}

                        defineBreakpoints={props.defineBreakpoints}
                    />
                </Grid>}

        </Grid>
    )
});

export default CustomPveNamePlate;


CustomPveNamePlate.propTypes = {
    i: PropTypes.number,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
    pokemonRes: PropTypes.object,

    defineBreakpoints: PropTypes.func,
};