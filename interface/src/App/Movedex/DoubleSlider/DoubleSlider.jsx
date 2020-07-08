import React from "react";
import Button from "../Button/Button"

const DoubleSlider = React.memo(function (props) {
    return (
        <div className={"row m-0 my-2 text-center sliderButton justify-content-center"} >
            <Button
                attr={props.attr1}
                title={props.title1}
                class={props.active1 ? "col py-1 dexRadio active" : "col py-1 dexRadio"}
                onClick={props.onClick}
            />
            <Button
                attr={props.attr2}
                title={props.title2}
                class={props.active2 ? "col py-1 dexRadio active" : "col py-1 dexRadio"}
                onClick={props.onClick}
            />
        </div>
    )
});

export default DoubleSlider;