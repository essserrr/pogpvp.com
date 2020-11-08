import React from "react"

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";

import "./GenRow.scss"

const GenRow = React.memo(function (props) {

    return (
        <SliderBlock>
            <SliderButton className={"genslider-group__button"} attr="gen1" toggled={!!props.filter.gen1} onClick={props.onFilter}>
                {"# " + 1}
            </SliderButton>
            <SliderButton className={"genslider-group__button"} attr="gen2" toggled={!!props.filter.gen2} onClick={props.onFilter}>
                {"# " + 2}
            </SliderButton>

            <SliderButton className={"genslider-group__button"} attr="gen3" toggled={!!props.filter.gen3} onClick={props.onFilter}>
                {"# " + 3}
            </SliderButton>

            <SliderButton className={"genslider-group__button"} attr="gen4" toggled={!!props.filter.gen4} onClick={props.onFilter}>
                {"# " + 4}
            </SliderButton>

            <SliderButton className={"genslider-group__button"} attr="gen5" toggled={!!props.filter.gen5} onClick={props.onFilter}>
                {"# " + 5}
            </SliderButton>

            <SliderButton className={"genslider-group__button"} attr="gen6" toggled={!!props.filter.gen6} onClick={props.onFilter}>
                {"# " + 6}
            </SliderButton>

            <SliderButton className={"genslider-group__button"} attr="gen7" toggled={!!props.filter.gen7} onClick={props.onFilter}>
                {"# " + 7}
            </SliderButton>

            <SliderButton className={"genslider-group__button"} attr="gen8" toggled={!!props.filter.gen8} onClick={props.onFilter}>
                {"# " + 8}
            </SliderButton>
        </SliderBlock>
    )

});

export default GenRow;