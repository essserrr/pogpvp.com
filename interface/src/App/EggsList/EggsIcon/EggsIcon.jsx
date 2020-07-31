import React from "react";
import LocalizedStrings from "react-localization";

import { ReactComponent as Egg2km } from "../../../icons/egg2km.svg";
import { ReactComponent as Egg5km } from "../../../icons/egg5km.svg";
import { ReactComponent as Egg10km } from "../../../icons/egg10km.svg";
import { ReactComponent as Egg7km } from "../../../icons/egg7km.svg";

import { getCookie } from "../../../js/getCookie"
import { locale } from "../../../locale/locale"


let strings = new LocalizedStrings(locale);
const EggsIcon = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    function schooseIcon() {
        switch (props.tier) {
            case "10KM Eggs":
                return <><Egg10km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 10 km"}</>
            case "7KM Gift Eggs":
                return <><Egg7km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 7 km"}</>
            case "5KM Eggs":
                return <><Egg5km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 5 km"}</>
            case "2KM Eggs":
                return <><Egg2km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 2 km"}</>
            case "10KM Eggs (50KM)":
                return <><Egg10km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 10 km (50 km Adveture Sync)"}</>
            default:
                return <><Egg5km className={"icon48 mr-1"} />{strings.tierlist.eggs + " 5 km (25 km Adveture Sync)"}</>
        }
    }
    return (
        schooseIcon()
    )
});


export default EggsIcon;

