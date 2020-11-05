import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Input from "App/Components/Input/Input";

import Country from "./CountryAndRegion/Country/Country";
import Region from "./CountryAndRegion/Region/Region";

import { getCookie } from "js/getCookie";
import { shinyBroker } from "locale/UserPage/ShinyBroker/ShinyBroker";

let strings = new LocalizedStrings(shinyBroker)

const ShBrokerForm = React.memo(function ShBrokerForm(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container justify="center" spacing={2}>
            <Grid item xs={12} md={6}>
                <Country
                    label={strings.shbroker.country}

                    defaultOption={strings.shbroker.cPlace}
                    notOk={props.notOk.Country}

                    attr="Country"

                    value={props.value.Country}
                    onChange={props.selectCountry}

                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Region
                    label={strings.shbroker.region}

                    defaultOption={strings.shbroker.rPlace}
                    notOk={props.notOk.Region}
                    country={props.value.Country}

                    attr="Region"

                    value={props.value.Region}
                    onChange={props.selectRegion}

                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Input
                    label={strings.shbroker.city}
                    name="City"
                    type="text"

                    value={props.value.City}
                    errorText={props.notOk.City}

                    onChange={props.onChange}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Input
                    label={strings.shbroker.cont}

                    name="Contacts"
                    type="text"

                    value={props.value.Contacts}
                    errorText={props.notOk.Contacts}

                    onChange={props.onChange}
                />
            </Grid>
        </Grid>
    )
});

export default ShBrokerForm;

ShBrokerForm.propTypes = {
    value: PropTypes.object,
    notOk: PropTypes.object,

    onChange: PropTypes.func,
    selectRegion: PropTypes.func,
    selectCountry: PropTypes.func,
};