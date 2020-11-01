import React from "react";
import LocalizedStrings from "react-localization";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import Input from "App/Components/Input/Input";
import SearchableSelect from 'App/Components/SearchableSelect/SearchableSelect';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import UserShinyFilter from "../UserShinyFilter/UserShinyFilter";
import SubmitButton from "App/PvP/components/SubmitButton/SubmitButton";
import MagicBox from "App/PvP/components/MagicBox/MagicBox";
import ImportExport from "App/PvP/components/ImportExport/ImportExport";

import { getCookie } from "js/getCookie";
import { shinyBroker } from "locale/UserPage/ShinyBroker/ShinyBroker";

let strings = new LocalizedStrings(shinyBroker);

const useStyles = makeStyles((theme) => ({
    shinyPanelTitle: {
        fontWeight: "400",
        fontSize: "13pt",
        textAlign: "center",
    },
}));

const ShBrokerSelectPanel = React.memo(function ShBrokerSelectPanel(props) {
    const classes = useStyles();

    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    return (
        <Grid container justify="center" spacing={2} alignItems="center">
            {!props.checked &&
                <Grid item xs={12} className={classes.shinyPanelTitle}>
                    {`${props.label} (${Object.keys(props.userList).length}/${props.limit})`}
                </Grid>}

            {props.onCheckboxChange && props.session.username &&
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!props.checked}
                                onChange={props.onCheckboxChange}
                                attr={`${props.attr}Custom`}
                                name={"SupportSlotEnabled"}
                                color="primary"
                            />}
                        label={strings.shbroker.int.choose}
                    />
                </Grid>}

            {!props.checked &&
                <Grid item xs={12} md={6}>
                    <SearchableSelect
                        disableClearable
                        label={strings.pokname}
                        attr={props.attr}
                        onChange={props.onPokemonAdd}
                    >
                        {props.pokList}
                    </SearchableSelect>
                </Grid>}

            {props.onAmountChange &&
                <Grid item xs={12} md={6}>
                    <Input
                        select
                        name="Amount"
                        value={props.Amount}
                        attr={props.attr}
                        label={strings.shbroker.amount}
                        onChange={props.onAmountChange}
                    >
                        <MenuItem value="1" >1</MenuItem>
                        <MenuItem value="2" >2</MenuItem>
                        <MenuItem value="3" >3</MenuItem>
                        <MenuItem value="4" >4</MenuItem>
                        <MenuItem value="5" >5</MenuItem>
                        <MenuItem value="5+" >5+</MenuItem>
                    </Input>
                </Grid>}

            <MagicBox
                open={Boolean(props.showImportExportPanel)}
                onClick={props.onTurnOnImport}
                attr={props.attr}
            >
                <ImportExport
                    type="shiny"
                    initialValue={Object.values(props.userList)}
                    pokemonTable={props.pokemonTable}

                    action="Import/Export"
                    attr={props.attr}
                    onChange={props.onImport}
                />
            </MagicBox>

            {props.onImport &&
                <Grid item xs={12}>
                    <Grid container justify="center" alignItems="center">
                        <SubmitButton
                            class="submit-button--lg btn btn-primary btn-sm mx-0"
                            attr={props.attr}
                            onSubmit={props.onTurnOnImport}
                        >
                            {strings.impExp}
                        </SubmitButton>
                    </Grid>
                </Grid>}

            {!props.checked &&
                <Grid item xs={12}>
                    <UserShinyFilter
                        attr={props.attr}
                        pokemonTable={props.pokemonTable}
                        onPokemonDelete={props.onPokemonDelete}
                    >
                        {props.userList}
                    </UserShinyFilter>
                </Grid>}
        </Grid>
    )
});

export default connect(
    state => ({
        session: state.session,
    })
)(ShBrokerSelectPanel)

ShBrokerSelectPanel.propTypes = {
    checked: PropTypes.bool,
    showImportExportPanel: PropTypes.bool,

    label: PropTypes.string,
    limit: PropTypes.number,

    attr: PropTypes.string,

    Amount: PropTypes.string,

    userList: PropTypes.object,
    pokemonTable: PropTypes.object,

    onAmountChange: PropTypes.func,
    onCheckboxChange: PropTypes.func,
    onPokemonAdd: PropTypes.func,
    onTurnOnImport: PropTypes.func,
    onPokemonDelete: PropTypes.func,
    onImport: PropTypes.func,
};