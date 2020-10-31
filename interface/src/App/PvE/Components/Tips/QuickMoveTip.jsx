import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import { locale } from "locale/Pve/Tips/MoveTips";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const QuickMoveTip = React.memo(function QuickMoveTip(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { moveName, moveTable, hasTitle } = props;

    return (
        <>
            {hasTitle && <>{strings.quick}<br /></>}
            {moveName && moveTable[moveName] !== undefined &&
                <>
                    {`${strings.move.damage}${moveTable[moveName].Damage}`}<br />
                    {`${strings.move.energy}${moveTable[moveName].Energy}`}<br />
                    {`Cooldown: ${moveTable[moveName].Cooldown / 1000}`}<br />
                    {`DPS: ${(moveTable[moveName].Damage / (moveTable[moveName].Cooldown / 1000)).toFixed(2)}`}<br />
                    {`EPS: ${(moveTable[moveName].Energy / (moveTable[moveName].Cooldown / 1000)).toFixed(2)}`}<br />
                </>}
        </>
    )
});

export default QuickMoveTip;

QuickMoveTip.propTypes = {
    hasTitle: PropTypes.bool,
    moveName: PropTypes.string,
    moveTable: PropTypes.object,
};