import React from "react";
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";

import LocalizedStrings from "react-localization";
import { instats } from "locale/Pvp/InitialStats/InitialStats";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(instats);

const InitialStats = React.memo(function InitialStats(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <WithIcon tip={strings.tip}>
            <Grid container alignItems="center" wrap="nowrap">

                <Tooltip arrow placement="top" title={<Typography>{`${strings.initialHp} HP: 0 - ${strings.hpTip} HP`}</Typography>}>
                    <Grid item xs>
                        <Input
                            label={"HP"}
                            name="InitialHP"
                            attr={props.attr}
                            value={props.InitialHP}
                            onChange={props.onChange}
                        />
                    </Grid>
                </Tooltip>

                <Tooltip arrow placement="top" title={<Typography>{`${strings.initialEn} ${strings.energyTip}: 0 - 100`}</Typography>}>
                    <Grid item xs>
                        <Input
                            label={strings.energy}
                            name="InitialEnergy"
                            attr={props.attr}
                            value={props.InitialEnergy}
                            onChange={props.onChange}
                        />
                    </Grid>
                </Tooltip>

            </Grid>
        </WithIcon>
    )

});

export default InitialStats;

InitialStats.propTypes = {
    Atk: PropTypes.number,
    Def: PropTypes.number,
    attr: PropTypes.string,
    onChange: PropTypes.func,
};