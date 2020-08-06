import React from "react"

const Input = React.memo(function (props) {
    return (
        <input
            className={props.class ? props.class : " modifiedBorder form-control"}

            name={props.name}
            type="text"
            attr={props.attr}
            value={props.value}


            data-tip data-for={props.for}
            placeholder={props.place}

            readOnly={props.readonly}

            onChange={props.onChange}
            onClick={props.onClick}
        />
    )
});

export default Input