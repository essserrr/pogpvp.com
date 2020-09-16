import React from "react"
import Button from "./Button/Button"

import "./DoubleSlider.scss"

const DoubleSlider = React.memo(function (props) {
    return (
        <div className={"doubleslider-group row m-0 my-2 text-center justify-content-center"} >
            <Button
                attr={props.attr1}
                title={props.title1}
                class={props.active1 ?
                    "doubleslider-group__button active col py-1" : "doubleslider-group__button col py-1"}
                onClick={props.onClick}
            />
            <Button
                attr={props.attr2}
                title={props.title2}
                class={props.active2 ?
                    "doubleslider-group__button active col py-1" : "doubleslider-group__button col py-1"}
                onClick={props.onClick}
            />
        </div>
    )
});

export default DoubleSlider;