import React from "react";
import Button from "./Button"

const ButtonsBlock = React.memo(function (props) {
    return (
        <div className={props.class} >
            {props.buttons.map((el, i) =>
                <Button
                    key={el.attr + i}

                    attr={el.attr}
                    title={el.title}
                    disabled={el.disabled}

                    class={el.class}
                    onClick={props.onClick}
                />)}
        </div>
    )
});

export default ButtonsBlock;