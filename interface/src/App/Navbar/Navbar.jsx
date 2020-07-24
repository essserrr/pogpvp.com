import React from "react";
import DropdownMenu from "./DropdownMenu"
import { Link } from "react-router-dom"

import LocalizedStrings from "react-localization"
import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"

import { ReactComponent as En } from "../../icons/us.svg"
import { ReactComponent as Ru } from "../../icons/ru.svg"
import { ReactComponent as Logo } from "../../icons/logo.svg"
import { ReactComponent as Battle } from "../../icons/battle.svg"
import { ReactComponent as Others } from "../../icons/others.svg"
import { ReactComponent as Redgym } from "../../icons/redgym.svg"
import { ReactComponent as Dex } from "../../icons/dex.svg"

import "./Navbar.scss"

let strings = new LocalizedStrings(locale)

class Navbar extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            dropdownPvP: [
                <Link key="singlePVP" className="dropdown-item " to="/pvp/single">{strings.navbar.single}</Link>,
                <Link key="matrixPVP" className="dropdown-item " to="/pvp/matrix">{strings.navbar.matrix}</Link>,
                <Link key="pvpRating" className="dropdown-item " to="/pvprating">{strings.navbar.pvprating}</Link>,
            ],
            dropdownPvE: [
                <Link key="raidsList" className="dropdown-item " to="/raids">{strings.navbar.raids}</Link>,
                <Link key="commonRaid" className="dropdown-item " to="/pve/common">{strings.navbar.raidsim}</Link>,
            ],
            dropdownDex: [
                <Link key="movedex" className="dropdown-item " to="/movedex">{strings.navbar.movedex}</Link>,
                <Link key="pokedex" className="dropdown-item " to="/pokedex">{strings.navbar.pokedex}</Link>,
            ],
            dropdownOther: [
                <Link key="shinyRates" className="dropdown-item " to="/shinyrates">{strings.navbar.shiny}</Link>,
                <Link key="evolutions" className="dropdown-item " to="/evolution">{strings.navbar.evo}</Link>,
                <Link key="eggsList" className="dropdown-item " to="/eggs">{strings.navbar.eggs}</Link>,
            ],
            dropdownLangs: [
                <div key="ru" name="ru" className="langButton clickable" onClick={this.onClick}>
                    <Ru title={strings.buttons.ru} className="icon24 mx-1"></Ru> {strings.buttons.ru}
                </div>,
                <div key="en" name="en" className="langButton clickable" onClick={this.onClick}>
                    <En title={strings.buttons.en} className="icon24 mx-1"></En> {strings.buttons.en}
                </div>
            ],
            userOpts: [
                <Link key="profile" className="dropdown-item " to="/profile"><i className="far fa-address-card fa-lg mr-1"></i>
                    {strings.navbar.prof}</Link>,
                <div key="logout" name="logout" className="dropdown-item navbar--padding"
                    onClick={this.onClick}>
                    <i className="fas fa-sign-out-alt fa-lg mr-1"></i>{strings.navbar.sout}
                </div>
            ],
            expanded: false,
        };
        this.onExpand = this.onExpand.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();
        document.cookie = "appLang=" + event.currentTarget.getAttribute("name") + "; path=/; max-age=31536000"
        window.location.reload()
    }

    onExpand(event) {
        event.preventDefault();
        this.setState({
            expanded: !this.state.expanded,
        })
    }

    render() {
        return (
            <nav className="navbar-style navbar navbar-expand-md navbar-light px-0 pt-1 pb-1">

                <Link title={strings.buttons.home} className="navbar-brand ml-2 mr-1" to="/"><Logo id="logoicon" className={"icon48"} /></Link>

                <button className="navbar-toggler ml-auto"
                    onClick={this.onExpand}
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded={this.state.expanded}
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={"order-3  order-md-2 collapse navbar-collapse " + (this.state.expanded ? "show" : "")} id="navbarSupportedContent">
                    <ul className="navbar-nav ml-1 ml-md-0 mr-auto">
                        <DropdownMenu
                            list={this.state.dropdownPvP}
                            label={<><Battle id="battleicon" className={"icon36 mr-1"} />{strings.navbar.pvpTools}</>}
                        />

                        <DropdownMenu
                            list={this.state.dropdownPvE}
                            label={<><Redgym id="redgym" className={"icon36 mr-1"} />{strings.navbar.pveTools}</>}

                        />
                        <DropdownMenu
                            list={this.state.dropdownDex}
                            label={<><Dex id="redgym" className={"icon36 mr-1"} />{strings.navbar.dex}</>}

                        />
                        <DropdownMenu
                            list={this.state.dropdownOther}
                            label={<><Others id="othericon" className={"icon36 mr-1"} />{strings.navbar.otherTools}</>}

                        />
                    </ul>
                </div>

                <div className="order-2 order-md-3" >
                    <ul className="navbar-nav flex-row ml-auto ">
                        <DropdownMenu
                            class="mr-2"
                            dropClass="dropdown-menu-right"
                            list={this.state.userOpts}
                            label={
                                <>
                                    <i className="fas fa-user fa-2x clickable"></i>{"Esser"}
                                </>}

                        />
                        <a className="align-self-center" title={"Telegram"} href="https://t.me/pogpvp">
                            <i className="fab fa-telegram fa-2x mr-2 clickable"></i>
                        </a>
                        <DropdownMenu
                            class="mr-2"
                            dropClass="dropdown-menu-right"
                            list={this.state.dropdownLangs}
                            label={<i className="fa fa-globe fa-2x clickable" aria-hidden="true"></i>}

                        />
                    </ul>
                </div>
            </nav>

        );
    }
}

export default Navbar

