import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import { impExp } from "locale/ImportExport/ImportExport";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(impExp);

const ImportTips = React.memo(function ImportTips(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { type } = props;

    return (
        <>
            {type === "matrix" && <>
                {strings.importtips.matrix.form}<br />
                {strings.importtips.matrix.p1}<br />
                {strings.importtips.matrix.q1}<br />
                {strings.importtips.matrix.ch1}<br />
                {strings.importtips.matrix.ch2}<br />
                {strings.importtips.matrix.ent}<br />
                {strings.importtips.matrix.p2}<br />
                {strings.importtips.matrix.q1}<br />
                {strings.importtips.matrix.ch1}<br />
                {strings.importtips.matrix.ch2}<br /><br />

                {strings.importtips.matrix.imp}
            </>}
            {type === "shiny" && <>
                {strings.importtips.shiny.form}<br />
                {strings.importtips.shiny.pok1}<br />
                {strings.importtips.shiny.pok2}<br />
                {strings.importtips.shiny.ex}<br />
                {strings.importtips.shiny.expok}<br /><br />

                {strings.importtips.shiny.forms}<br /><br />

                {strings.importtips.shiny.shcheck}
            </>}
            {type === "userPokemon" && <>
                {strings.importtips.matrix.form}<br />
                {strings.importtips.matrix.p1}<br />
                {strings.importtips.matrix.q1}<br />
                {strings.importtips.matrix.ch1}<br />
                {strings.importtips.matrix.ch2}<br />
                {strings.lvl + ","}
                {strings.atk + ","}
                {strings.def + ","}
                {strings.sta + ","}<br />

                {strings.importtips.matrix.ent}<br />
                {strings.importtips.matrix.p2}<br />
                {strings.importtips.matrix.q1}<br />
                {strings.importtips.matrix.ch1}<br />
                {strings.importtips.matrix.ch2}<br />
                {strings.lvl + ","}
                {strings.atk + ","}
                {strings.def + ","}
                {strings.sta + ","}
            </>}
        </>
    )
});

export default ImportTips;

ImportTips.propTypes = {
    type: PropTypes.string,
};