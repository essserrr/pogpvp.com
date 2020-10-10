import React from "react"
import { Collapse } from "react-collapse"
import { useMediaQuery } from 'react-responsive'

const NavbarCollapse = React.memo(function (props) {
    const isLG = useMediaQuery({ query: '(max-width: 992px)' })
    return (
        <Collapse isOpened={!isLG || props.isOpened}>
            {props.children}
        </Collapse>
    )
});

export default NavbarCollapse;
