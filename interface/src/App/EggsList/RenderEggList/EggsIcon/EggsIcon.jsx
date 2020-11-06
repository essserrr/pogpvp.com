import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { ReactComponent as Egg2km } from "icons/egg2km.svg";
import { ReactComponent as Egg5km } from "icons/egg5km.svg";
import { ReactComponent as Egg10km } from "icons/egg10km.svg";
import { ReactComponent as Egg12km } from "icons/egg12km.svg";
import { ReactComponent as Egg7km } from "icons/egg7km.svg";

import { getCookie } from "js/getCookie";
import { locale } from "locale/Eggs/Eggs";

const useStyles = makeStyles((theme) => ({
    icon: {
        height: 48,
        width: 48,
        marginRight: `${theme.spacing(1)}px`,
    },
}));

let strings = new LocalizedStrings(locale);
const EggsIcon = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    function schooseIcon() {
        switch (props.tier) {
            case "10KM Eggs":
                return <><Egg10km className={classes.icon} />{strings.tierlist.eggs + " 10 km"}</>
            case "7KM Gift Eggs":
                return <><Egg7km className={classes.icon} />{strings.tierlist.eggs + " 7 km"}</>
            case "5KM Eggs":
                return <><Egg5km className={classes.icon} />{strings.tierlist.eggs + " 5 km"}</>
            case "2KM Eggs":
                return <><Egg2km className={classes.icon} />{strings.tierlist.eggs + " 2 km"}</>
            case "10KM Eggs (50KM)":
                return <><Egg10km className={classes.icon} />{strings.tierlist.eggs + " 10 km (50 km Adveture Sync)"}</>
            case "5KM Eggs (25KM)":
                return <><Egg5km className={classes.icon} />{strings.tierlist.eggs + " 5 km (25 km Adveture Sync)"}</>
            case "12KM Strange Eggs":
                return <><Egg12km className={classes.icon} />{strings.tierlist.eggs + " 12 km (Team GO Rocket)"}</>
            default:
                return <>Unknow egg tier</>
        }
    }

    return (
        schooseIcon()
    )
});

export default EggsIcon;

EggsIcon.propTypes = {
    tier: PropTypes.string.isRequired,
};