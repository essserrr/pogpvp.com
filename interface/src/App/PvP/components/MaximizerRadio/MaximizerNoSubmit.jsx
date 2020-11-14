import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Input from 'App/Components/Input/Input';


import LocalizedStrings from "react-localization";
import { maximizer } from "locale/Pvp/Maximizer/Maximizer";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(maximizer);

const MaximizerNoSubmit = React.memo(function MaximizerNoSubmit(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container>

            <FormControl component="fieldset">
                <FormLabel component="legend" style={{ color: "black" }}>{`${strings.iv}:`}</FormLabel>
                <RadioGroup row name="action" value={props.value.action}
                    onChange={(event, ...other) => props.onChange(event, { attr: props.attr, name: "action", category: props.category }, ...other)}
                >
                    <FormControlLabel value="Maximize" control={<Radio />} label={strings.maximizer.maximize} />
                    <FormControlLabel value="Default" control={<Radio />} label={strings.maximizer.default} />
                </RadioGroup>
            </FormControl>

            <Collapse in={props.value.action === "Maximize"}>
                <FormControl component="fieldset" >
                    <RadioGroup row name="stat" value={props.value.stat}
                        onChange={(event, ...other) => props.onChange(event, { attr: props.attr, name: "stat", category: props.category }, ...other)}
                    >
                        <FormControlLabel value="Overall" control={<Radio />} label={strings.maximizer.overall} />
                        <FormControlLabel value="Atk" control={<Radio />} label={strings.atk} />
                        <FormControlLabel value="Def" control={<Radio />} label={strings.def} />
                    </RadioGroup>
                </FormControl>

                <Tooltip placement="top" arrow
                    title={<Typography color="inherit">{`${strings.lvl}: 1-45`}</Typography>}>
                    <FormControl component="fieldset">
                        <Input
                            label={strings.maximizer.levelTitle}
                            name="level"
                            attr={props.attr}
                            value={props.value.level}
                            category={props.category}
                            onChange={props.onChange}
                        />
                    </FormControl>
                </Tooltip>
            </Collapse>

        </Grid>
    )
});

export default MaximizerNoSubmit;

MaximizerNoSubmit.propTypes = {
    attr: PropTypes.string,
    action: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
};