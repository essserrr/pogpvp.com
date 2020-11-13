import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from "@material-ui/core/styles";

import GreyPaper from "App/Components/GreyPaper/GreyPaper";
import CustomPveNamePlate from "./CustomPveNamePlate/CustomPveNamePlate";
import CommonPveNamePlate from "./CommonPveNamePlate/CommonPveNamePlate";
import CollapseCardWrapper from "./CollapseCardWrapper/CollapseCardWrapper";
import PveResultCollapseList from "./PveResultCollapseList/PveResultCollapseList";
import PveResultFullStatistics from "./PlayerStatistics/PlayerStatistics";

import { encodePveAttacker, encodePveBoss, encodePveObj } from "js/indexFunctions";

const styles = theme => ({
    separator: {
        borderTop: "1px solid rgba(0, 0, 0, 0.295)",
        paddingTop: `${theme.spacing(1)}px`,
        marginTop: `${theme.spacing(1)}px`,
    },
});

class PveResEntry extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            showCollapse: false,
            colElement: null,
        };
        this.onClick = this.onClick.bind(this);
        this.rerunWithPrecision = this.rerunWithPrecision.bind(this);
        this.defineBreakpoints = this.defineBreakpoints.bind(this);
    }

    addStar(pokName, moveName) {
        return (this.props.pokemonTable[pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pokemonRes === this.props.pokemonRes) {
            return
        }
        this.setState({
            colElement: this.state.showCollapse ? this.generateCards() : null,
        })
    }

    cropDamage(damage) {
        return this.props.tables.hp[this.props.snapshot.bossObj.Tier] < damage ? this.props.tables.hp[this.props.snapshot.bossObj.Tier] : damage
    }


    collect() {
        let obj = {
            DAvg: 0, DMax: 0, DMin: 999999, FMax: 0, FMin: 200, NOfWins: 0, TAvg: 0, TMax: 0, TMin: 9000,
        }
        this.props.pokemonRes.Result.forEach((elem) => {
            if (elem.DMax > obj.DMax) { obj.DMax = elem.DMax }
            if (elem.FMax > obj.FMax) { obj.FMax = elem.FMax }
            if (elem.TMax > obj.TMax) { obj.TMax = elem.TMax }

            if (elem.DMin < obj.DMin) { obj.DMin = elem.DMin }
            if (elem.FMin < obj.FMin) { obj.FMin = elem.FMin }
            if (elem.TMin < obj.TMin) { obj.TMin = elem.TMin }

            obj.DAvg += elem.DAvg
            obj.NOfWins += elem.NOfWins
            obj.TAvg += elem.TAvg
        });

        obj.DAvg = (obj.DAvg / this.props.pokemonRes.Result.length).toFixed(0)
        obj.NOfWins = (obj.NOfWins / this.props.pokemonRes.Result.length).toFixed(0)
        obj.TAvg = obj.TAvg / this.props.pokemonRes.Result.length
        return obj
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
            colElement: !this.state.showCollapse ? this.generateCards() : null,
        })
    }

    makeCustomRequestObject() {
        return {
            UserPlayers: [this.props.pokemonRes.Party.map((value) => ({
                Name: value.Name, QuickMove: value.Quick, ChargeMove: value.Charge, ChargeMove2: value.Charge2,
                Lvl: value.Lvl, Atk: value.Atk, Def: value.Def, Sta: value.Sta, IsShadow: String(value.IsShadow),
            }))],

            Boss: {
                Name: this.props.snapshot.bossObj.Name, QuickMove: this.props.snapshot.bossObj.QuickMove,
                ChargeMove: this.props.snapshot.bossObj.ChargeMove, Tier: Number(this.props.snapshot.bossObj.Tier)
            },
            AggresiveMode: this.props.snapshot.pveObj.IsAggresive === "true",

            DodgeStrategy: Number(this.props.snapshot.pveObj.DodgeStrategy),
            Weather: Number(this.props.snapshot.pveObj.Weather),
            FriendStage: Number(this.props.snapshot.pveObj.FriendshipStage),
            PartySize: Number(this.props.snapshot.pveObj.PartySize),

            BoostSlotEnabled: this.props.snapshot.pveObj.SupportSlotEnabled !== "false",
            FindInCollection: false,
            SortByDamage: this.props.snapshot.attackerObj.SortByDamage === "true",
        }
    }

    makeCommonRequestString() {
        let partyLen = this.props.pokemonRes.Party.length
        let pok = this.props.pokemonRes.Party[partyLen - 1]
        let attacker = {
            Name: pok.Name, QuickMove: pok.Quick, ChargeMove: pok.Charge, ChargeMove2: pok.Charge2,
            Lvl: pok.Lvl, Atk: pok.Atk, Def: pok.Def, Sta: pok.Sta, IsShadow: String(pok.IsShadow),
        }
        let booster = {
            ...this.props.snapshot.supportPokemon,
            Name: partyLen > 1 ? this.props.pokemonRes.Party[0].Name : "",
            QuickMove: partyLen > 1 ? this.props.pokemonRes.Party[0].Quick : "",
            ChargeMove: partyLen > 1 ? this.props.pokemonRes.Party[0].Charge : "",
        }
        //make server pve request
        return `${encodePveAttacker(attacker)}/${encodePveBoss(this.props.snapshot.bossObj)}/${encodePveObj(this.props.snapshot.pveObj)}/${encodePveAttacker(booster)}`
    }


    async rerunWithPrecision() {
        switch (this.props.customResult) {
            case true:
                var reqObj = this.makeCustomRequestObject()
                break
            default:
                var url = this.makeCommonRequestString()
        }

        //make server pve request
        this.setState({
            loading: true,
        });
        try {

            switch (this.props.customResult) {
                case true:
                    var response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/custom/", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                        body: JSON.stringify(reqObj),
                    })
                    break
                default:
                    response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/common/" + url, {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                    })
            }

            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            //otherwise set state
            this.setState({
                isError: false,
                loading: false,
            });

            this.props.replace(result)

        } catch (e) {
            this.setState({
                isError: true,
                loading: false,
                error: String(e),
            })
        }
    }

    defineBreakpoints(pokemon) {

        const numberInArr = this.props.customResult ? pokemon.index : this.props.pokemonRes.Party.length - 1;

        let snap = { ...this.props.snapshot }

        snap.attackerObj.Name = this.props.pokemonRes.Party[numberInArr].Name
        snap.attackerObj.QuickMove = this.props.pokemonRes.Party[numberInArr].Quick
        snap.attackerObj.ChargeMove = this.props.pokemonRes.Party[numberInArr].Charge
        snap.attackerObj.Atk = this.props.pokemonRes.Party[numberInArr].Atk
        snap.attackerObj.Def = this.props.pokemonRes.Party[numberInArr].Def
        snap.attackerObj.Sta = this.props.pokemonRes.Party[numberInArr].Sta
        snap.attackerObj.Lvl = this.props.pokemonRes.Party[numberInArr].Lvl
        snap.attackerObj.IsShadow = this.props.pokemonRes.Party[numberInArr].IsShadow

        this.props.showBreakpoints(snap)
    }

    generateCards() {
        return this.props.pokemonRes.Result.map((stats, i) =>
            <Grid item xs={12} key={i}>
                <CollapseCardWrapper stats={stats} moveTable={this.props.moveTable} snapshot={this.props.snapshot} tables={this.props.tables} />
            </Grid>);
    }

    processStats(avgStats) {
        let dAvg = (avgStats.DAvg / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)
        let dMin = (avgStats.DMin / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)
        let dMax = (avgStats.DMax / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)

        let tAvg = (avgStats.TAvg / 1000).toFixed(0)

        return {
            dAvg: dAvg,
            dMin: dMin,
            dMax: dMax,

            tAvg: (avgStats.TAvg / 1000).toFixed(0),
            tMin: (avgStats.TMin / 1000).toFixed(0),
            tMax: (avgStats.TMax / 1000).toFixed(0),

            dpsAvg: (avgStats.DAvg / (this.props.tables.timer[this.props.snapshot.bossObj.Tier] - tAvg)).toFixed(1),
            dpsMin: (avgStats.DMin / (this.props.tables.timer[this.props.snapshot.bossObj.Tier] - tAvg)).toFixed(1),
            dpsMax: (avgStats.DMax / (this.props.tables.timer[this.props.snapshot.bossObj.Tier] - tAvg)).toFixed(1),

            plAvg: (100 / dAvg).toFixed(2),
            plMin: Math.ceil(100 / dMax),
            plMax: Math.ceil(100 / dMin),

            ttwAvg: Math.ceil((this.props.tables.timer[this.props.snapshot.bossObj.Tier] - tAvg) * 100 / dAvg),

            FMin: avgStats.FMin,
            FMax: avgStats.FMax,
        }
    }

    render() {
        const { classes } = this.props;
        const avgStats = this.collect()
        const partyLen = this.props.pokemonRes.Party.length
        const key = this.props.pokemonRes.Party[partyLen - 1].Name + this.props.pokemonRes.Party[partyLen - 1].Quick + this.props.pokemonRes.Party[partyLen - 1].Charge

        return (
            <GreyPaper elevation={4} enablePadding paddingMult={0.5} key={key} style={{ backgroundColor: "white" }}>
                <Grid container>

                    {!this.props.customResult &&
                        <Grid item xs={12}>
                            <CommonPveNamePlate
                                snapshot={this.props.snapshot}
                                i={this.props.i}

                                pokemonTable={this.props.pokemonTable}
                                moveTable={this.props.moveTable}
                                pokemonRes={this.props.pokemonRes}
                            />
                        </Grid>}

                    {this.props.customResult &&
                        <Grid item xs={12}>
                            <CustomPveNamePlate
                                i={this.props.i}

                                pokemonTable={this.props.pokemonTable}
                                moveTable={this.props.moveTable}
                                pokemonRes={this.props.pokemonRes}

                                defineBreakpoints={this.defineBreakpoints}
                            />
                        </Grid>}

                    <Grid item xs={12}>
                        <PveResultFullStatistics
                            bounds={{
                                up: ((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(avgStats.DMin)) /
                                    (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1),
                                low: ((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(avgStats.DMax)) /
                                    (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1),
                                avg: ((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(avgStats.DAvg)) /
                                    (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1),

                            }}

                            remain={{
                                avg: this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(avgStats.DAvg),
                                max: this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(avgStats.DMax),
                                min: this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.cropDamage(avgStats.DMin),
                                nbOfWins: avgStats.NOfWins,
                            }}


                            stats={this.processStats(avgStats)}

                            onClick={this.onClick}
                            showCollapse={this.state.showCollapse}
                        />
                    </Grid>

                    <Grid item xs={12} className={this.state.showCollapse ? classes.separator : ""}>
                        <Collapse in={this.state.showCollapse} unmountOnExit>
                            <PveResultCollapseList
                                isError={this.state.isError}
                                error={this.state.error}

                                loading={this.state.loading}

                                customResult={this.props.customResult}

                                rerunWithPrecision={this.rerunWithPrecision}
                                defineBreakpoints={this.defineBreakpoints}
                            >
                                <Grid container spacing={1}>
                                    {this.state.colElement}
                                </Grid>
                            </PveResultCollapseList>
                        </Collapse>
                    </Grid>

                </Grid>
            </GreyPaper>
        );
    }
};

export default withStyles(styles, { withTheme: true })(PveResEntry);

PveResEntry.propTypes = {
    i: PropTypes.number,
    customResult: PropTypes.object,

    snapshot: PropTypes.object,
    tables: PropTypes.object,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
    pokList: PropTypes.arrayOf(PropTypes.object),

    showBreakpoints: PropTypes.func,

    pokemonRes: PropTypes.object,
    replace: PropTypes.func,
};