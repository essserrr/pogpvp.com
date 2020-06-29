import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import CommonPve from "./CommonPve"
import CommonPvp from "./CommonPvp"

let strings = new LocalizedStrings(dexLocale);

const QuickMove = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <div className="col-12 col-sm-6 m-0 p-0 px-1">
                <h5 className="text-center text-sm-left">
                    {strings.movecard.pve}
                </h5>
                <table className={"table table-sm table-hover text-center mb-0 " + (props.class ? props.class : "")} >
                    <tbody className="modifiedBorderTable ">
                        <CommonPve
                            energy={props.move.Energy}
                            move={props.move}
                        />
                        <tr>
                            <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 cardFirst" scope="row" >{strings.movecard.eps}</th>
                            <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 cardFirst" >{
                                (Math.abs(props.move.Energy) / (props.move.Cooldown / 1000)).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-12 col-sm-6 m-0 p-0 px-1">
                <h5 className="text-center text-sm-left">
                    {strings.movecard.pve}
                </h5>
                <table className={"table table-sm table-hover text-center mb-0 " + (props.class ? props.class : "")} >
                    <tbody className="modifiedBorderTable ">
                        <CommonPvp
                            energy={props.move.Energy}
                            move={props.move}
                        />
                        <tr>
                            <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 cardFirst" scope="row" >{strings.movecard.dpt}</th>
                            <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 cardFirst" >{
                                (props.move.PvpDamage / (props.move.PvpDurationSeconds / 0.5)).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 cardFirst" scope="row" >{strings.movecard.ept}</th>
                            <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 cardFirst" >{
                                (props.move.PvpEnergy / (props.move.PvpDurationSeconds / 0.5)).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )

});

export default QuickMove;
