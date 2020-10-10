import React from "react"

import Navbar from "./Navbar/Navbar"

import DropdownMenu from "./DropdownMenu"
import NavUser from "./NavUser/NavUser"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"

import LocalizedStrings from "react-localization"
import { locale } from "../../locale/locale"
import { getCookie } from "../../js/getCookie"
import Search from "./Search/Search"

import { ReactComponent as En } from "../../icons/us.svg"
import { ReactComponent as Ru } from "../../icons/ru.svg"
import { ReactComponent as Battle } from "../../icons/battle.svg"
import { ReactComponent as Others } from "../../icons/others.svg"
import { ReactComponent as Redgym } from "../../icons/redgym.svg"
import { ReactComponent as Dex } from "../../icons/dex.svg"

let strings = new LocalizedStrings(locale)


class NavbarWrapper extends React.PureComponent {
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
                <Link key="customRaid" className="dropdown-item " to="/pve/custom">{strings.navbar.userRaidsim}</Link>,
            ],
            dropdownDex: [
                <Link key="movedex" className="dropdown-item " to="/movedex">{strings.navbar.movedex}</Link>,
                <Link key="pokedex" className="dropdown-item " to="/pokedex">{strings.navbar.pokedex}</Link>,
            ],
            dropdownOther: [
                <Link key="evolutions" className="dropdown-item " to="/evolution">{strings.navbar.evo}</Link>,
                <Link key="eggsList" className="dropdown-item " to="/eggs">{strings.navbar.eggs}</Link>,
                <Link key="shinyBroker" className="dropdown-item " to="/shinybroker">{strings.navbar.shbroker}</Link>,
            ],
            dropdownSocialMedia: [
                <a key="telegram" className="dropdown-item d-flex align-items-center" title={"Telegram"} href="https://t.me/pogpvp">
                    <i className="fab fa-telegram fa-2x mr-2 clickable"></i><span>{strings.navbar.tlg}</span>
                </a>,
                <a key="patreon" className="dropdown-item d-flex align-items-center" title={"Patreon"} href="https://www.patreon.com/pogpvp">
                    <i className="fab fa-patreon fa-2x mr-2 clickable"></i><span>{strings.navbar.patr}</span>
                </a>,
            ],
            dropdownLanguages: [
                <div key="ru" name="ru" className="navbar__lang-button clickable"
                    onClick={this.onClick}>
                    <Ru title={"Русский"} className="icon24 mx-1"></Ru> {"Русский"}
                </div>,
                <div key="en" name="en" className="navbar__lang-button clickable"
                    onClick={this.onClick}>
                    <En title={"English"} className="icon24 mx-1"></En> {"English"}
                </div>,
            ],
            expanded: false,
        };
        this.onExpand = this.onExpand.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        document.cookie = "appLang=" + event.currentTarget.getAttribute("name") + "; path=/; max-age=31536000"
        this.props.history.go()
    }

    onExpand(event) {
        event.preventDefault();
        this.setState({
            expanded: !this.state.expanded,
        })
    }

    render() {
        return (
            <Navbar
                leftPanel={<>
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
                </>}

                rightPanel={<>
                    <NavUser />
                    <DropdownMenu
                        class="mr-1"
                        dropClass="dropdown-menu-right"
                        label={<i className="fas fa-hashtag fa-2x clickable" aria-hidden="true"></i>}
                        list={this.state.dropdownSocialMedia}
                    />
                    <DropdownMenu
                        class="mr-1"
                        dropClass="dropdown-menu-right"
                        label={<i className="fa fa-globe fa-2x clickable" aria-hidden="true"></i>}
                        list={this.state.dropdownLanguages}
                    />
                    <Search class="mr-2" />
                </>}
                isOpened={this.state.expanded}
                onExpand={this.onExpand}
            />
        );
    }
}

export default withRouter(NavbarWrapper)

