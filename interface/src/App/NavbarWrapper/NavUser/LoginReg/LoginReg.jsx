import React from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';

import { getCookie } from "js/getCookie";
import { locale } from "locale/Navbar/Navbar";

let strings = new LocalizedStrings(locale);

const useStyles = makeStyles((theme) => ({
    iconStyle: {
        color: "white",
        width: 36,
        height: 36,
    },
}));

const LoginReg = React.memo(function LoginReg() {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <>
            <IconButton style={{ outline: "none" }} >
                <Link title={strings.navbar.lin} to="/login">
                    <ExitToAppIcon className={classes.iconStyle} />
                </Link>
            </IconButton>

            <IconButton style={{ outline: "none" }}>
                <Link title={strings.navbar.sup} to="/registration">
                    <PersonAddIcon className={classes.iconStyle} />
                </Link>
            </IconButton>
        </>
    )
});


export default LoginReg