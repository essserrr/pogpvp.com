import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import Input from "App/Components/Input/Input";

import { getCookie } from "js/getCookie";
import { uri } from "locale/Components/URI/URI";

let strings = new LocalizedStrings(uri);

const URI = React.memo(function URI(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const [state, setState] = React.useState(false);

    const onClick = async (event) => {
        event.target.select();
        document.execCommand("copy");

        setState(true);
        await new Promise(res => setTimeout(res, 2000));
        setState(false);
    }


    return (
        <Grid container>
            <Grid item xs={12}>

                <Snackbar open={state} onClose={() => setState(false)}>
                    <Alert variant="filled" severity="success">{strings.message}</Alert >
                </Snackbar>

                <Input label={strings.uri} value={props.value} onClick={onClick} onChange={() => { }} readOnly={true} />

            </Grid>
        </Grid>
    )
});

export default URI;

URI.propTypes = {
    value: PropTypes.string,
};