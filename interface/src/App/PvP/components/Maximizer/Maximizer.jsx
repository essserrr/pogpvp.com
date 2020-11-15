import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Input from 'App/Components/Input/Input';
import RadioGroup from "./RadioGroup";


import LocalizedStrings from "react-localization";
import { maximizer } from "locale/Pvp/Maximizer/Maximizer";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(maximizer);

const useStyles = makeStyles((theme) => ({
    collapseMargin: {
        marginTop: `${theme.spacing(1)}px`,
    },
    fieldSet: {
        width: "100%",
    },
}));

const Maximizer = React.memo(function Maximizer(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Grid container justify="center">

            <Tooltip title={<Typography>{strings.mode}</Typography>}>
                <FormControl component="fieldset" className={classes.fieldSet}>
                    <FormLabel component="legend" style={{ color: "black" }}>{`${strings.iv}:`}</FormLabel>
                    <RadioGroup attr={props.attr} name={"action"} category={props.category} value={props.value.action} onChange={props.onChange}>
                        <FormControlLabel value="Maximize" control={<Radio />} label={strings.maximizer.maximize} />
                        <FormControlLabel value="Default" control={<Radio />} label={strings.maximizer.default} />
                    </RadioGroup>
                </FormControl>
            </Tooltip>


            <Collapse in={props.value.action === "Maximize"}>

                <Grid container justify="center" spacing={1} className={props.value.action === "Maximize" ? classes.collapseMargin : ""}>

                    <Grid item xs={12}>
                        <Tooltip title={<Typography>{strings.stat}</Typography>}>
                            <FormControl component="fieldset" className={classes.fieldSet}>
                                <RadioGroup attr={props.attr} name={"stat"} category={props.category} value={props.value.stat} onChange={props.onChange}>
                                    <FormControlLabel value="Overall" control={<Radio />} label={strings.maximizer.overall} />
                                    <FormControlLabel value="Atk" control={<Radio />} label={strings.atk} />
                                    <FormControlLabel value="Def" control={<Radio />} label={strings.def} />
                                </RadioGroup>
                            </FormControl>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={12}>
                        <Tooltip placement="top" arrow title={<Typography color="inherit">{`${strings.lvl}: 1-45`}</Typography>}>
                            <FormControl component="fieldset">
                                <Input label={strings.maximizer.levelTitle} name="level" attr={props.attr} value={props.value.level} category={props.category} onChange={props.onChange} />
                            </FormControl>
                        </Tooltip>
                    </Grid>

                </Grid>

            </Collapse>


        </Grid>
    )
});

export default Maximizer;

Maximizer.propTypes = {
    attr: PropTypes.string,
    action: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
};