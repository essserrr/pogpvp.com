import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import { getCookie } from "js/getCookie";
import { timeLocale } from "locale/Components/TimeConverter/timeLocale";

let strings = new LocalizedStrings(timeLocale);

const TimeConverter = React.memo(function TimeConverter(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    function timeConverter(timestamp) {
        const a = new Date(timestamp * 1000)

        const year = a.getFullYear()
        const month = strings.month[a.getMonth()]
        const date = a.getDate()
        const hour = a.getHours()
        const min = a.getMinutes()
        const sec = a.getSeconds()
        return date + " " + month + " " + year + (props.getHours ? " " + hour + ":" + min + ":" + sec : "")
    }

    return (
        timeConverter(props.timestamp)
    )
});

export default TimeConverter;

TimeConverter.propTypes = {
    timestamp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};