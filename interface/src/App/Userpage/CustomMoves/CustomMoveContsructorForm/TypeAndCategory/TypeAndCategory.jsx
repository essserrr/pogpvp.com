import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import InputWithError from "../../../../Components/InputWithError/InputWithError";

import { getCookie } from "../../../../../js/getCookie";
import { userLocale } from "../../../../../locale/UserPage/CustomMoves/CustomMoves";

let strings = new LocalizedStrings(userLocale)

const TypeAndCategory = React.memo(function TypeAndCategory(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { moveCategory, moveType, onChange, ...other } = props;

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
                    <MenuItem value="0" >Bug</MenuItem>
                    <MenuItem value="1" >Dark</MenuItem>
                    <MenuItem value="2" >Dragon</MenuItem>
                    <MenuItem value="3" >Electric</MenuItem>
                    <MenuItem value="4" >Fairy</MenuItem>
                    <MenuItem value="5" >Fighting</MenuItem>
                    <MenuItem value="6" >Fire</MenuItem>
                    <MenuItem value="7" >Flying</MenuItem>
                    <MenuItem value="8" >Ghost</MenuItem>
                    <MenuItem value="9" >Grass</MenuItem>
                    <MenuItem value="10" >Ground</MenuItem>
                    <MenuItem value="11" >Ice</MenuItem>
                    <MenuItem value="12" >Normal</MenuItem>
                    <MenuItem value="13" >Poison</MenuItem>
                    <MenuItem value="14" >Psychic</MenuItem>
                    <MenuItem value="15" >Rock</MenuItem>
                    <MenuItem value="16" >Steel</MenuItem>
                    <MenuItem value="17" >Water</MenuItem>
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