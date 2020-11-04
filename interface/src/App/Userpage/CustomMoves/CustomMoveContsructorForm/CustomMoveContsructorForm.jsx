import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import AuthButton from "App/Registration/RegForm/AuthButton/AuthButton";
import Input from "App/Components/Input/Input"
import TypeAndCategory from "App/Userpage/CustomMoves/CustomMoveContsructorForm/TypeAndCategory/TypeAndCategory";
import PveProperties from "App/Userpage/CustomMoves/CustomMoveContsructorForm/PveProperties/PveProperties";
import PvpProperties from "App/Userpage/CustomMoves/CustomMoveContsructorForm/PvpProperties/PvpProperties";
import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomMoves/CustomMoves";

let strings = new LocalizedStrings(userLocale)

const CustomMoveContsructorForm = React.memo(function CustomMoveContsructorForm(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container justify="center" spacing={2}>

            <Grid item xs={12} container justify="center">
                <Grid item xs={12} md={6}>
                    <Input
                        label={strings.moveconstr.title}
                        name={"Title"}
                        type={"text"}

                        value={props.Title.value}
                        errorText={props.Title.error}

                        onChange={props.onChange}
                    />
                </Grid>
            </Grid>

            <Grid item xs={12} container justify="center">
                <TypeAndCategory spacing={2}
                    onChange={props.onChange} moveCategory={props.MoveCategory.value} moveType={props.MoveType.value} />
            </Grid>

            <Grid item xs={12} md={6}>
                <PveProperties spacing={2}
                    DodgeWindow={props.DodgeWindow} DamageWindow={props.DamageWindow} Cooldown={props.Cooldown}
                    Energy={props.Energy} Damage={props.Damage} moveCategory={props.MoveCategory.value} onChange={props.onChange}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <PvpProperties spacing={2}
                    PvpDamage={props.PvpDamage} PvpEnergy={props.PvpEnergy} PvpDurationSeconds={props.PvpDurationSeconds} Probability={props.Probability}
                    Stat={props.Stat} StageDelta={props.StageDelta} Subject={props.Subject} moveCategory={props.MoveCategory.value} onChange={props.onChange}
                />
            </Grid>
            <Grid item xs={12} container justify="center">
                <AuthButton
                    title={strings.moveconstr.add}
                    onClick={props.onMoveAdd}
                    endIcon={<AddCircleIcon />}
                    disabled={props.submitDisabled}
                />
            </Grid>
        </Grid>
    );
})


export default CustomMoveContsructorForm;

CustomMoveContsructorForm.propTypes = {
    submitDisabled: PropTypes.bool,
    onChange: PropTypes.func,
    onMoveAdd: PropTypes.func,

    Title: PropTypes.object,
    MoveCategory: PropTypes.object,
    MoveType: PropTypes.object,

    Subject: PropTypes.object,

    StageDelta: PropTypes.object,
    PvpDurationSeconds: PropTypes.object,
    PvpDuration: PropTypes.object,

    PvpDamage: PropTypes.object,
    PvpEnergy: PropTypes.object,
    Damage: PropTypes.object,

    Energy: PropTypes.object,
    Probability: PropTypes.object,
    Stat: PropTypes.object,

    Cooldown: PropTypes.object,
    DamageWindow: PropTypes.object,
    DodgeWindow: PropTypes.object,
};