import React from "react";
import { UnmountClosed } from 'react-collapse';

const DropWithArrow = React.memo(function (props) {
    return (
        <>
            <div onClick={props.onShow} className={props.outClass}>
                <div className={props.midClass ? props.midClass : "font-weight-bold ml-1"}>{props.title}</div>
                <i className={props.show ? props.faOpened : props.faClosed}></i>
            </div>
            <UnmountClosed isOpened={props.show}>
                <div className={props.inClass}>
                    {props.elem}
                </div>
            </UnmountClosed>
        </>
    )
});

export default DropWithArrow;