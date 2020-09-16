import React from "react";

import LocalizedStrings from "react-localization";
import { singleTips } from "../../../../locale/singleTips"
import { getCookie } from "../../../../js/getCookie"

let tips = new LocalizedStrings(singleTips)

const SingleDescr = React.memo(function (props) {
    tips.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.intr}
            </p>
            <h5 className="col-12 font-weight-bold m-0 px-1 py-1 text-center">
                {tips.rate}
            </h5>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.ratep1}
            </p>
            <p className="col-12 font-weight-bold m-0 px-1" >
                {tips.ratep2}
            </p>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.ratep3}
            </p>
            <h5 className="col-12 font-weight-bold m-0 px-1 py-1 text-center">
                {tips.max}
            </h5>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.maxp1}
            </p>
            <ul className="col-12 m-0 px-3 px-sm-5">
                <li>
                    {tips.maxul.li1}
                </li>
                <li>
                    {tips.maxul.li2}
                </li>
                <li>
                    {tips.maxul.li3}
                </li>
                <li>
                    {tips.maxul.li4}
                </li>
            </ul>
            <h5 className="col-12 font-weight-bold m-0 px-1 py-1 text-center">
                {tips.move}
            </h5>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.movep1}
            </p>
            <p className="col-12 m-0 px-1 " >
                {tips.movep2}
            </p>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.movep3}
            </p>
            <ul className="col-12 m-0 px-3 px-sm-5">
                <li>
                    {tips.moveul.li1}
                </li>
                <li>
                    {tips.moveul.li2}
                </li>
                <li>
                    {tips.moveul.li3}
                </li>
            </ul>
            <h5 className="col-12 font-weight-bold m-0 px-1 py-1 text-center">
                {tips.alg}
            </h5>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.algp1}
            </p>
            <ul className="col-12 m-0 px-3 px-sm-5">
                <li>
                    {tips.algul1.li1}
                </li>
                <li>
                    {tips.algul1.li2}
                </li>
                <li>
                    {tips.algul1.li3}
                </li>
            </ul>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.algp2}
            </p>
            <ul className="col-12 m-0 px-3 px-sm-5">
                <li>
                    {tips.algul2.li1}
                </li>
                <li>
                    {tips.algul2.li2}
                </li>
            </ul>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.algp3}
            </p>
            <h5 className="col-12 font-weight-bold m-0 px-1 py-1 text-center">
                {tips.constr}
            </h5>
            <p className="col-12 m-0 px-1 py-1" >
                {tips.constrp1}
            </p>
            <p className="col-12 font-weight-bold m-0 px-1 py-1" >
                {tips.constrp2}
            </p>
        </>
    )

});

export default SingleDescr;

