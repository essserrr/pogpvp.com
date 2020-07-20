import React from "react"
import "./AuthInput.scss"

const AuthInput = React.memo(function (props) {
    console.log(props.notOk)
    return (
        <div className="col-12 px-0">
            <div className="col-12 px-0 auth-input__text text-left">
                {props.labelLeft}
            </div>
            <input
                className={"auth-input form-control mx-0 auth-input--mt " + (props.notOk !== "" ? "auth-input--alert" : "")}

                name={props.name}
                value={props.value}

                placeholder={props.place}
                type={props.type}
                autoComplete={props.aCompleteOff ? "new-password" : ""}

                onChange={props.onChange}
            />
        </div>
    )
})

export default AuthInput
