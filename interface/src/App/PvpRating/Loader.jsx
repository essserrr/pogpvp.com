import React from "react";
import BarLoader from "react-spinners/BarLoader";


const Loader = React.memo(function (props) {
    return (
        <div className={props.class ? props.class : "row justify-content-center"}  >
            <div className={props.innerClass ? props.innerClass : ""}
                style={{ textAlign: "center", fontWeight: props.weight, color: props.color }} >
                {props.locale}
                <BarLoader
                    height={props.height ? props.height : 4}
                    width={props.width ? props.width : 100}
                    color={props.color}
                    loading={props.isLoading}
                />
            </div>
        </div>
    )
});

export default Loader;