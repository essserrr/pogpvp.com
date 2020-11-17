import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import AdvisorPanel from "./AdvisorPanel/AdvisorPanel";

const AdvisorRender = React.memo(function AdvisorRender(props) {
    return (
        <Grid container justify="center" spacing={1}>
            {props.children.map((elem, i) =>
                <Grid key={i} item xs={12}>
                    <AdvisorPanel
                        first={props.leftPanel.listForBattle[elem.first]}
                        second={props.leftPanel.listForBattle[elem.second]}
                        third={props.leftPanel.listForBattle[elem.third]}
                        i={i}

                        list={props.children}
                        rawResult={props.rawResult}

                        leftPanel={props.leftPanel}
                        rightPanel={props.rightPanel}
                        moveTable={props.moveTable}
                        pokemonTable={props.pokemonTable}
                    />
                </Grid>
            )}
        </Grid>
    )
});

export default AdvisorRender;

AdvisorRender.propTypes = {
    leftPanel: PropTypes.object,
    rightPanel: PropTypes.object,

    moveTable: PropTypes.object,
    pokemonTable: PropTypes.object,

    rawResult: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),

    children: PropTypes.arrayOf(PropTypes.object),
};