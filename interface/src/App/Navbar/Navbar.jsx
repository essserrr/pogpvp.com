import React from "react";
import DropdownMenu from "./DropdownMenu"

import LocalizedStrings from 'react-localization';
import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"

import { ReactComponent as En } from "../../icons/us.svg"
import { ReactComponent as Ru } from "../../icons/ru.svg"
import { ReactComponent as Logo } from "../../icons/logo.svg"
import { ReactComponent as Battle } from "../../icons/battle.svg"
import { ReactComponent as Others } from "../../icons/others.svg"
import { ReactComponent as Redgym } from "../../icons/redgym.svg";

let strings = new LocalizedStrings(locale);

class Navbar extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            dropdownPvP: [
                <a key="Single PvP" className="dropdown-item" href="/pvp/single/">{strings.navbar.single}</a>,
                <a key="Matrix PvP" className="dropdown-item" href="/pvp/matrix/">{strings.navbar.matrix}</a>,
                <a key="PvP Rating" className="dropdown-item" href="/pvprating/">{strings.navbar.pvprating}</a>,
            ],
            dropdownPvE: [
                <a key="Raids List" className="dropdown-item" href="/raids/">{strings.navbar.raids}</a>,
                <a key="Raid Simulator" className="dropdown-item" href="/pve/common/">{strings.navbar.raidsim}</a>,
            ],
            dropdownOther: [
                <a key="Sniny Rates" className="dropdown-item" href="/shinyrates/">{strings.navbar.shiny}</a>,
                <a key="Evolution Calc" className="dropdown-item" href="/evolution/">{strings.navbar.evo}</a>,
                <a key="Eggs List" className="dropdown-item" href="/eggs/">{strings.navbar.eggs}</a>,
            ],
            expanded: false,
        };
        this.onExpand = this.onExpand.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();
        document.cookie = "appLang=" + event.currentTarget.getAttribute('name') + "; path=/; max-age=31536000"
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
            <nav className="navstyle navbar navbar-expand-sm navbar-light px-0 pt-1 pb-1">

                <a title={strings.buttons.home} className="navbar-brand ml-2 mr-1" href="/"><Logo id="logoicon" className={"icon48"} /></a>

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

                <div className={"order-3 order-sm-2 collapse navbar-collapse " + (this.state.expanded ? "show" : "")} id="navbarSupportedContent">
                    <ul className="navbar-nav ml-1 ml-sm-0 mr-auto">
                        <DropdownMenu
                            list={this.state.dropdownPvP}
                            label={<><Battle id="battleicon" className={"icon24 mr-1"} />{strings.navbar.pvpTools}</>}
                        />
                        <DropdownMenu
                            list={this.state.dropdownPvE}
                            label={<><Redgym id="redgym" className={"icon24 mr-1"} />{strings.navbar.pveTools}</>}

                        />
                        <DropdownMenu
                            list={this.state.dropdownOther}
                            label={<><Others id="othericon" className={"icon24 mr-1"} />{strings.navbar.otherTools}</>}

                        />
                    </ul>
                </div>

                <div className="order-2 order-sm-3 d-flex flex-row" >
                    <ul className="navbar-nav flex-row ml-auto ">
                        <a title={"Telegram"} href="https://t.me/pogpvp">
                            <i className="fab fa-telegram fa-2x mr-2 clickable"></i>
                        </a>
                        <li
                            name="ru"
                            className="langButton clickable"
                            onClick={this.onClick}
                        >
                            <Ru title={strings.buttons.ru} className="icon24 p-0 m-0 mr-1" ></Ru>
                        </li>
                        <li
                            name="en"
                            className="langButton clickable"
                            onClick={this.onClick}
                        >
                            <En title={strings.buttons.en} className="icon24 p-0 m-0 mr-2" ></En>
                        </li>

                    </ul>
                </div>
            </nav>

        );
    }
}

export default Navbar

