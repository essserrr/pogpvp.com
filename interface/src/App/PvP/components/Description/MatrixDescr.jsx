import React from "react";
import ReactTooltip from "react-tooltip"

import PokemonIconer from "../PokemonIconer/PokemonIconer"
import { ReactComponent as Shadow } from "../../../../icons/shadow.svg";

import LocalizedStrings from "react-localization";
import { matrixTips } from "../../../../locale/matrixTips"
import { getCookie } from "../../../../js/getCookie"

let tips = new LocalizedStrings(matrixTips)

const MatrixDecr = React.memo(function (props) {
    tips.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <p className="col-12 tipfont m-0 px-1" >
                {tips.par1}
            </p>
            <p className="col-12 tipfont m-0 my-2">
                {tips.par2}
            </p>
            <h6 className="col-12 font-weight-bold m-0 mb-1 text-center">
                {tips.overall}
            </h6>
            <div className="col-12 d-flex justify-content-center m-0 ">

                <div className="mx-3">
                    <div className="tipfont text-center">
                        {tips.result}
                    </div>
                    <div className="matrixTriple row justify-content-center text-center m-0">
                        <div data-tip data-for={"0vs0"} className={"col-4 p-0 hover rateColorR3"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"0vs0"} effect="solid"
                                place={"top"}
                                multiline={true} >
                                {tips.cells.v0}
                            </ReactTooltip>
                            {"+1"}
                        </div>
                        <div data-tip data-for={"1vs1"} className={"col-4 p-0 hover  rateColorR0"}>
                            <ReactTooltip
                                className={"infoTip"}
                                id={"1vs1"} effect="solid"
                                place={"top"}
                                multiline={true} >
                                {tips.cells.v1}
                            </ReactTooltip>
                            {"0"}
                        </div>
                        <div data-tip data-for={"2vs2"} className={"col-4 p-0  hover rateColorR1"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"2vs2"} effect="solid"
                                place={"top"}
                                multiline={true} >
                                {tips.cells.v2}
                            </ReactTooltip>
                            {"-1"}
                        </div>

                        <div data-tip data-for={"over"} className={" hover col-12 p-0 rateColorR4"}>
                            <ReactTooltip
                                className={"infoTip"}
                                id={"over"} effect="solid"
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
                        <div data-tip data-for={"pl2color"} style={{ width: "30px", height: "25px" }} className={"mr-1 text-center  hover rateColorR4"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"pl2color"} effect="solid"
                                place={"top"}
                                multiline={true} >
                                {tips.colortip.g2}
                            </ReactTooltip>
                            {"+2"}
                        </div>
                        <div data-tip data-for={"pl1color"} style={{ width: "30px", height: "25px" }} className={"mr-1 text-center  hover rateColorR3"}>
                            <ReactTooltip
                                className={"infoTip"}
                                id={"pl1color"} effect="solid"
                                place={"top"}
                                multiline={true}  >
                                {tips.colortip.g1}
                            </ReactTooltip>
                            {"+1"}
                        </div>
                        <div data-tip data-for={"pl0color"} style={{ width: "30px", height: "25px" }} className={"mr-1 text-center  hover rateColorR0"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"pl0color"} effect="solid"
                                place={"top"}
                                multiline={true} >
                                {tips.colortip.g}
                            </ReactTooltip>
                            {"0"}
                        </div>
                        <div data-tip data-for={"mi1color"} style={{ width: "30px", height: "25px" }} className={"mr-1 text-center  hover rateColorR1"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"mi1color"} effect="solid"
                                place={"top"}
                                multiline={true} >
                                {tips.colortip.r1}
                            </ReactTooltip>
                            {"-1"}
                        </div>
                        <div data-tip data-for={"mi2color"} style={{ width: "30px", height: "25px" }} className={" text-center  hover rateColorR2"} >
                            <ReactTooltip
                                className={"infoTip"}
                                id={"mi2color"} effect="solid"
                                place={"top"}
                                multiline={true} >
                                {tips.colortip.r2}
                            </ReactTooltip>
                            {"-2"}
                        </div>
                    </div>
                </div>
            </div>

            <h5 className="col-12 font-weight-bold m-0 px-1 py-1 pt-3 text-center">
                {tips.adv}
            </h5>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.advp1}
            </p>
            <p className="col-12 tipfont m-0 px-1 " >
                {tips.advp2}
            </p>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.advp3}
            </p>
            <p className="col-12 tipfont m-0 px-1 " >
                {tips.advp4}
            </p>
            <p className="col-12 tipfont m-0 px-1 py-1" >
                {tips.advp5}
            </p>
            <h6 className="col-12 font-weight-bold m-0 mb-1 text-center">
                {tips.advTip}
            </h6>


            <div className={"pokCard row m-0 py-1 mb-3 mt-2 bigFont justify-content-between"}>
                <div className={"row m-0"}>
                    <div data-tip data-for={"topnumber"} className="ml-2 mr-2  align-self-center ">{"#1"}</div>
                    <ReactTooltip
                        className={"infoTip"}
                        id={"topnumber"} effect="solid"
                        place={"top"}
                        multiline={true} >
                        {tips.cardTip.n}
                    </ReactTooltip>
                    <div data-tip data-for={"iconpok1"} className="posRel">
                        <PokemonIconer
                            src={"644"}
                            class={"icon48 ml-1 ml-sm-3  mr-2"} />
                        <ReactTooltip
                            className={"infoTip"}
                            id={"iconpok1"} effect="solid"
                            place={"top"}
                            multiline={true} >
                            {tips.cardTip.p1}
                        </ReactTooltip>
                    </div>

                    <div data-tip data-for={"iconpok2"} className="posRel">
                        {<Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={"493-3"}
                            class={"icon48 ml-1 ml-sm-3  mr-2"} />
                        <ReactTooltip
                            className={"infoTip"}
                            id={"iconpok2"} effect="solid"
                            place={"top"}
                            multiline={true} >
                            {tips.cardTip.p2}
                        </ReactTooltip>
                    </div>

                    <div data-tip data-for={"iconpok3"} className="posRel">
                        <PokemonIconer
                            src={"132"}
                            class={"icon48 ml-1 ml-sm-3 mr-2"} />
                        <ReactTooltip
                            className={"infoTip"}
                            id={"iconpok3"} effect="solid"
                            place={"top"}
                            multiline={true} >
                            {tips.cardTip.p3}
                        </ReactTooltip>
                    </div>
                </div>

                <ReactTooltip
                    className={"infoTip"}
                    id={"zerosn"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {tips.cardTip.zer}
                </ReactTooltip>
                <div data-tip data-for={"zerosn"} className="col-auto mx-auto align-self-center ">
                    <i className="fas fa-skull-crossbones mr-1"></i>
                        99
                    </div>

                <ReactTooltip
                    className={"infoTip"}
                    id={"avgratetop"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {tips.cardTip.rate}
                </ReactTooltip>
                <div data-tip data-for={"avgratetop"} className="col-auto mx-auto align-self-center ">
                    <i className="fas fa-trophy mr-1"></i>
                    1000
                </div>

                <div className={"row m-0 p-0"}>
                    <div data-tip data-for={"more"} className="clickable align-self-center m-0 p-0  px-3">
                        <i className={"fas fa-angle-down fa-lg"}></i>
                        <ReactTooltip
                            className={"infoTip"}
                            id={"more"} effect="solid"
                            place={"top"}
                            multiline={true} >
                            {tips.cardTip.more}
                        </ReactTooltip>
                    </div>
                </div>
            </div>
        </>


    )

});

export default MatrixDecr;
