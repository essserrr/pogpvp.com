import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import MoveCol from "./MoveBlock/MoveCol";
import EvoBlock from "./EvoBlock/EvoBlock";
import EffTable from "./EffTable/EffTable";
import CpBlock from "./CpBlock/CpBlock";
import OtherTable from "./OtherTable/OtherTable";

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";

let strings = new LocalizedStrings(dexLocale);

const SliderBody = React.memo(function SliderBody(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { show, expanded } = props;

    return (
        <>
            {show[0] &&
                <Collapse in={expanded[0]}>
                    <Grid container>
                        {props.pok.QuickMoves.length > 0 &&
                            <MoveCol value={props.pok.QuickMoves} class="p-0 pr-0 pr-sm-2"
                                moveTable={this.props.bases.moveBase} title={strings.qm} pok={props.pok} />}
                        {props.pok.ChargeMoves.length > 0 &&
                            <MoveCol value={props.pok.ChargeMoves} class="p-0 pl-0 pl-sm-2"
                                moveTable={this.props.bases.moveBase} title={strings.chm} pok={props.pok} />}
                    </Grid>
                </Collapse>}

            {show[1] &&
                <Collapse in={expanded[1]}>
                    <Grid container>
                        <EvoBlock
                            miscTable={props.miscTable.Misc}
                            pokTable={this.props.bases.pokemonBase}

                            value={props.miscTable.Families[props.pokMisc.Family]}
                            familyName={props.pokMisc.Family}
                        />
                    </Grid>
                </Collapse>}

            {show[2] &&
                <Collapse in={expanded[2]}>
                    <Grid container>
                        <EffTable
                            type={props.pok.Type}
                            reverse={this.props.reverse}
                        />
                    </Grid>
                </Collapse>}

            {show[3] &&
                <Collapse in={expanded[3]}>
                    <Grid container>
                        <div className="col-12 p-0 text-center">{strings.entparams}</div>
                        <CpBlock
                            pok={props.pok}
                            locale={strings.cpcalc}
                            pokTable={this.props.bases.pokemonBase}
                        />
                    </Grid>
                </Collapse>}

            {show[4] &&
                <Collapse in={expanded[4]}>
                    <Grid container>
                        <OtherTable
                            value={props.pokMisc}
                        />
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