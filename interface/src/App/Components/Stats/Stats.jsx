import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Input from 'App/Components/Input/Input';

import { stats } from "locale/Components/Stats/locale";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(stats);

const maxLevel = 55;

const Stats = React.memo(function Stats(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <Grid container >
            <Grid item xs >
                <Tooltip placement="top" arrow
                    title={<Typography color="inherit">{`${strings.lvl}: 1-${maxLevel}`}</Typography>}>
                    <Box>
                        <Input
                            label={strings.lvl}
                            name="Lvl"
                            attr={props.attr}
                            value={props.Lvl}
                            onChange={props.onChange}
                        />
                    </Box>
                </Tooltip>
            </Grid>
            <Grid item xs >
                <Tooltip placement="top" arrow
                    title={<Typography color="inherit">{`${strings.atk} IV: 0-15`}</Typography>}>
                    <Box>
                        <Input
                            name="Atk"
                            attr={props.attr}
                            value={props.Atk}
                            onChange={props.onChange}
                            label={strings.atk}
                        />
                    </Box>
                </Tooltip>
            </Grid>
            <Grid item xs >
                <Tooltip placement="top" arrow
                    title={<Typography color="inherit">{`${strings.def} IV: 0-15`}</Typography>}>
                    <Box>
                        <Input
                            name="Def"
                            attr={props.attr}
                            value={props.Def}
                            onChange={props.onChange}
                            label={strings.def}
                        />
                    </Box>
                </Tooltip>
            </Grid>
            <Grid item xs >
                <Tooltip placement="top" arrow
                    title={<Typography color="inherit">{`${strings.sta} IV: 0-15`}</Typography>}>
                    <Box>
                        <Input
                            name="Sta"
                            attr={props.attr}
                            value={props.Sta}
                            onChange={props.onChange}
                            label={strings.sta}
                        />
                    </Box>
                </Tooltip>
            </Grid>
        </Grid>
    )

});

export default Stats;

Stats.propTypes = {
    attr: PropTypes.string,
    onChange: PropTypes.func,

    Atk: PropTypes.string,
    Sta: PropTypes.string,
    Def: PropTypes.string,
    Lvl: PropTypes.string,
};