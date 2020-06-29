import React from "react";

const RowWrap = React.memo(function (props) {
    return (
        <div className={props.outClass}>
            <div className="row bigCardHeader justify-content-between p-0 mb-1 mx-2 mx-md-3">
                <div className="col-8 m-0 p-0 text-left">{props.locale}</div>
                <i className="align-self-end fas fa-trophy mr-2 mb-sm-1"></i>
            </div>
            {props.class ? <div className={props.class}>
                {props.value}
            </div> : props.value}
        </div>
    )
});

export default RowWrap;