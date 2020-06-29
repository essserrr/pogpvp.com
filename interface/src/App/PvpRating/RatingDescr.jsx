import React from "react";

import LocalizedStrings from 'react-localization';
import { singleTips } from "../../locale/ratingTips"
import { getCookie } from "../../js/indexFunctions"

let tips = new LocalizedStrings(singleTips)

const RatingDescr = React.memo(function (props) {
    tips.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <p className="col-12 tipfont p-0 m-0 px-1 py-1" >
                {tips.intr}
            </p>
            <h5 className="col-12 font-weight-bold m-0 p-0 px-1 py-1 text-center">
                {tips.rate}
            </h5>
            <p className="col-12 tipfont p-0 m-0 px-1 py-1" >
                {tips.ratep1}
            </p>
            <p className="col-12 tipfont p-0 m-0 px-1" >
                {tips.ratep2}
            </p>
            <p className="col-12 tipfont p-0 m-0 px-1 py-1" >
                {tips.ratep3}
            </p>



            <h5 className="col-12 font-weight-bold m-0 p-0 px-1 py-1 text-center">
                {tips.alg}
            </h5>
            <p className="col-12 tipfont p-0 m-0 px-1 py-1" >
                {tips.algp1}
            </p>
            <ul className="col-12 tipfont p-0 m-0 px-3 px-sm-5">
                <li>
                    {tips.algul1.li1}
                </li>
                <li>
                    {tips.algul1.li2}
                </li>
                <li>
                    {tips.algul1.li3}
                </li>
                <li>
                    {tips.algul1.li4}
                </li>
            </ul>




            <h5 className="col-12 font-weight-bold m-0 p-0 px-1 py-1 text-center">
                {tips.move}
            </h5>
            <p className="col-12 tipfont p-0 m-0 px-1 py-1" >
                {tips.movep1}
            </p>
            <p className="col-12 tipfont font-weight-bold p-0 m-0 px-1 " >
                {tips.movep2}
            </p>
            <p className="col-12 tipfont p-0 m-0 px-1 py-1" >
                {tips.movep3}
            </p>
        </>
    )

});

export default RatingDescr;

