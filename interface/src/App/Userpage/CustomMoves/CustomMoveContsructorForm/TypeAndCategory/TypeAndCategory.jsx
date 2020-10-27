import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import InputWithError from "App/Components/InputWithError/InputWithError";
import Iconer from "App/Components/Iconer/Iconer"

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomMoves/CustomMoves";

let strings = new LocalizedStrings(userLocale);

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: `${theme.spacing(0.5)}px`,
    },
}));

const TypeAndCategory = React.memo(function TypeAndCategory(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { moveCategory, moveType, onChange, ...other } = props;
    const classes = useStyles();

    return (
        <Grid container justify="center" {...other}>
            <Grid item xs={12} md={6}>
                <InputWithError
                    label={strings.moveconstr.category}
                    select

                    name="MoveCategory"
                    value={moveCategory}
                    onChange={onChange}
                >
                    <MenuItem value="Fast Move" >{strings.moveconstr.catopt.q}</MenuItem>
                    <MenuItem value="Charge Move" >{strings.moveconstr.catopt.ch}</MenuItem>
                </InputWithError>
            </Grid>
            <Grid item xs={12} md={6}>
                <InputWithError
                    label={strings.moveconstr.type}
                    name="MoveType"
                    select

                    value={moveType}
                    onChange={onChange}
                >
                    <MenuItem value="0" ><Iconer fileName="0" folderName="/type/" size="18" className={classes.icon} /> Bug</MenuItem>
                    <MenuItem value="1" ><Iconer fileName="1" folderName="/type/" size="18" className={classes.icon} />Dark</MenuItem>
                    <MenuItem value="2" ><Iconer fileName="2" folderName="/type/" size="18" className={classes.icon} />Dragon</MenuItem>
                    <MenuItem value="3" ><Iconer fileName="3" folderName="/type/" size="18" className={classes.icon} />Electric</MenuItem>
                    <MenuItem value="4" ><Iconer fileName="4" folderName="/type/" size="18" className={classes.icon} />Fairy</MenuItem>
                    <MenuItem value="5" ><Iconer fileName="5" folderName="/type/" size="18" className={classes.icon} />Fighting</MenuItem>
                    <MenuItem value="6" ><Iconer fileName="6" folderName="/type/" size="18" className={classes.icon} />Fire</MenuItem>
                    <MenuItem value="7" ><Iconer fileName="7" folderName="/type/" size="18" className={classes.icon} />Flying</MenuItem>
                    <MenuItem value="8" ><Iconer fileName="8" folderName="/type/" size="18" className={classes.icon} />Ghost</MenuItem>
                    <MenuItem value="9" ><Iconer fileName="9" folderName="/type/" size="18" className={classes.icon} />Grass</MenuItem>
                    <MenuItem value="10" ><Iconer fileName="10" folderName="/type/" size="18" className={classes.icon} />Ground</MenuItem>
                    <MenuItem value="11" ><Iconer fileName="11" folderName="/type/" size="18" className={classes.icon} />Ice</MenuItem>
                    <MenuItem value="12" ><Iconer fileName="12" folderName="/type/" size="18" className={classes.icon} />Normal</MenuItem>
                    <MenuItem value="13" ><Iconer fileName="13" folderName="/type/" size="18" className={classes.icon} />Poison</MenuItem>
                    <MenuItem value="14" ><Iconer fileName="14" folderName="/type/" size="18" className={classes.icon} />Psychic</MenuItem>
                    <MenuItem value="15" ><Iconer fileName="15" folderName="/type/" size="18" className={classes.icon} />Rock</MenuItem>
                    <MenuItem value="16" ><Iconer fileName="16" folderName="/type/" size="18" className={classes.icon} />Steel</MenuItem>
                    <MenuItem value="17" ><Iconer fileName="17" folderName="/type/" size="18" className={classes.icon} />Water</MenuItem>
                </InputWithError>
            </Grid>
        </Grid>
    )
});

export default TypeAndCategory;

TypeAndCategory.propTypes = {
    moveCategory: PropTypes.string,
    moveType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    onChange: PropTypes.func,
};