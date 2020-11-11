import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import MoveCol from "./MoveBlock/MoveCol";
import EvoBlock from "./EvoBlock/EvoBlock";
import EffTable from "./EffBlock/EffTable";
import CpBlock from "./CpBlock/CpBlock";
import OtherTable from "./OtherBlock/OtherTable";

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";

let strings = new LocalizedStrings(dexLocale);

const SliderBody = React.memo(function SliderBody(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { show, expanded } = props;

    return (
        <>
            {show[0] &&
                <Collapse in={expanded[0]} unmountOnExit>
                    <Grid container>
                        {props.pok.QuickMoves.length > 0 &&
                            <MoveCol value={props.pok.QuickMoves}
                                moveTable={props.moveBase} title={strings.qm} pok={props.pok} />}
                        {props.pok.ChargeMoves.length > 0 &&
                            <MoveCol value={props.pok.ChargeMoves}
                                moveTable={props.moveBase} title={strings.chm} pok={props.pok} />}
                    </Grid>
                </Collapse>}

            {show[1] &&
                <Collapse in={expanded[1]} unmountOnExit>
                    <Grid container>
                        <EvoBlock
                            miscTable={props.miscTable.Misc}
                            pokTable={props.pokemonBase}

                            value={props.miscTable.Families[props.pokMisc.Family]}
                            familyName={props.pokMisc.Family}
                        />
                    </Grid>
                </Collapse>}

            {show[2] &&
                <Collapse in={expanded[2]} unmountOnExit>
                    <Grid container>
                        <EffTable type={props.pok.Type} reverse={false} />
                    </Grid>
                </Collapse>}

            {show[3] &&
                <Collapse in={expanded[3]} unmountOnExit>
                    <Grid container>
                        <CpBlock pok={props.pok} pokTable={props.pokemonBase} />
                    </Grid>
                </Collapse>}

            {show[4] &&
                <Collapse in={expanded[4]} unmountOnExit>
                    <Grid container>
                        <OtherTable value={props.pokMisc} />
                    </Grid>
                </Collapse>}
        </>
    )

});

export default SliderBody;

SliderBody.propTypes = {
    pok: PropTypes.object.isRequired,
    moveBase: PropTypes.object.isRequired,
    miscTable: PropTypes.object.isRequired,
    pokemonBase: PropTypes.object.isRequired,
    pokMisc: PropTypes.object,

    show: PropTypes.arrayOf(PropTypes.bool).isRequired,
    expanded: PropTypes.arrayOf(PropTypes.bool).isRequired,

};