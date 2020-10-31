import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import { locale } from "locale/Pve/Tips/MoveTips";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const ChargeMoveTip = React.memo(function ChargeMoveTip(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { moveName, moveTable, hasTitle } = props;

    return (
        <>
            {hasTitle && <>{strings.charge}<br /></>}

            {(moveName && moveName !== "Select...") && moveTable[moveName] !== undefined &&
                <>
                    {`${strings.move.damage}${moveTable[moveName].Damage}`}<br />
                    {`${strings.move.energy}${-moveTable[moveName].Energy}`}<br />
                    {`${strings.move.cooldown}: ${moveTable[moveName].Cooldown / 1000}`}<br />
                    {`DPS: ${(moveTable[moveName].Damage / (moveTable[moveName].Cooldown / 1000)).toFixed(2)}`}<br />
                    {`DPS*DPE: ${(moveTable[moveName].Damage / (moveTable[moveName].Cooldown / 1000) * moveTable[moveName].Damage / -moveTable[moveName].Energy).toFixed(2)}`}<br />
                </>}
        </>
    )
});

export default ChargeMoveTip;

ChargeMoveTip.propTypes = {
    hasTitle: PropTypes.bool,
    moveName: PropTypes.string,
    moveTable: PropTypes.object,
};