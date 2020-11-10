import React from "react";
import PropTypes from 'prop-types';

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";

const ButtonsBlock = React.memo(function ButtonsBlock(props) {
    const { filter, onFilter } = props;

    return (

        <SliderBlock>
            <SliderButton attr="eggs0" toggled={!!filter.eggs0} onClick={onFilter}>
                {"10km"}
            </SliderButton>

            <SliderButton attr="eggs1" toggled={!!filter.eggs1} onClick={onFilter}>
                {"7km"}
            </SliderButton>

            <SliderButton attr="eggs2" toggled={!!filter.eggs2} onClick={onFilter}>
                {"5km"}
            </SliderButton>

            <SliderButton attr="eggs3" toggled={!!filter.eggs3} onClick={onFilter}>
                {"2km"}
            </SliderButton>

            <SliderButton attr="eggs4" toggled={!!filter.eggs4} onClick={onFilter}>
                {"10km (AC)"}
            </SliderButton>

            <SliderButton attr="eggs5" toggled={!!filter.eggs5} onClick={onFilter}>
                {"5km (AC)"}
            </SliderButton>

            <SliderButton attr="eggs6" toggled={!!filter.eggs6} onClick={onFilter}>
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