import React from "react";

import { ReactComponent as Raid } from "../../icons/raid.svg";


function multiply(n, key) {
    var result = []
    if (Number(n) < 0) {
        return result
    }
    for (var i = 0; i < Number(n); i++) {
        result.push(<Raid key={key + i} className={"icon24 ml-1"} />)
    }
    return result
}


const IconMultiplicator = React.memo(function Pokemon(props) {
    return (
        <>
            {props.title}
            {multiply(props.n, props.title)}
        </>
    )
});
export default IconMultiplicator;