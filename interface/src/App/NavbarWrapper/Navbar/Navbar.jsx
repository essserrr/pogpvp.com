import React from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import propTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';


import { locale } from "locale/Navbar/Navbar";
import { getCookie } from "js/getCookie";
import { ReactComponent as Logo } from "icons/logo.svg";

const useStyles = makeStyles((theme) => ({
    logo: {
        width: 48,
        height: 48,
    },
    grow: {
        flexGrow: 1,
    },
    sectionDesktop: {
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    sectionMobile: {
        display: 'none',
        [theme.breakpoints.down('md')]: {
            display: 'flex',
        },
    },
}));

let strings = new LocalizedStrings(locale)

const Navbar = React.memo(function Navbar(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <AppBar position="static" color="default">
            <Toolbar >

                <IconButton style={{ outline: "none" }}>
                    <Link title={strings.home} to="/">
                        <Logo className={classes.logo} />
                    </Link>
                </IconButton>

                <div className={classes.sectionDesktop}>
                    {props.leftPanel}
                </div>

                <div className={classes.grow} />

                {props.rightPanel}

            </Toolbar>
        </AppBar>
    )
});

export default Navbar;

Navbar.propTypes = {
    leftPanel: propTypes.node.isRequired,
    rightPanel: propTypes.node.isRequired,
};