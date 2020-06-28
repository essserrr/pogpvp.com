import React from "react";

const Header = React.memo(function Pokemon(props) {
    return (
        <div className={props.classOut}>
            {props.title}
            <div className={props.class + (props.checked ? "fas fa-angle-down fa-md" : "fas fa-angle-up fa-md")} />
        </div>
    )

});

export default Header;