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
                <th coltype="string" className="text-left  clickable align-text-top mx-0 mx-sm-2" name="0" scope="col">
                    <Header
                        title={strings.mt.n}
                        class="ml-2 align-self-center "
                        checked={false}
                    />
                </th>
                <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="1" scope="col">
                    <Header
                        title={strings.mt.tp}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"
                        checked={false}
                    />
                </th>
                <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="2" id="estimated" scope="col">
                    <Header
                        title={strings.mt.rd}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"
                        checked={false}
                    />
                </th>
                <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="3" id="estimated" scope="col">
                    <Header
                        title={strings.mt.re}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"
                        checked={false}
                    />
                </th>
                <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="4" id="estimated" scope="col">
                    <Header
                        title={strings.mt.cd}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"
                        checked={false}
                    />
                </th>
                <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="5" scope="col">
                    <Header
                        title={strings.mt.pd}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"
                        checked={false}
                    />
                </th>
                <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="6" scope="col">
                    <Header
                        title={strings.mt.pe}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"
                        checked={false}
                    />
                </th>
                <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="7" scope="col">
                    <Header
                        title={strings.mt.dr}
                        class="ml-2 align-self-center "
                        classOut="row m-0 p-0 justify-content-center"
                        checked={false}
                    />
                </th>
                <th coltype="string" className="clickable align-text-top mx-0 mx-sm-2" name="8" scope="col">
                    <Header
                        title={strings.mt.ef}
                        class="ml-2 align-self-center "
                        checked={false}
                    />
                </th>
            </tr>
        </thead>
    )

});

export default TableThead;