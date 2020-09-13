import React from "react"

import { ReactComponent as Raid } from "../../../../icons/raid.svg"

const IconMultiplicator = React.memo(function (props) {

    function multiply(n, key) {
        if (Number(n) < 0) {
            return []
        }
        let result = []
        for (let i = 0; i < Number(n); i++) {
            result.push(<Raid key={key + i} className={"icon24 ml-1"} />)
        }
        return result
    }

    return (
        <>
            {props.title}
            {multiply(props.n, props.title)}
        </>
    )
});
export default IconMultiplicator;