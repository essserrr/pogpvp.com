import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";
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

const TypeRow = React.memo(function (props) {
    const { filter, onFilter } = props;
    const classes = useStyles();

    return (
        <SliderBlock>
            <SliderButton className={classes.buttonSpacing} attr="type0" toggled={!!filter.type0} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"0"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type1" toggled={!!filter.type1} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"1"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type2" toggled={!!filter.type2} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"2"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type3" toggled={!!filter.type3} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"3"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type4" toggled={!!filter.type4} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"4"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type5" toggled={!!filter.type5} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"5"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type6" toggled={!!filter.type6} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"6"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type7" toggled={!!filter.type7} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"7"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type8" toggled={!!filter.type8} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"8"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type9" toggled={!!filter.type9} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"9"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type10" toggled={!!filter.type10} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"10"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type11" toggled={!!filter.type11} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"11"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type12" toggled={!!filter.type12} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"12"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type13" toggled={!!filter.type13} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"13"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type14" toggled={!!filter.type14} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"14"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type15" toggled={!!filter.type15} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"15"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type16" toggled={!!filter.type16} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"16"} size={16} />
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="type17" toggled={!!filter.type17} onClick={onFilter}>
                <Iconer folderName="/type/" fileName={"17"} size={16} />
            </SliderButton>
        </SliderBlock>
    )
});

export default TypeRow;

TypeRow.propTypes = {
    filter: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired,
};