import React from 'react';
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { getCookie } from "../../../js/getCookie";
import { userLocale } from "../../../locale/userLocale";

let strings = new LocalizedStrings(userLocale);

const useStyles = makeStyles((theme) => ({
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        "& button": {
            padding: 0,
            alignItems: "stretch",
            "& span": {
                "& a": {
                    color: theme.palette.text.primary,
                    width: "100%",
                    height: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    [theme.breakpoints.down('sm')]: {
                        paddingRight: `${theme.spacing(0.5)}px`,
                        paddingLeft: `${theme.spacing(0.5)}px`,
                    }

                }
            }

        }
    },
}));


const UserPageTabs = React.memo(function UserPageTabs(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    //fixes material ui visual bug
    const ref = React.useRef();
    React.useEffect(() => {
        setTimeout(() => {
            ref.current.updateIndicator();
        }, 100);
    });

    function a11yProps(index) { return { id: `${index}`, 'aria-controls': `${index}`, }; }

    const urlList = { info: 0, security: 1, pokemon: 2, move: 3, shinybroker: 4, }

    return (
        <Tabs
            orientation="vertical"
            variant="scrollable"

            action={ref}
            value={urlList[props.activePath]}

            aria-label={strings.upage.prof}
            className={classes.tabs}
        >
            <Tab label={<Link to="/profile/info">{strings.upage.inf}</Link>}
                {...a11yProps(urlList["info"])} />
            <Tab label={<Link to="/profile/security">{strings.upage.sec}</Link>}
                {...a11yProps(urlList["security"])} />
            <Tab label={<Link to="/profile/pokemon">{strings.upage.p}</Link>}
                {...a11yProps(urlList["pokemon"])} />
            <Tab label={<Link to="/profile/move">{strings.upage.m}</Link>}
                {...a11yProps(urlList["move"])} />
            <Tab label={<Link to="/profile/shinybroker" >{strings.upage.shbr}</Link>}
                {...a11yProps(urlList["shinybroker"])} />
        </Tabs>
    );
});

export default UserPageTabs;

UserPageTabs.propTypes = {
    activePath: PropTypes.string.isRequired,
};