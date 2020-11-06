import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { ReactComponent as LogoutIcon } from "icons/logout.svg";

import DropdownMenu from "App/NavbarWrapper/DropdownMenu/DropdownMenu";
import { refresh } from "AppStore/Actions/refresh";
import { setSession } from "AppStore/Actions/actions";
import { getCookie } from "js/getCookie";
import LoginReg from "./LoginReg/LoginReg";
import { locale } from "locale/Navbar/Navbar";

const useStyles = makeStyles((theme) => ({
    dropdown: {
        [theme.breakpoints.down("md")]: {
            "& svg": {
                marginRight: 0,
            }
        },
    },
    navUserText: {
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",

        [theme.breakpoints.down("md")]: {
            width: "0px",
        },
    },
    listItem: {
        display: "flex",
        alignItems: "center",
    },
    listIconStyle: {
        width: 32,
        height: 32,
        marginRight: `${theme.spacing(1)}px`,
    },
}));

let strings = new LocalizedStrings(locale);

const User = React.memo(function User(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();


    async function onClick() {
        await props.refresh()
        try {
            await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/logout", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", }
            })
            props.setSession({ expires: 0, uname: "" })

        } catch (e) {
            props.setSession({ expires: 0, uname: "" })
        }
    }

    return (
        props.session.username ?
            <DropdownMenu className={classes.dropdown}
                icon={<AccountCircleIcon />} label={<div className={classes.navUserText}>{props.session.username}</div>}>
                <Link className={classes.listItem} to="/profile/info">
                    <AccountBoxIcon className={classes.listIconStyle} />
                    {strings.navbar.prof}
                </Link>
                <div className={classes.listItem} onClick={onClick}>
                    <LogoutIcon className={classes.listIconStyle} />{strings.navbar.sout}
                </div>
            </DropdownMenu>
            :
            <LoginReg />
    )
});

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        setSession: (value) => dispatch(setSession(value)),
    }
}

export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(User)