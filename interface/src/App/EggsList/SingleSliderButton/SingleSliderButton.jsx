import React from "react"

import Button from "../../Movedex/MoveCard/DoubleSlider/Button/Button"

import "./SingleSliderButton.scss"

const SingleSliderButton = React.memo(function (props) {
    return (
        <div className={"single-slidergroup row m-0 text-center justify-content-center"} >
            <Button
                attr={props.attr}
                title={props.title}
                class={props.isActive ? "col py-1 single-sliderbutton active" : "col py-1 single-sliderbutton"}
                onClick={props.onClick}
            />
        </div>
    )
});

export default SingleSliderButton;