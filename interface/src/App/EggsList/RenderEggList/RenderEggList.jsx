import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import EggsTier from "./EggsTier/EggsTier";
import EggsIcon from "./EggsIcon/EggsIcon";
import FilteredEggsList from "./FilteredEggList/FilteredEggList";

const RenderEggList = React.memo(function RenderEggList(props) {
    const matrix = ["10KM Eggs", "7KM Gift Eggs", "5KM Eggs", "2KM Eggs", "10KM Eggs (50KM)", "5KM Eggs (25KM)", "12KM Strange Eggs"];

    const returnEggsList = () => {
        return matrix.map((block, i) =>
            <Grid item xs={12} key={"eggs" + i}>
                <EggsTier
                    title={<EggsIcon tier={block} />}
                    list={props.children[block]}
                    pokTable={props.pokTable}
                    showReg={props.filter.showReg}
                />
            </Grid>);
    }

    return (
        <Grid container justify="center" spacing={2}>
            <FilteredEggsList filter={props.filter} >
                {returnEggsList()}
            </FilteredEggsList>
        </Grid>
    )
});

export default RenderEggList;

RenderEggList.propTypes = {
    pokTable: PropTypes.object.isRequired,
    props: PropTypes.object,
    children: PropTypes.object,
};







