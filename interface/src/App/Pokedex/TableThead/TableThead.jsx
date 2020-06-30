import React from "react";
import LocalizedStrings from 'react-localization';

import Header from "../../Movedex/Header/Header"
import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const TableThead = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <thead>
            <tr>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Number" scope="col">
                    <Header
                        checked={props.active.Number}
                        title={"ID"}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="string"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 px-0 px-sm-2"
                    name="Title" scope="col">
                    <Header
                        checked={props.active.Title}
                        title={strings.mt.n}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center  justify-content-sm-start"

                    />
                </th>
                <th coltype="type"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Type" scope="col">
                    <Header
                        checked={props.active.Type}
                        title={strings.mt.tp}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Generation" scope="col">
                    <Header
                        checked={props.active.Generation}
                        title={strings.mt.gen}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Atk" scope="col">
                    <Header
                        checked={props.active.Atk}
                        title={strings.Atk}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Def" scope="col">
                    <Header
                        checked={props.active.Def}
                        title={strings.Def}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="Sta"
                    scope="col">
                    <Header
                        checked={props.active.Sta}
                        title={strings.Sta}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
                <th coltype="number"
                    onClick={props.onClick}
                    className="clickable align-text-top p-0 py-2 mx-0 mx-sm-2"
                    name="CP"
                    scope="col">
                    <Header
                        checked={props.active.CP}
                        title={"CP"}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"

                    />
                </th>
            </tr>
        </thead >
    )

});

export default TableThead;