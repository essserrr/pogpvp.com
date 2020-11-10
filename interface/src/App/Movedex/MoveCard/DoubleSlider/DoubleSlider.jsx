import React from "react"
import PropTypes from 'prop-types';

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";

const DoubleSlider = React.memo(function DoubleSlider(props) {
    const { active1, active2, title1, title2, attr1, attr2, onClick } = props;

    return (
        <SliderBlock>
            <SliderButton attr={attr1} toggled={active1} onClick={onClick}>
                {title1}
            </SliderButton>

            <SliderButton attr={attr2} toggled={active2} onClick={onClick}>
                {title2}
            </SliderButton>
        </SliderBlock>
    )
});

export default DoubleSlider;

DoubleSlider.propTypes = {
    active1: PropTypes.bool,
    active2: PropTypes.bool,

    title1: PropTypes.string,
    title2: PropTypes.string,

    attr1: PropTypes.string,
    attr2: PropTypes.string,

    onClick: PropTypes.func,
};