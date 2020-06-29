import React from "react";


const FaButton = React.memo(function (props) {
    return (
        <i
            className={props.class}
            aria-hidden="true"
            name={props.name}
            onClick={props.onClick}
        />
    )
});

export default FaButton;