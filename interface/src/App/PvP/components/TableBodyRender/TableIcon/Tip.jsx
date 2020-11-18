import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ColoredMove from "App/Components/ColoredMove/ColoredMove";
import { addStar } from "js/addStar";
import { getCookie } from "js/getCookie";
import { options } from "locale/Components/Options/locale";

let optionStrings = new LocalizedStrings(options);

const Tip = React.memo(function Tip(props) {
    optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { name, IsShadow, QuickMove, ChargeMove1, ChargeMove2, Atk, Def, Sta, Lvl } = props.pok;

    return (
        <Typography component="div" align="center">
            <Grid container justify="center" spacing={1}>
                <Grid item xs={12}>
                    {name + (IsShadow === "true" ? ` (${optionStrings.options.type.shadow})` : "")}
                </Grid>

                <Grid item xs={12}>
                    {`${Lvl}: ${Atk}/${Def}/${Sta}`}
                </Grid>

                {QuickMove &&
                    <Grid item xs={12}>
                        <ColoredMove type={props.moveTable[QuickMove].MoveType}>
                            {QuickMove + addStar(name, QuickMove, props.pokemonTable)}
                        </ColoredMove>
                    </Grid>}

                {ChargeMove1 &&
                    <Grid item xs={12}>
                        <ColoredMove type={props.moveTable[ChargeMove1].MoveType}>
                            {ChargeMove1 + addStar(name, ChargeMove1, props.pokemonTable)}
                        </ColoredMove>
                    </Grid>}

                {ChargeMove2 &&
                    <Grid item xs={12}>
                        <ColoredMove type={props.moveTable[ChargeMove2].MoveType}>
                            {ChargeMove2 + addStar(name, ChargeMove2, props.pokemonTable)}
                        </ColoredMove>
                    </Grid>}
            </Grid>

        </Typography>
    )
});

export default Tip;

Tip.propTypes = {
    pok: PropTypes.object,
    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};