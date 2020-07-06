import React from "react";
import Button from "./Button"

const ButtonsBlock = React.memo(function (props) {
    return (
        <div className={props.class} >
            {props.buttons.map((elem, i) =>
                <Button
                    key={elem.attr + i}

                    attr={elem.attr}
                    title={elem.title}
                    disabled={elem.disabled}

                    class={elem.class}
                    onClick={props.onClick}
                />)}
        </div>
    )
});

export default ButtonsBlock;