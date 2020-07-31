import React from "react"

const Loader = React.memo(function (props) {
    return (
        <svg width={24} height={24} strokeWidth={2} strokeLinecap="round">
            <path d={"M12 6 V 2"} stroke="white">
                <animate attributeName="opacity"
                    values="0.2;0.3;0.4;0.6;0.7;0.8;0.9;1;0.2" dur={props.duration} repeatCount="indefinite" />
            </path>
            <path d={"M16.24 7.76 L19.07 4.93"} stroke="white">
                <animate attributeName="opacity"
                    values="0.3;0.4;0.6;0.7;0.8;0.9;1;0.2;0.3" dur={props.duration} repeatCount="indefinite" />
            </path>
            <path d={"M18 12 H 22"} stroke="white">
                <animate attributeName="opacity"
                    values="0.4;0.6;0.7;0.8;0.9;1;0.2;0.3;0.4" dur={props.duration} repeatCount="indefinite" />
            </path>
            <path d={"M16.24 16.24 L19.07 19.07"} stroke="white">
                <animate attributeName="opacity"
                    values="0.6;0.7;0.8;0.9;1;0.2;0.3;0.4;0.6" dur={props.duration} repeatCount="indefinite" />
            </path>
            <path d={"M12 18 V 22"} stroke="white">
                <animate attributeName="opacity"
                    values="0.7;0.8;0.9;1;0.2;0.3;0.4;0.6;0.7" dur={props.duration} repeatCount="indefinite" />
            </path>
            <path d={"M7.76 16.24 L4.93 19.07"} stroke="white" >
                <animate attributeName="opacity"
                    values="0.8;0.9;1;0.2;0.3;0.4;0.6;0.7;0.8" dur={props.duration} repeatCount="indefinite" />
            </path>
            <path d={"M6 12 H 2"} stroke="white">
                <animate attributeName="opacity"
                    values="0.9;1;0.2;0.3;0.4;0.6;0.7;0.8;0.9" dur={props.duration} repeatCount="indefinite" />
            </path>
            <path d={"M7.76 7.76 L4.93 4.93"} stroke="white" >
                <animate attributeName="opacity"
                    values="1;0.2;0.3;0.4;0.6;0.7;0.8;0.9;1" dur={props.duration} repeatCount="indefinite" />
            </path>
        </svg>
    )
})

export default Loader
