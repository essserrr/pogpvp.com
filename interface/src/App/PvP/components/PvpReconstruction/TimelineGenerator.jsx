import React, { PureComponent } from 'react';
import Event from "./Event"
import { ReactComponent as Shield } from "../../../../icons/shield.svg";
import { ReactComponent as Sword } from "../../../../icons/sword.svg";
import { ReactComponent as DSword } from "../../../../icons/dsword.svg";

import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);


class EvoList extends PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
        };
        this.returnReconstruction = this.returnReconstruction.bind(this);
    }

    returnReconstruction() {
        let attackerTimeline = []
        let defenderTimeline = []
        for (let i = 1; i < this.props.log.length; i++) {
            let orderA = true
            let orderD = false
            if (this.props.log[i].Attacker.Order !== this.props.log[i].Defender.Order) {
                orderA = this.props.log[i].Attacker.Order
                orderD = this.props.log[i].Defender.Order
            }
            attackerTimeline.push(
                this.processPokemonResults({
                    i: i,
                    actor1: "Attacker",
                    actor2: "Defender",
                    order: orderA,
                })
            )
            defenderTimeline.push(
                this.processPokemonResults({
                    i: i,
                    actor1: "Defender",
                    actor2: "Attacker",
                    order: orderD,
                })
            )
        }

        return ([
            <tr key="attacker">{attackerTimeline}</tr>,
            <tr key="defender">{defenderTimeline}</tr>,
        ]
        )
    }



    processPokemonResults(arg) {
        var result = []
        const thisRound = this.props.log[arg.i]
        //if there is no next round
        if (this.props.log[arg.i + 1] === undefined) {
            this.addLastRound(arg, result, thisRound)
            return result
        }
        //otherwise parse round
        //if actions is quick move, add quick move event
        if (thisRound[arg.actor1].ActionCode === 1) {
            this.addQuickMove(arg, result, thisRound)
        }
        //if action is idle, make idle event
        if (thisRound[arg.actor1].ActionCode === 0) {
            this.addIdle(arg, result, thisRound)
        }

        switch (arg.order) {
            case true:
                //if action is charge move, create charge move event
                if (thisRound[arg.actor1].ActionCode === 11) {
                    this.addChargeMove(arg, result, thisRound)
                }
                //if opponent used a charge move, create shield event if it's possible
                if (thisRound[arg.actor2].ActionCode === 11) {
                    this.addShield(arg, result, thisRound)

                }
                break
            default:
                //if opponent used a charge move, create shield event if it's possible
                if (thisRound[arg.actor2].ActionCode === 11) {
                    this.addShield(arg, result, thisRound)

                }
                //if action is charge move, create charge move event
                if (thisRound[arg.actor1].ActionCode === 11) {
                    this.addChargeMove(arg, result, thisRound)
                }
                break
        }



        return result
    }

    addShield(arg, result, thisRound) {
        switch (true) {
            case thisRound[arg.actor1].ShieldIsUsed:
                let shieldEvent = this.shortEvent({
                    key: thisRound.Round + arg.actor1 + 7,
                    value: <Shield className="shield" />,
                    tip: <>
                        {strings.reconstruction.turn + thisRound.Round}<br />
                        {strings.reconstruction.shield}
                    </>,
                })
                result.push(shieldEvent)
                break;
            default:
                this.addNoEvenet(arg, result, thisRound)
        }
    }

    addChargeMove(arg, result, thisRound) {
        let damage = this.props.log[arg.i - 1][arg.actor2].HP - thisRound[arg.actor2].HP
        let energy = thisRound[arg.actor1].Energy - this.props.log[arg.i - 1][arg.actor1].Energy
        //if other guy's action is not a chanrge move, we need to make indent
        if (thisRound[arg.actor2].ActionCode !== 11) {
            if (thisRound[arg.actor2].ActionCode === 1 || thisRound[arg.actor2].ActionCode === 0) {
                this.addNoEvenet(arg, result, thisRound)
            }
        }
        //then make own charge event
        var glow = ""
        if (thisRound[arg.actor1].StageA !== 0) {
            glow = glow + "attack"
        }
        if (thisRound[arg.actor1].StageD !== 0) {
            glow = glow + "defence"
        }

        result.push(this.shortEvent({
            key: thisRound.Round + arg.actor1 + 11,
            value: <DSword className={"dsword svgFills color" + this.props.moveTable[thisRound[arg.actor1].ActionName].MoveType + " " + glow} />,
            tip: <>
                {strings.reconstruction.turn + thisRound.Round}<br />
                {thisRound[arg.actor1].ActionName}<br />
                {strings.reconstruction.damage + damage}<br />
                {strings.reconstruction.energy + energy}
                {(thisRound[arg.actor1].StageA !== 0) && <br />}
                {(thisRound[arg.actor1].StageA !== 0) ? strings.reconstruction.aStage + thisRound[arg.actor1].StageA : ""}
                {(thisRound[arg.actor1].StageD !== 0) && <br />}
                {(thisRound[arg.actor1].StageD !== 0) ? strings.reconstruction.dStage + thisRound[arg.actor1].StageD : ""}
                {(thisRound[arg.actor1].StageD !== 0 || thisRound[arg.actor1].StageA !== 0) && <br />}
                {(thisRound[arg.actor1].StageD !== 0 || thisRound[arg.actor1].StageA !== 0) ?
                    (thisRound[arg.actor1].IsSelf) ? strings.reconstruction.self : strings.reconstruction.opponent :
                    ""}

            </>,
        }))
    }

    addIdle(arg, result, thisRound) {
        result.push(this.shortEvent({
            class: "idle",
            key: thisRound.Round + arg.actor1 + 0,
            tip: <>
                {strings.reconstruction.turn + thisRound.Round}<br />
                {strings.reconstruction.idle}
            </>,
        }))
    }

    addQuickMove(arg, result, thisRound) {
        let damage = this.props.log[arg.i - 1][arg.actor2].HP - thisRound[arg.actor2].HP
        let energy = thisRound[arg.actor1].Energy - this.props.log[arg.i - 1][arg.actor1].Energy
        result.push(this.shortEvent({
            key: thisRound.Round + arg.actor1 + 1,
            value: <Sword className={"sword svgFills color" + this.props.moveTable[thisRound[arg.actor1].ActionName].MoveType} />,
            tip: <>
                {strings.reconstruction.turn + thisRound.Round}<br />
                {thisRound[arg.actor1].ActionName}<br />
                {strings.reconstruction.damage + damage}<br />
                {strings.reconstruction.energy + energy}
            </>,
        }))
    }


    addLastRound(arg, result, thisRound) {
        //set up icon for the guy who lost
        if (thisRound[arg.actor1].HP <= 0) {
            result.push(this.shortEvent({
                class: "faint",
                key: thisRound.Round + arg.actor1 + 100,
                value: "X",
                tip: <>
                    {strings.reconstruction.turn + thisRound.Round}<br />
                    {strings.reconstruction.faint}
                </>,
            }))
        }
        //otherwise just make an empty event for winner
        if (thisRound[arg.actor1].HP > 0) {
            this.addNoEvenet(arg, result, thisRound)
        }
    }

    addNoEvenet(arg, result, thisRound) {
        result.push(this.shortEvent({
            key: thisRound.Round + arg.actor1 + 5,
        }))
    }

    shortEvent(arg) {
        return (
            <Event
                onMouseEnter={this.props.onMouseEnter}
                onclick={this.props.constructorOn}

                className={arg.class}
                key={arg.key}
                value={arg.value}
                place="top"
                tip={arg.tip}
                for={arg.key} />
        )
    }


    render() {
        return (
            <>
                {this.returnReconstruction()}
            </>
        );
    }
}

export default EvoList;