import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import TableRow from '@material-ui/core/TableRow';

import Event from "./Event/Event";

import { ReactComponent as Shield } from "icons/shield.svg"
import { ReactComponent as Sword } from "icons/sword.svg"
import { ReactComponent as DSword } from "icons/dsword.svg"
import { reconstr } from "locale/Pvp/Reconstruction/Reconstruction"
import { getCookie } from "js/getCookie"

let strings = new LocalizedStrings(reconstr);

const TimelineGenerator = React.memo(function TimelineGenerator(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    const returnReconstruction = () => {
        let attackerTimeline = []
        let defenderTimeline = []
        for (let i = 1; i < props.log.length; i++) {
            let orderA = true
            let orderD = false
            if (props.log[i].Attacker.Order !== props.log[i].Defender.Order) {
                orderA = props.log[i].Attacker.Order
                orderD = props.log[i].Defender.Order
            }
            attackerTimeline.push(
                processPokemonResults({
                    i: i,
                    actor1: "Attacker",
                    actor2: "Defender",
                    order: orderA,
                })
            )
            defenderTimeline.push(
                processPokemonResults({
                    i: i,
                    actor1: "Defender",
                    actor2: "Attacker",
                    order: orderD,
                })
            )
        }

        attackerTimeline.push(<td key="hiddenA"><div style={{ width: 10, visibility: "hidden" }} /></td>)
        defenderTimeline.push(<td key="hiddenD"><div style={{ width: 10, visibility: "hidden" }} /></td>)

        return [<TableRow key="attacker">{attackerTimeline}</TableRow>, <TableRow key="defender">{defenderTimeline}</TableRow>,]
    }

    function processPokemonResults(arg) {
        let result = []
        const thisRound = props.log[arg.i]
        //if there is no next round
        if (props.log[arg.i + 1] === undefined) {
            addLastRound(arg, result, thisRound)
            return result
        }
        //otherwise parse round
        //if actions is quick move, add quick move event
        if (thisRound[arg.actor1].ActionCode === 1) {
            addQuickMove(arg, result, thisRound)
        }
        //if action is idle, make idle event
        if (thisRound[arg.actor1].ActionCode === 0) {
            addIdle(arg, result, thisRound)
        }

        switch (arg.order) {
            case true:
                //if action is charge move, create charge move event
                if (thisRound[arg.actor1].ActionCode === 11) {
                    addChargeMove(arg, result, thisRound)
                }
                //if opponent used a charge move, create shield event if it's possible
                if (thisRound[arg.actor2].ActionCode === 11) {
                    addShield(arg, result, thisRound)

                }
                break
            default:
                //if opponent used a charge move, create shield event if it's possible
                if (thisRound[arg.actor2].ActionCode === 11) {
                    addShield(arg, result, thisRound)

                }
                //if action is charge move, create charge move event
                if (thisRound[arg.actor1].ActionCode === 11) {
                    addChargeMove(arg, result, thisRound)
                }
                break
        }
        return result
    }

    function addShield(arg, result, thisRound) {
        switch (true) {
            case thisRound[arg.actor1].ShieldIsUsed:
                let shieldEvent = shortEvent({
                    eventType: "shield",

                    key: thisRound.Round + arg.actor1 + 7,
                    value: <Shield />,
                    tip:
                        <>
                            {strings.reconstruction.turn + thisRound.Round}<br />
                            {strings.reconstruction.shield}
                        </>,
                })
                result.push(shieldEvent)
                break;
            default:
                addNoEvenet(arg, result, thisRound)
        }
    }

    function addChargeMove(arg, result, thisRound) {
        let damage = props.log[arg.i - 1][arg.actor2].HP - thisRound[arg.actor2].HP
        let energy = thisRound[arg.actor1].Energy - props.log[arg.i - 1][arg.actor1].Energy
        //if other guy's action is not a chanrge move, we need to make indent
        if (thisRound[arg.actor2].ActionCode !== 11) {
            if (thisRound[arg.actor2].ActionCode === 1 || thisRound[arg.actor2].ActionCode === 0) {
                addNoEvenet(arg, result, thisRound)
            }
        }
        //then make own charge event
        let glow = ""
        if (thisRound[arg.actor1].StageA !== 0) {
            glow = glow + "attack"
        }
        if (thisRound[arg.actor1].StageD !== 0) {
            glow = glow + "defence"
        }

        result.push(shortEvent({
            eventType: "dsword",
            moveType: props.moveTable[thisRound[arg.actor1].ActionName].MoveType,
            glow: glow,

            key: thisRound.Round + arg.actor1 + 11,
            value: <DSword />,
            tip:
                <>
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

    function addIdle(arg, result, thisRound) {
        result.push(shortEvent({
            eventType: "idle",

            key: thisRound.Round + arg.actor1 + 0,
            tip: <>
                {strings.reconstruction.turn + thisRound.Round}<br />
                {strings.reconstruction.idle}
            </>,
        }))
    }

    function addQuickMove(arg, result, thisRound) {
        let damage = props.log[arg.i - 1][arg.actor2].HP - thisRound[arg.actor2].HP
        let energy = thisRound[arg.actor1].Energy - props.log[arg.i - 1][arg.actor1].Energy
        result.push(shortEvent({
            eventType: "sword",
            moveType: props.moveTable[thisRound[arg.actor1].ActionName].MoveType,

            key: thisRound.Round + arg.actor1 + 1,
            value: <Sword />,
            tip:
                <>
                    {strings.reconstruction.turn + thisRound.Round}<br />
                    {thisRound[arg.actor1].ActionName}<br />
                    {strings.reconstruction.damage + damage}<br />
                    {strings.reconstruction.energy + energy}
                </>,
        }))
    }


    function addLastRound(arg, result, thisRound) {
        //set up icon for the guy who lost
        if (thisRound[arg.actor1].HP <= 0) {
            result.push(shortEvent({
                eventType: "faint",

                key: thisRound.Round + arg.actor1 + 100,
                value: "X",
                tip:
                    <>
                        {strings.reconstruction.turn + thisRound.Round}<br />
                        {strings.reconstruction.faint}
                    </>,
            }))
        }
        //otherwise just make an empty event for winner
        if (thisRound[arg.actor1].HP > 0) {
            addNoEvenet(arg, result, thisRound)
        }
    }

    function addNoEvenet(arg, result, thisRound) {
        result.push(shortEvent({
            key: thisRound.Round + arg.actor1 + 5,
        }))
    }

    function shortEvent(arg) {
        return (
            <Event
                onMouseEnter={props.onMouseEnter}
                onclick={props.constructorOn}
                moveType={arg.moveType} eventType={arg.eventType} glow={arg.glow}
                key={arg.key} tip={arg.tip} id={arg.key}
            >
                {arg.value}
            </Event>
        )
    }

    return (
        returnReconstruction()
    )
});

export default TimelineGenerator;

TimelineGenerator.propTypes = {
    log: PropTypes.arrayOf(PropTypes.object),
    moveTable: PropTypes.object,
    onMouseEnter: PropTypes.func,
    constructorOn: PropTypes.func,
};