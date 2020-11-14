import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import { moveTips } from "locale/Pvp/MoveTips/MoveTips";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(moveTips);

const MoveTip = React.memo(function MoveTip(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { moveName, moveTable } = props;
    const move = moveTable[moveName];

    return (
        <>
            {move.Category === "Charge Move" ? strings.charge : strings.quick}<br />

            {(moveName && moveName !== "Select...") && move !== undefined &&
                <>
                    {`${strings.move.damage}: ${move.PvpDamage}`}<br />
                    {`${strings.move.energy}: ${-move.PvpEnergy}`}<br />

                    {move.Category !== "Charge Move" &&
                        <>{`${strings.move.duration}: ${move.PvpDuration}`}<br /></>}

                    {(move.Probability !== 0) &&
                        <>
                            <br />{`${strings.move.probability}: ${move.Probability}`}
                            <br />{`${strings.move.target}: ${move.Subject}`}
                            <br />{`${strings.move.stat}: ${move.Stat}`}
                            <br />{`${strings.move.stage}: ${move.StageDelta}`}
                        </>}
                </>}
        </>
    )
});

export default MoveTip;

MoveTip.propTypes = {
    moveName: PropTypes.string,
    moveTable: PropTypes.object,
};