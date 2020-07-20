import React from "react";
import ReactTooltip from "react-tooltip"

import LocalizedStrings from "react-localization";
import { commonRaidTips } from "../../../../locale/commonRaidTips"

import { getCookie } from "../../../../js/indexFunctions"

let tips = new LocalizedStrings(commonRaidTips)

const CommonDescr = React.memo(function (props) {
    tips.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <p className="col-12 tipfont m-0 px-1 pb-2" >
                {tips.par1}
            </p>
            <h5 className="col-12 font-weight-bold p-0 mb-1 text-center">
                {tips.legend}
            </h5>
            <div className="col-12 d-flex justify-content-center p-0 py-1">
                <i data-tip data-for={"damage"} className="fas fa-crosshairs mr-3 fa-2x"></i>
                <ReactTooltip
                    className={"infoTip"}
                    id={"damage"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {tips.damage}
                </ReactTooltip>
                <i data-tip data-for={"players"} className="fas fa-users mr-3 fa-2x"></i>
                <ReactTooltip
                    className={"infoTip"}
                    id={"players"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {tips.pl}
                </ReactTooltip>
                <i data-tip data-for={"dps"} className="fab fa-cloudscale mr-3 fa-2x"></i>
                <ReactTooltip
                    className={"infoTip"}
                    id={"dps"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {"DPS"}
                </ReactTooltip>
                <i data-tip data-for={"fainted"} className="fas fa-skull-crossbones mr-3 fa-2x"></i>
                <ReactTooltip
                    className={"infoTip"}
                    id={"fainted"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {tips.fainted}
                </ReactTooltip>
                <i data-tip data-for={"time"} className="far fa-clock mr-3 fa-2x"></i>
                <ReactTooltip
                    className={"infoTip"}
                    id={"time"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {tips.time}
                </ReactTooltip>
                <i data-tip data-for={"ttw"} className="far fa-hourglass fa-2x"></i>
                <ReactTooltip
                    className={"infoTip"}
                    id={"ttw"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {tips.ttw}
                </ReactTooltip>
            </div>

            <h5 className="col-12 font-weight-bold m-0 px-1 py-1 text-center">
                {tips.indat}
            </h5>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.indatp1}
            </p>
            <p className="col-12 tipfont m-0 px-1" >
                {tips.indatp2}
            </p>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.indatp3}
            </p>

            <h5 className="col-12 font-weight-bold m-0 px-1 py-1  text-center">
                {tips.plnumb}
            </h5>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.plnumbp1}
            </p>

            <h5 className="col-12 font-weight-bold m-0 px-1 py-1  text-center">
                {tips.dodge}
            </h5>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.dodgep1}
            </p>

            <h5 className="col-12 font-weight-bold m-0 px-1 py-1  text-center">
                {tips.agr}
            </h5>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.agrp1}
            </p>


            <h5 className="col-12 font-weight-bold m-0 px-1 py-1  text-center">
                {tips.solv}
            </h5>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.solvp1}
            </p>
            <p className="col-12 tipfont p-0 m-0 px-1" >
                {tips.solvp2}
            </p>
            <ul className="col-12 tipfont p-0 m-0 px-3 px-sm-5 py-1">
                <li>
                    {tips.solvli1}
                </li>
                <li>
                    {tips.solvli2}
                </li>
                <li>
                    {tips.solvli3}
                </li>
                <li>
                    {tips.solvli4}
                </li>
            </ul>

            <h5 className="col-12 font-weight-bold m-0 px-1 py-1  text-center">
                {tips.break}
            </h5>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.breakp1}
            </p>

            <h5 className="col-12 font-weight-bold m-0 px-1 py-1  text-center">
                {tips.feat}
            </h5>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.featp1}
            </p>
        </>
    )
});

export default CommonDescr;
