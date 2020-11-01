import React from "react";
import LocalizedStrings from "react-localization";

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { locale } from "locale/locale"
import { getCookie } from "js/getCookie"

import Grid from '@material-ui/core/Grid';
import Input from 'App/Components/Input/Input';

let strings = new LocalizedStrings(locale)

const Stats = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <Grid container >
            <Grid item xs >
                <Tooltip title={<Typography color="inherit">{`${strings.stats.lvl}: 1-45`}</Typography>}>
                    <Box>
                        <Input
                            label={strings.stats.lvl}
                            name="Lvl"
                            attr={props.attr}
                            value={props.Lvl}
                            onChange={props.onChange}
                        />
                    </Box>
                </Tooltip>
            </Grid>
            <Grid item xs >
                <Tooltip title={<Typography color="inherit">{`${strings.effStats.atk} IV: 0-15`}</Typography>}>
                    <Box>
                        <Input
                            name="Atk"
                            attr={props.attr}
                            value={props.Atk}
                            onChange={props.onChange}
                            label={strings.effStats.atk}
                        />
                    </Box>
                </Tooltip>
            </Grid>
            <Grid item xs >
                <Tooltip title={<Typography color="inherit">{`${strings.effStats.def} IV: 0-15`}</Typography>}>
                    <Box>
                        <Input
                            name="Def"
                            attr={props.attr}
                            value={props.Def}
                            onChange={props.onChange}
                            label={strings.effStats.def}
                        />
                    </Box>
                </Tooltip>
            </Grid>
            <Grid item xs >
                <Tooltip title={<Typography color="inherit">{`${strings.effStats.sta} IV: 0-15`}</Typography>}>
                    <Box>
                        <Input
                            name="Sta"
                            attr={props.attr}
                            value={props.Sta}
                            onChange={props.onChange}
                            label={strings.effStats.sta}
                        />
                    </Box>
                </Tooltip>
            </Grid>
        </Grid>
    )

});

export default Stats;