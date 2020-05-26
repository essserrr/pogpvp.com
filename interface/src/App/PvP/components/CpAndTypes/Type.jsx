import React from "react";

const Type = React.memo(function Pokemon(props) {

    return (
        props.value && <div className={props.class} style={props.style}>
            {props.value}
        </div>
    )

});

export default Type;