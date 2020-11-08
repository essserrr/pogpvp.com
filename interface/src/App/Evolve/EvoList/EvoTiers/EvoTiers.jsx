import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Tier from "./Tier/Tier";

import { locale } from "locale/Evolve/Evolve";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale)

const EvoTiers = React.memo(function EvoTiers(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { children } = props;


    return (
        children.map((elem, i) => {
            switch (i) {
                case 0:
                    return <Tier key={i + "sep"} list={elem} />
                default:
                    return <Tier key={i + "sep"} class="evo-list__separator my-2" title={strings.tips.evolveTool} list={elem} />
            }
        })
    )
});

export default EvoTiers;

EvoTiers.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
};