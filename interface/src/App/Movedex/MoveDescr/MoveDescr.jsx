import React from "react";
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movedex";

let strings = new LocalizedStrings(dexLocale);

const MoveDescr = React.memo(function MoveDescr(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container justify="flex-start" spacing={1}>
            <Grid item xs={12} sm={6} md={4}>
                <Box component="span" fontWeight="bold">{strings.mt.rd}</Box> - {strings.tip.rd}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Box component="span" fontWeight="bold">{strings.mt.re}</Box> - {strings.tip.re}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Box component="span" fontWeight="bold">{strings.mt.cd}</Box> - {strings.tip.cd}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Box component="span" fontWeight="bold">{strings.mt.pd}</Box> - {strings.tip.pd}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Box component="span" fontWeight="bold">{strings.mt.pe}</Box> - {strings.tip.pe}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Box component="span" fontWeight="bold">{strings.mt.dr}</Box> - {strings.tip.dr}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Box component="span" fontWeight="bold">{strings.mt.ef}</Box> - {strings.tip.ef}
            </Grid>
        </Grid>
    )

});

export default MoveDescr;