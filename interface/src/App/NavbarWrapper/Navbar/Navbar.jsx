import React from "react"
import { Link } from "react-router-dom"
import LocalizedStrings from "react-localization"

import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/getCookie"

import NavbarCollapse from "../NavbarCollapse/NavbarCollapse"
import { ReactComponent as Logo } from "../../../icons/logo.svg"

import "./Navbar.scss"

let strings = new LocalizedStrings(locale)

const Navbar = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <nav className="navbar-style navbar navbar-expand-lg navbar-light px-0 pt-1 pb-1">

            <Link title={strings.buttons.home} className="navbar-brand ml-2 mr-1" to="/">
                <Logo id="logoicon" className={"icon48"} />
            </Link>

            <button type="button" className="navbar-toggler ml-auto" onClick={props.onExpand} aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className={"col-12 col-lg-auto order-3  order-lg-2 px-0"} >
                <NavbarCollapse isOpened={props.isOpened}>
                    <ul className="navbar-nav ml-1 ml-lg-0 mr-auto">
                        {props.leftPanel}
                    </ul>
                </NavbarCollapse>
            </div>

            <div className="order-2 order-lg-3 ml-0 ml-lg-auto" >
                <ul className="navbar-nav flex-row ml-auto ">

                    {props.rightPanel}

                </ul>
            </div>
        </nav>
    )
});



export default Navbar;