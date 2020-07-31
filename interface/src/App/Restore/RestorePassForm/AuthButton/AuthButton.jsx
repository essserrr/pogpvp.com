import React from "react"
import Loader from "./Loader/Loader"
import "./AuthButton.scss"

const AuthButton = React.memo(function (props) {
    return (
        <button
            onClick={props.onClick}
            disabled={props.disabled}
            className="button"
            type="submit"
        >
            <div className="button__item p-1">
                {props.loading ? <Loader duration="1.5s" /> : props.title}
            </div>
        </button>
    )
})

export default AuthButton
