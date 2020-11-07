import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";

const useStyles = makeStyles((theme) => ({
    buttonSpacing: {
        paddingLeft: "5px",
        paddingRight: "5px",

        "@media (max-width: 768px)": {
            paddingLeft: "2px",
            paddingRight: "2px",
        },
        "@media (max-width: 576px)": {
            paddingLeft: "1px",
            paddingRight: "1px",
        },
    },
}));

const ButtonsBlock = React.memo(function ButtonsBlock(props) {
    const classes = useStyles();
    const { filter, onFilter } = props;

    return (

        <SliderBlock>
            <SliderButton className={classes.buttonSpacing} attr="eggs0" toggled={String(!!filter.eggs0)} onClick={onFilter}>
                {"10km"}
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="eggs1" toggled={String(!!filter.eggs1)} onClick={onFilter}>
                {"7km"}
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="eggs2" toggled={String(!!filter.eggs2)} onClick={onFilter}>
                {"5km"}
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="eggs3" toggled={String(!!filter.eggs3)} onClick={onFilter}>
                {"2km"}
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="eggs4" toggled={String(!!filter.eggs4)} onClick={onFilter}>
                {"10km (AC)"}
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="eggs5" toggled={String(!!filter.eggs5)} onClick={onFilter}>
                {"5km (AC)"}
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="eggs6" toggled={String(!!filter.eggs6)} onClick={onFilter}>
                {"12km"}
            </SliderButton>
        </SliderBlock>
    )

});

export default ButtonsBlock;

ButtonsBlock.propTypes = {
    filter: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired,
};