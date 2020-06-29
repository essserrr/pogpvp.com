import React from "react";
import LocalizedStrings from 'react-localization';

import Header from "../Header/Header"
import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const TableThead = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <thead>
            <tr>
                <th coltype="string"
                    onClick={props.onClick}
                    className="text-center clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Title" scope="col">
                    <Header
                        checked={props.active.Title}
                        title={strings.mt.n}
                        class="ml-2 align-self-center "

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="MoveType" scope="col">
                    <Header
                        checked={props.active.MoveType}
                        title={strings.mt.tp}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Damage" scope="col">
                    <Header
                        checked={props.active.Damage}
                        title={strings.mt.rd}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Energy" scope="col">
                    <Header
                        checked={props.active.Energy}
                        title={strings.mt.re}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Cooldown" scope="col">
                    <Header
                        checked={props.active.Cooldown}
                        title={strings.mt.cd}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="PvpDamage"
                    scope="col">
                    <Header
                        checked={props.active.PvpDamage}
                        title={strings.mt.pd}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="PvpEnergy" scope="col">
                    <Header
                        checked={props.active.PvpEnergy}
                        title={strings.mt.pe}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="PvpDurationSeconds" scope="col">
                    <Header
                        checked={props.active.PvpDurationSeconds}
                        title={strings.mt.dr}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="string"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Subject" scope="col">
                    <Header
                        checked={props.active.Subject}
                        title={strings.mt.ef}
                        class="ml-2 align-self-center "

                    />
                </th>
            </tr>
        </thead>
    )

});

export default TableThead;