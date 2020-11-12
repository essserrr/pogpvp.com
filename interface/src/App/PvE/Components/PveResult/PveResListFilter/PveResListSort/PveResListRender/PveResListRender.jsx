import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import GetAppIcon from '@material-ui/icons/GetApp';

import Button from "App/Components/Button/Button";
import PrescisionWrapper from "./PveResEntry/PrescisionWrapper";

import { locale } from "locale/Pve/Pve";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const PveResListRender = React.memo(function PveResListRender(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const { children, n, loadMore, ...other } = props;

    const upperBound = children.length >= n * 25 ? n * 25 : children.length;
    const isNextPage = children.length > upperBound;

    return (
        <Grid container spacing={2}>

            <Grid item xs={12} container spacing={1}>
                {children.slice(0, upperBound).map((elem, i) =>
                    <Grid item xs={12} key={i}>
                        <PrescisionWrapper i={i} pokemonRes={elem} {...other} />
                    </Grid>
                )}
            </Grid>

            {isNextPage &&
                <Grid item xs={12} container justify="center">
                    <Button
                        title={strings.buttons.loadmore}
                        onClick={loadMore}
                        endIcon={<GetAppIcon />}
                    />
                </Grid>}
        </Grid>
    )
});


export default PveResListRender;

PveResListRender.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),

    n: PropTypes.number,
    customResult: PropTypes.bool,

    snapshot: PropTypes.object,
    tables: PropTypes.object,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,

    showBreakpoints: PropTypes.func,
    loadMore: PropTypes.func,
};