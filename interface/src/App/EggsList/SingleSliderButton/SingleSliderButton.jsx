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

const SingleSliderButton = React.memo(function SingleSliderButton(props) {
    const classes = useStyles();
    const { title, isActive, attr, onClick } = props;

    return (
        <SliderBlock>
            {[<SliderButton key={0} className={classes.buttonSpacing} attr={attr} toggled={isActive} onClick={onClick}>
                {title}
            </SliderButton>]}
        </SliderBlock>
    )
});

export default SingleSliderButton;


SingleSliderButton.propTypes = {
    attr: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func,

    title: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ])
};