import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import ForumIcon from '@material-ui/icons/Forum';
import LanguageIcon from '@material-ui/icons/Language';
import TelegramIcon from '@material-ui/icons/Telegram';

import NavbarPanel from "./NavbarPanel/NavbarPanel";
import DropdownMenu from "App/Navbar/DropdownMenu/DropdownMenu";
import NavUser from "./NavUser/NavUser";
import Search from "./Search/Search";

import { navlocale } from "locale/Navbar/Navbar";
import { getCookie } from "js/getCookie";

import { ReactComponent as En } from "icons/us.svg";
import { ReactComponent as Ru } from "icons/ru.svg";
import { ReactComponent as Battle } from "icons/battle.svg";
import { ReactComponent as Others } from "icons/others.svg";
import { ReactComponent as Redgym } from "icons/redgym.svg";
import { ReactComponent as Dex } from "icons/dex.svg";
import { ReactComponent as Patreon } from "icons/patreon.svg";

let strings = new LocalizedStrings(navlocale);


class Navbar extends React.PureComponent {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        document.cookie = "appLang=" + event.currentTarget.getAttribute("name") + "; path=/; max-age=31536000"
        this.props.history.go()
    }

    render() {
        const flexStyle = { display: "flex", alignItems: "center" }

        return (
            <NavbarPanel
                leftPanel={[
                    <DropdownMenu key="pvp" icon={<Battle />} label={strings.navbar.pvpTools}>
                        <Link to="/pvp/single">{strings.navbar.single}</Link>
                        <Link to="/pvp/matrix">{strings.navbar.matrix}</Link>
                        <Link to="/pvprating">{strings.navbar.pvprating}</Link>
                    </DropdownMenu>,
                    <DropdownMenu key="pve" icon={<Redgym />} label={strings.navbar.pveTools}>
                        <Link to="/raids">{strings.navbar.raids}</Link>
                        <Link to="/pve/common">{strings.navbar.raidsim}</Link>
                        <Link to="/pve/custom">{strings.navbar.userRaidsim}</Link>
                    </DropdownMenu>,
                    <DropdownMenu key="dex" icon={<Dex />} label={strings.navbar.dex}>
                        <Link to="/movedex">{strings.navbar.movedex}</Link>
                        <Link to="/pokedex">{strings.navbar.pokedex}</Link>
                    </DropdownMenu>,
                    <DropdownMenu key="other" icon={<Others />} label={strings.navbar.otherTools}>
                        <Link to="/evolution">{strings.navbar.evo}</Link>
                        <Link to="/eggs">{strings.navbar.eggs}</Link>
                        <Link to="/shinybroker">{strings.navbar.shbroker}</Link>
                    </DropdownMenu>,
                ]}

                rightPanel={[
                    <NavUser key="user" />,
                    <DropdownMenu key="media" icon={<ForumIcon />}>
                        <a style={flexStyle} title={"Telegram"} href="https://t.me/pogpvp">
                            <TelegramIcon style={{ fontSize: 32, marginRight: "8px" }} /><span>{strings.navbar.tlg}</span>
                        </a>
                        <a style={flexStyle} title={"Patreon"} href="https://www.patreon.com/pogpvp">
                            <Patreon style={{ width: 32, height: 32, marginRight: "8px" }} /><span>{strings.navbar.patr}</span>
                        </a>
                    </DropdownMenu>,
                    <DropdownMenu key="lang" icon={<LanguageIcon />}>
                        <div style={flexStyle} name="ru" onClick={this.onClick}>
                            <Ru title={"Русский"} style={{ width: 32, height: 32, marginRight: "8px" }} />{"Русский"}
                        </div>
                        <div style={flexStyle} name="en" onClick={this.onClick}>
                            <En title={"English"} style={{ width: 32, height: 32, marginRight: "8px" }} />{"English"}
                        </div>
                    </DropdownMenu>,
                    <Search key="search" />,
                ]}
            />
        );
    }
}

export default withRouter(Navbar);

