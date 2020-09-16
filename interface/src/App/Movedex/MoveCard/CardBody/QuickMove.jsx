import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/dexLocale"
import CommonPve from "./CommonPve"
import CommonPvp from "./CommonPvp"

import "./QuickMove.scss"

let strings = new LocalizedStrings(dexLocale)

const QuickMove = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <div className="col-12 col-sm-6 p-0 px-1">
                <h5 className="text-center text-sm-left fBolder">
                    {strings.movecard.pve}
                </h5>
                <table className={"quick-move table table-sm table-hover text-center mb-0 " + (props.class ? props.class : "")} >
                    <tbody >
                        <CommonPve
                            energy={props.move.Energy}
                            move={props.move}
                        />
                        <tr>
                            <th className="align-middle  m-0 p-0 py-1" scope="row" >{strings.movecard.eps}</th>
                            <td className="align-middle  m-0 p-0 py-1" >{
                                (Math.abs(props.move.Energy) / (props.move.Cooldown / 1000)).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-12 col-sm-6 p-0 px-1">
                <h5 className="text-center text-sm-left fBolder">
                    {strings.movecard.pve}
                </h5>
                <table className={"quick-move table table-sm table-hover text-center mb-0 " + (props.class ? props.class : "")} >
                    <tbody >
                        <CommonPvp
                            energy={props.move.Energy}
                            move={props.move}
                        />
                        <tr>
                            <th className="align-middle m-0 p-0 py-1" scope="row" >{strings.movecard.dpt}</th>
                            <td className="align-middle m-0 p-0 py-1" >{
                                (props.move.PvpDamage / (props.move.PvpDurationSeconds / 0.5)).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th className="align-middle m-0 p-0 py-1" scope="row" >{strings.movecard.ept}</th>
                            <td className="align-middle m-0 p-0 py-1" >{
                                (props.move.PvpEnergy / (props.move.PvpDurationSeconds / 0.5)).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )

});

export default QuickMove;
