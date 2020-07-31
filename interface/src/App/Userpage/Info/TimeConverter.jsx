import React from "react";
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../js/getCookie"

import { timeLocale } from "../../../locale/timeLocale"

let strings = new LocalizedStrings(timeLocale)

const TimeConverter = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    function timeConverter(timestamp) {
        let a = new Date(timestamp * 1000)
        let months = [strings.Jan, strings.Feb, strings.Mar, strings.Apr, strings.May, strings.Jun, strings.Jul,
        strings.Aug, strings.Sep, strings.Oct, strings.Nov, strings.Dec]
        let year = a.getFullYear()
        let month = months[a.getMonth()]
        let date = a.getDate()
        let hour = a.getHours()
        let min = a.getMinutes()
        let sec = a.getSeconds()
        var time = date + " " + month + " " + year + (props.getTime ? " " + hour + ":" + min + ":" + sec : "")
        return time
    }


    return (
        timeConverter(props.time)
    )
});

export default TimeConverter