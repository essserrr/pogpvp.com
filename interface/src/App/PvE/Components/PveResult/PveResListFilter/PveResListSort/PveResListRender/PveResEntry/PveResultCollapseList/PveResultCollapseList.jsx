import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import ReplayIcon from '@material-ui/icons/Replay';

import Button from "App/Components/Button/Button";

import { collList } from "locale/Pve/PveResCollapseList/PveResCollapseList";
import { getCookie } from "js/getCookie";

let pveStrings = new LocalizedStrings(collList);

const PveResultCollapseList = React.memo(function PveResultCollapseList(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (

        <Grid container spacing={2}>

            {props.isError &&
                <Grid container justify="center" item xs={12}>
                    <Alert variant="filled" severity="error">{props.error}</Alert>
                </Grid>}

            {!props.needsAverage &&
                <Grid container justify="center" item xs={12}>
                    <Button
                        loading={props.loading}
                        title={pveStrings.pres}
                        onClick={props.rerunWithPrecision}
                        endIcon={<ReplayIcon />}
                    />
                </Grid>}

            {!props.customResult &&
                <Grid container justify="center" item xs={12}>
                    <Button
                        title={pveStrings.break}
                        onClick={props.defineBreakpoints}
                    />
                </Grid>}

            <Grid item xs={12}>
                {props.children}
            </Grid>

        </Grid>
    )
});


export default PveResultCollapseList;

PveResultCollapseList.propTypes = {
    isError: PropTypes.bool,
    error: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),

    loading: PropTypes.bool,

    customResult: PropTypes.object,

    rerunWithPrecision: PropTypes.func,
    defineBreakpoints: PropTypes.func,

    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};