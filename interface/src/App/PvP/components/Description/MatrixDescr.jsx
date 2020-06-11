import React from "react";
import ReactTooltip from "react-tooltip"

import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { matrixTips } from "../../../../locale/matrixTips"
import { getCookie } from "../../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);
let tips = new LocalizedStrings(matrixTips)

const MatrixDecr = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    tips.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <p className="col-12 tipfont p-0 m-0 px-1" >
                {tips.par1}
            </p>
            <p className="col-12 tipfont m-0 p-0 my-2">
                {tips.par2}
            </p>
            <h6 className="col-12 font-weight-bold m-0 p-0 mb-1 text-center">
                {tips.overall}
            </h6>
            <div className="col-12 d-flex justify-content-center m-0 p-0 ">

                <div className="mx-3">
                    <div className="tipfont text-center">
                        {tips.result}
                    </div>
                    <div className="matrixCard bor row justify-content-center text-center m-0 p-0">
                        <div data-tip data-for={"0vs0"} className={"col-4 m-0 p-0 cupl hover matrixCardThead rateColor res3"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"0vs0"} effect='solid'
                                place={"top"}
                                multiline={true} >
                                {tips.cells.v0}
                            </ReactTooltip>
                            {"+1"}
                        </div>
                        <div data-tip data-for={"1vs1"} className={"col-4 m-0 p-0   hover matrixCardThead borx rateColor res0"}>
                            <ReactTooltip
                                className={"infoTip"}
                                id={"1vs1"} effect='solid'
                                place={"top"}
                                multiline={true} >
                                {tips.cells.v1}
                            </ReactTooltip>
                            {"0"}
                        </div>
                        <div data-tip data-for={"2vs2"} className={"col-4 m-0 p-0  cupr hover matrixCardThead rateColor res1"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"2vs2"} effect='solid'
                                place={"top"}
                                multiline={true} >
                                {tips.cells.v2}
                            </ReactTooltip>
                            {"-1"}
                        </div>

                        <div data-tip data-for={"over"} className={"matrixCardBody bort cbotlr hover col-12 m-0 p-0 rateColor res4"}>
                            <ReactTooltip
                                className={"infoTip"}
                                id={"over"} effect='solid'
                                place={"top"}
                                multiline={true} >
                                {tips.cells.over}
                            </ReactTooltip>
                            {1000}
                        </div>

                    </div>
                </div>




                <div className="mx-3 align-self-center">
                    <div className="tipfont text-center">
                        {tips.color}
                    </div>

                    <div className="d-flex ">
                        <div data-tip data-for={"pl2color"} style={{ width: "30px", height: "25px" }} className={"mr-1 text-center  hover matrixCardThead bor rateColor res4"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"pl2color"} effect='solid'
                                place={"top"}
                                multiline={true} >
                                {tips.colortip.g2}
                            </ReactTooltip>
                            {"+2"}
                        </div>
                        <div data-tip data-for={"pl1color"} style={{ width: "30px", height: "25px" }} className={"mr-1 text-center  hover matrixCardThead bor rateColor res3"}>
                            <ReactTooltip
                                className={"infoTip"}
                                id={"pl1color"} effect='solid'
                                place={"top"}
                                multiline={true}  >
                                {tips.colortip.g1}
                            </ReactTooltip>
                            {"+1"}
                        </div>
                        <div data-tip data-for={"pl0color"} style={{ width: "30px", height: "25px" }} className={"mr-1 text-center  hover matrixCardThead bor rateColor res0"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"pl0color"} effect='solid'
                                place={"top"}
                                multiline={true} >
                                {tips.colortip.g}
                            </ReactTooltip>
                            {"0"}
                        </div>
                        <div data-tip data-for={"mi1color"} style={{ width: "30px", height: "25px" }} className={"mr-1 text-center  hover matrixCardThead bor rateColor res1"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"mi1color"} effect='solid'
                                place={"top"}
                                multiline={true} >
                                {tips.colortip.r1}
                            </ReactTooltip>
                            {"-1"}
                        </div>
                        <div data-tip data-for={"mi2color"} style={{ width: "30px", height: "25px" }} className={" text-center  hover matrixCardThead bor rateColor res2"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"mi2color"} effect='solid'
                                place={"top"}
                                multiline={true} >
                                {tips.colortip.r2}
                            </ReactTooltip>
                            {"-2"}
                        </div>
                    </div>
                </div>
            </div>
        </>


    )

});

export default MatrixDecr;
