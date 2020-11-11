import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import DropWithArrow from "App/PvpRating/DropWithArrow/DropWithArrow";
import RMoveRow from "App/PvpRating/RMoveRow/RMoveRow";
import RRateRow from "App/PvpRating/RRateRow/RRateRow";
import RowWrap from "App/PvpRating/RowWrap/RowWrap";
import EffTable from "App/Pokedex/PokeCard/SliderBody/EffBlock/EffTable";

import { checkShadow, encodeQueryData, calculateMaximizedStats } from "js/indexFunctions";
import { getCookie } from "js/getCookie";
import { locale } from "locale/Rating/Rating";
import { stats } from "locale/Components/Stats/locale";

let strings = new LocalizedStrings(locale);
let statStrings = new LocalizedStrings(stats);

class Collapsable extends React.PureComponent {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        statStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            aMaxStats: {},
        };
        this.onClick = this.onClick.bind(this);
        this.onClickRedirect = this.onClickRedirect.bind(this);
        this.createMovesetList = this.createMovesetList.bind(this);
    }


    onClick(show) {
        const pokName = checkShadow(this.props.container.Name, this.props.pokemonTable);
        if (show) {
            this.setState({
                aName: pokName,
                aMaxStats: calculateMaximizedStats(pokName, 40, this.props.pokemonTable)
                [(this.props.league === "Premier" ?
                    "master" : this.props.league === "Premierultra" ?
                        "ultra" : this.props.league === "Cupflying" ?
                            "great" : this.props.league.toLowerCase())].Overall,
            })
        }
    }

    onClickRedirect(defenderOriginalName) {
        const defenderName = checkShadow(defenderOriginalName, this.props.pokemonTable)
        const league = (this.props.league === "Premier" ?
            "master" : this.props.league === "Premierultra" ?
                "ultra" : this.props.league === "Cupflying" ?
                    "great" : this.props.league.toLowerCase())
        let maxStatsD = calculateMaximizedStats(defenderName, 40, this.props.pokemonTable)[league].Overall

        switch (this.props.combination) {
            case "00":
                var shields = [0, 0]
                break
            case "11":
                shields = [1, 1]
                break
            case "22":
                shields = [2, 2]
                break
            case "01":
                shields = [0, 1]
                break
            case "12":
                shields = [1, 2]
                break
            default:
                shields = [2, 2]
                break
        }

        let defender = this.props.ratingList.find(element => element.Name === defenderOriginalName);
        let defenderString = encodeQueryData(
            this.generatePokObj(defenderName, maxStatsD, shields[1], defenderName !== defenderOriginalName, defender)
        )

        let attackerString = encodeQueryData(
            this.generatePokObj(this.state.aName, this.state.aMaxStats, shields[0],
                this.state.aName !== this.props.container.Name, this.props.container)
        )
        return "/pvp/single/great/" + attackerString + "/" + defenderString
    }

    generatePokObj(name, stat, shields, isShadow, movelist) {
        return {
            name: name, Lvl: stat.Level, Atk: stat.Atk, Def: stat.Def, Sta: stat.Sta, Shields: shields,
            AtkStage: 0, DefStage: 0, InitialHP: 0, InitialEnergy: 0,
            IsGreedy: true, IsShadow: isShadow,
            QuickMove: movelist.Movesets[0].Quick, ChargeMove1: movelist.Movesets[0].Charge[0], ChargeMove2: movelist.Movesets[0].Charge[1],
        }
    }

    createSublist(array) {
        //if null array, return empty array
        if (!array) { return [] }
        return array.reduce((result, elem) => {
            const pokName = checkShadow(elem.Name, this.props.pokemonTable)
            if (!pokName) { return result }
            result.push(
                <Grid item xs={12} key={elem.Name}>
                    <RRateRow
                        pokName={pokName}
                        pokemonTable={this.props.pokemonTable}
                        value={elem}
                        onClickRedirect={this.onClickRedirect}
                    />
                </Grid>)
            return result
        }, [])
    }

    createMovesetList(array) {
        let sublist = []
        //if null array, return empty array
        if (!array) { return sublist }
        return (array.length > 3 ? array.slice(0, 3) : array).map((elem) =>
            <Grid item xs={12} key={elem.Quick + elem.Charge[0] + elem.Charge[1]}>
                <RMoveRow
                    pokName={checkShadow(this.props.container.Name, this.props.pokemonTable)}
                    pokemonTable={this.props.pokemonTable}
                    moveTable={this.props.moveTable}
                    value={elem}
                />
            </Grid>)
    }

    render() {
        return (
            <DropWithArrow container justify="center" onClick={this.onClick} iconBox={{ mr: 1 }}>
                <Box px={2} pb={2}>
                    <Grid container justify="center" spacing={2}>
                        <RowWrap xs={12} sm={6} title={strings.rating.bestMatchups}>
                            <Grid container justify="center" spacing={1}>
                                {this.createSublist(this.props.container.BestMetaMatchups)}
                            </Grid>
                        </RowWrap>

                        <RowWrap xs={12} sm={6} title={strings.rating.bestCounter}>
                            <Grid container justify="center" spacing={1}>
                                {this.createSublist(this.props.container.Counters)}
                            </Grid>
                        </RowWrap>

                        <RowWrap xs={12} md={11} sm={10} title={strings.rating.movesets}>
                            <Grid container justify="center" spacing={1}>
                                {this.createMovesetList(this.props.container.Movesets)}
                            </Grid>
                        </RowWrap>

                        <RowWrap disableIcon={true} xs={12} md={11} sm={10} title={<Typography align="center">{strings.rating.stats}</Typography>}>
                            <Typography align="center" variant="body1">
                                {statStrings.atk + ": " + this.state.aMaxStats.Atk + ", " +
                                    statStrings.def + ": " + this.state.aMaxStats.Def + ", " +
                                    statStrings.sta + ": " + this.state.aMaxStats.Sta + ", " +
                                    statStrings.lvl + ": " + this.state.aMaxStats.Level}
                            </Typography>
                        </RowWrap>

                        <Grid item xs={12} sm={11} md={10}>
                            <EffTable
                                type={this.props.pokemonTable[checkShadow(this.props.container.Name, this.props.pokemonTable)].Type}
                                reverse={false}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DropWithArrow>

        )
    }
}

export default Collapsable;

Collapsable.propTypes = {
    league: PropTypes.string,

    container: PropTypes.object.isRequired,
    pokemonTable: PropTypes.object.isRequired,
    moveTable: PropTypes.object.isRequired,
};