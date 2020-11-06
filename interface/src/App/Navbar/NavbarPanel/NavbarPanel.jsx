import React from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import propTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';

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
    drawer: {
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    },
}));

let strings = new LocalizedStrings(locale)

const NavbarPanel = React.memo(function NavbarPanel(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    const [state, setState] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState(open);
    };

    return (
        <>
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

                    <IconButton edge="start" className={classes.sectionMobile} color="inherit" style={{ outline: "none" }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    {props.rightPanel}

                </Toolbar>
            </AppBar>
            {props.leftPanel && <Drawer open={state} onClose={toggleDrawer(false)} classes={{ paper: classes.drawer }}>
                {props.leftPanel.map((value, key) =>
                    React.cloneElement(value, {
                        closeDrawer: toggleDrawer(false),
                    })
                )}
            </Drawer>}
        </>
    )
});

export default NavbarPanel;

NavbarPanel.propTypes = {
    leftPanel: propTypes.arrayOf(propTypes.node).isRequired,
    rightPanel: propTypes.arrayOf(propTypes.node).isRequired,
};