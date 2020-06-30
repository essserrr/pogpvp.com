import React from "react";

const Header = React.memo(function (props) {
    return (
        <div className={props.classOut}>
            {props.title}
            <div className={props.class + (props.checked === true ? "fas fa-angle-up fa-md" : "fas fa-angle-down fa-md")} />
        </div>
    )

});

export default Header;