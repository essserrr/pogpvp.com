import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Tier from "./Tier/Tier";

import { locale } from "locale/Evolve/Evolve";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale)

const EvoTiers = React.memo(function EvoTiers(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { children } = props;


    return (
        <Grid container justify="center" spacing={2}>
            {children.map((elem, i) =>
                <Grid item xs={12}>
                    {i === 0 ?
                        <Tier disableFont key={i + "sep"}>{elem}</Tier>
                        :
                        <Tier disableFont key={i + "sep"} title={<Typography align="center" variant="body1">{strings.tips.evolveTool}</Typography>}>
                            {elem}
                        </Tier>
                    }
                </Grid>
            )}
        </Grid>
    )
});

export default EvoTiers;

EvoTiers.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
};