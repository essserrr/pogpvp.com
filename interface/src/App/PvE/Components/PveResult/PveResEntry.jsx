import React from "react";
import LocalizedStrings from 'react-localization';
import { UnmountClosed } from 'react-collapse';
import HpBar from "../PhBar/HpBar"

import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import Errors from "../../../PvP/components/Errors/Errors"
import NumberAndName from "../NumberAndName/NumberAndName"
import HpRemaining from "../HpRemaining/HpRemaining"
import WeatherMoves from "../WeatherMoves/WeatherMoves"
import FightStats from "../FightStats/FightStats"
import Loader from "../../../PvpRating/Loader"

import { getCookie, culculateCP, calculateEffStat, extractName, encodePveAttacker, encodePveBoss, encodePveObj } from "../../../../js/indexFunctions"
import { pveLocale } from "../../../../locale/pveLocale"
import { locale } from "../../../../locale/locale"

let strings = new LocalizedStrings(locale);
let pveStrings = new LocalizedStrings(pveLocale);


class PveResEntry extends React.PureComponent {

    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

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

    damageString(damage) {
        return this.props.tables.hp[this.props.snapshot.bossObj.Tier] < damage ? this.props.tables.hp[this.props.snapshot.bossObj.Tier] : damage
    }


    collect() {
        let obj = {
            DAvg: 0, DMax: 0, DMin: 999999, FMax: 0, FMin: 200, NOfWins: 0, TAvg: 0, TMax: 0, TMin: 9000,
        }
        for (let i = 0; i < this.props.pokemonRes.length; i++) {
            if (this.props.pokemonRes[i].DMax > obj.DMax) {
                obj.DMax = this.props.pokemonRes[i].DMax
            }
            if (this.props.pokemonRes[i].FMax > obj.FMax) {
                obj.FMax = this.props.pokemonRes[i].FMax
            }
            if (this.props.pokemonRes[i].TMax > obj.TMax) {
                obj.TMax = this.props.pokemonRes[i].TMax
            }

            if (this.props.pokemonRes[i].DMin < obj.DMin) {
                obj.DMin = this.props.pokemonRes[i].DMin
            }
            if (this.props.pokemonRes[i].FMin < obj.FMin) {
                obj.FMin = this.props.pokemonRes[i].FMin
            }
            if (this.props.pokemonRes[i].TMin < obj.TMin) {
                obj.TMin = this.props.pokemonRes[i].TMin
            }
            obj.DAvg += this.props.pokemonRes[i].DAvg
            obj.NOfWins += this.props.pokemonRes[i].NOfWins
            obj.TAvg += this.props.pokemonRes[i].TAvg
        }
        obj.DAvg = (obj.DAvg / this.props.pokemonRes.length).toFixed(0)
        obj.NOfWins = (obj.NOfWins / this.props.pokemonRes.length).toFixed(0)
        obj.TAvg = obj.TAvg / this.props.pokemonRes.length
        return obj
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
            colElement: !this.state.showCollapse ? this.generateCards() : null,
        })
    }

    async rerunWithPrecision() {
        let newPok = { ...this.props.snapshot.attackerObj }
        newPok.Name = this.props.pokemonRes[0].AName
        newPok.QuickMove = this.props.pokemonRes[0].AQ
        newPok.ChargeMove = this.props.pokemonRes[0].ACh


        //make server pve request
        var url = encodePveAttacker(newPok) + "/" + encodePveBoss(this.props.snapshot.bossObj) + "/" + encodePveObj(this.props.snapshot.pveObj)
        this.setState({
            loading: true,
        });
        var reason = ""
        const response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/common/" + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip',
            },
        })
            .catch(function (r) {
                reason = r
                return
            });
        if (reason !== "") {
            this.setState({
                isError: true,
                loading: false,
                error: String(reason),
            });
            return
        }
        //parse answer
        const data = await response.json();
        //if response is not ok, handle error
        if (!response.ok) {
            if (data.detail === "PvE error") {
                this.setState({
                    isError: true,
                    loading: false,
                    error: data.case.What,
                });
                return;
            }
            this.setState({
                isError: true,
                loading: false,
                error: data.detail,
            });
            return;
        }

        //otherwise set state
        this.setState({
            isError: false,
            loading: false,
        });

        this.props.raplace(data, this.props.i)
    }

    defineBreakpoints() {
        let snap = { ...this.props.snapshot }

        snap.attackerObj.Name = this.props.pokemonRes[0].AName
        snap.attackerObj.QuickMove = this.props.pokemonRes[0].AQ
        snap.attackerObj.ChargeMove = this.props.pokemonRes[0].ACh
        this.props.showBreakpoints(snap)
    }

    generateCards() {
        return this.props.pokemonRes.map((elem) => {
            return <div className="col-12 pveResult animShiny m-0 p-0 p-2 my-1 " key={elem.BQ + elem.BCh}>
                <div className="col-12 d-flex m-0 p-0">
                    <WeatherMoves
                        pokQick={this.props.moveTable[elem.BQ]}
                        pokCh={this.props.moveTable[elem.BCh]}
                        snapshot={this.props.snapshot}
                    />
                </div>
                <div className="col-12 m-0 p-0 mt-2">
                    <HpBar
                        upbound={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.damageString(elem.DMin)) / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                        lowbound={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.damageString(elem.DMax)) / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                        length={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.damageString(elem.DAvg)) / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                    />
                </div>
                <div className="col-12 m-0 p-0 fBolder">
                    <HpRemaining
                        locale={pveStrings.hprem}
                        DAvg={this.damageString(elem.DAvg)}
                        DMax={this.damageString(elem.DMax)}
                        DMin={this.damageString(elem.DMin)}
                        NOfWins={elem.NOfWins}
                        tierHP={this.props.tables.hp[this.props.snapshot.bossObj.Tier]}
                    />
                </div>
                <div className="col-12 m-0 p-0">
                    <FightStats
                        locale={pveStrings.s}
                        tables={this.props.tables}
                        snapshot={this.props.snapshot}
                        avgStats={elem}
                    />
                </div>
            </div>
        });
    }

    render() {
        let pok = this.props.pokemonTable[this.props.pokemonRes[0].AName]
        let name = extractName(pok.Title)
        let avgStats = this.collect()

        return (
            <div className={"cardBig row m-0 p-0 py-1 my-1 px-2 justify-content-start"} key={name.Name + this.props.pokemonRes[0].AQ + this.props.pokemonRes[0].ACh}>
                <div className="col-auto m-0 p-0">
                    <NumberAndName
                        pok={pok}
                        i={this.props.i}
                    />
                </div>
                <div className="verySmallWidth">
                    <div className="col-12 d-flex m-0 p-0">
                        <div className="align-self-center bigText mr-1">
                            {name.Name}
                        </div>
                        <WeatherMoves
                            pokQick={this.props.moveTable[this.props.pokemonRes[0].AQ]}
                            pokCh={this.props.moveTable[this.props.pokemonRes[0].ACh]}
                            snapshot={this.props.snapshot}
                        />
                    </div>
                    <div className="col-12 m-0 p-0 fBolder">
                        {"CP "} {culculateCP(pok.Title, this.props.snapshot.attackerObj.Lvl, this.props.snapshot.attackerObj.Atk, this.props.snapshot.attackerObj.Def, this.props.snapshot.attackerObj.Sta, this.props.pokemonTable)}
                        {" / HP "} {calculateEffStat(pok.Title, this.props.snapshot.attackerObj.Lvl, this.props.snapshot.attackerObj.Sta, 0, this.props.pokemonTable, "Sta", false)}
                        {name.Additional && (" / " + name.Additional)}
                    </div>
                </div>
                <div className="col-12 m-0 p-0">
                    <div className="row m-0 p-0 justify-content-between">
                        <div className="col-12 m-0 p-0">
                            <HpBar
                                upbound={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.damageString(avgStats.DMin)) / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                                lowbound={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.damageString(avgStats.DMax)) / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                                length={((this.props.tables.hp[this.props.snapshot.bossObj.Tier] - this.damageString(avgStats.DAvg)) / (this.props.tables.hp[this.props.snapshot.bossObj.Tier]) * 100).toFixed(1)}
                            />
                        </div>
                        <div className="col-12 m-0 p-0 fBolder">
                            <HpRemaining
                                locale={pveStrings.hprem}
                                DAvg={this.damageString(avgStats.DAvg)}
                                DMax={this.damageString(avgStats.DMax)}
                                DMin={this.damageString(avgStats.DMin)}
                                NOfWins={avgStats.NOfWins}
                                tierHP={this.props.tables.hp[this.props.snapshot.bossObj.Tier]}
                            />
                        </div>
                        <div className="col-10 m-0 p-0">
                            <FightStats
                                locale={pveStrings.s}
                                tables={this.props.tables}
                                snapshot={this.props.snapshot}
                                avgStats={avgStats}
                            />
                        </div>
                        <div onClick={this.onClick} className="clickable align-self-end ">
                            <i className={this.state.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg"}></i>
                        </div>
                    </div>
                    <div className={"col-12 m-0 p-0 " + (this.state.showCollapse ? "borderTop" : "")}>
                        <UnmountClosed isOpened={this.state.showCollapse}>
                            <div className="row p-0 m-0  mt-1">
                                {this.state.loading &&
                                    <div className="col-12 mt-2 mb-3" style={{ fontWeight: "500", color: "black" }} >
                                        <Loader
                                            color="black"
                                            weight="500"
                                            locale={strings.tips.loading}
                                            loading={this.state.loading}
                                        />
                                    </div>}
                                {this.state.isError && <div className="col-12 d-flex justify-content-center p-0 m-0 mb-2 mt-3" >
                                    <Errors class="alert alert-danger m-0 p-2" value={this.state.error} /></div>}
                                <div className="col-12 d-flex justify-content-center m-0 p-0 mb-1 mt-2" key={"pres"}>
                                    <SubmitButton
                                        label={pveStrings.pres}
                                        action="Precision"
                                        onSubmit={this.rerunWithPrecision}
                                        class="longButtonFixed btn btn-primary btn-sm mt-0  mx-0"
                                    />
                                </div>
                                <div className="col-12 d-flex justify-content-center m-0 p-0 mb-1 mt-2" key={"break"}>
                                    <SubmitButton
                                        label={pveStrings.break}
                                        action="Breakpoints"
                                        onSubmit={this.defineBreakpoints}
                                        class="longButtonFixed btn btn-primary btn-sm mt-0  mx-0"
                                    />
                                </div>



                                {this.state.colElement}
                            </div>
                        </UnmountClosed>
                    </div>
                </div>
            </div>
        );
    }
};

export default PveResEntry;


