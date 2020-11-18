import React from "react";
import PropTypes from 'prop-types';

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";

const GenRow = React.memo(function GenRow(props) {
    const { filter, onFilter } = props;

    return (
        <SliderBlock>
            <SliderButton attr="gen1" toggled={!!filter.gen1} onClick={onFilter}>
                {"# " + 1}
            </SliderButton>
            <SliderButton attr="gen2" toggled={!!filter.gen2} onClick={onFilter}>
                {"# " + 2}
            </SliderButton>

            <SliderButton attr="gen3" toggled={!!filter.gen3} onClick={onFilter}>
                {"# " + 3}
            </SliderButton>

            <SliderButton attr="gen4" toggled={!!filter.gen4} onClick={onFilter}>
                {"# " + 4}
            </SliderButton>

            <SliderButton attr="gen5" toggled={!!filter.gen5} onClick={onFilter}>
                {"# " + 5}
            </SliderButton>

            <SliderButton attr="gen6" toggled={!!filter.gen6} onClick={onFilter}>
                {"# " + 6}
            </SliderButton>

            <SliderButton attr="gen7" toggled={!!filter.gen7} onClick={onFilter}>
                {"# " + 7}
            </SliderButton>

            <SliderButton attr="gen8" toggled={!!filter.gen8} onClick={onFilter}>
                {"# " + 8}
            </SliderButton>
        </SliderBlock>
    )

});

export default GenRow;

GenRow.propTypes = {
    filter: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired,
};