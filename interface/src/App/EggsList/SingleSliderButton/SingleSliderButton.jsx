import React from "react";
import PropTypes from 'prop-types';

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";

const SingleSliderButton = React.memo(function SingleSliderButton(props) {
    const { title, isActive, attr, onClick } = props;

    return (
        <SliderBlock>
            {[<SliderButton key={0} attr={attr} toggled={isActive} onClick={onClick}>
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