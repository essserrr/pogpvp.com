import React from "react"
import LocalizedStrings from "react-localization"
import ReactTooltip from "react-tooltip"

import Header from "../../../Movedex/MovedexListFilter/MovedexListSort/MovedexListRender/TableThead/Header/Header"

import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

let strings = new LocalizedStrings(locale);


class ShinyTableThead extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <thead>
                <tr>
                    <th coltype="string" className="clickable align-text-top mx-0 mx-sm-2" name="Name" onClick={this.props.onClick} scope="col">
                        <Header
                            title={strings.shinyrates.pokname}
                            class="ml-2 align-self-center " classOut="row m-0 justify-content-center justify-content-sm-start"
                            checked={this.props.firstColumn}
                        />
                    </th>
                    <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="Odds" onClick={this.props.onClick} scope="col">
                        <Header
                            title={<>{strings.shinyrates.rate1}<wbr />{strings.shinyrates.rate2}</>}
                            class="ml-2 align-self-center " classOut="row p-0 justify-content-center"
                            checked={this.props.secondColumn}
                        />

                    </th>
                    <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="Odds" onClick={this.props.onClick} id="estimated" scope="col">
                        <Header
                            title={<div className="d-flex">
                                {strings.shinyrates.rateest}
                                <ReactTooltip
                                    className={"infoTip"}
                                    id={"shinyrate"} effect="solid"
                                    place={"top"}
                                    multiline={true}
                                >
                                    {strings.shinyrates.tip}
                                </ReactTooltip>
                                <i data-tip data-for={"shinyrate"} className="align-self-center fas fa-info-circle ml-1">
                                </i>
                            </div>}
                            class="ml-2 align-self-center " classOut="row p-0 justify-content-center"
                            checked={this.props.thirdColumn}
                        />
                    </th>
                    <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="Checks" onClick={this.props.onClick} scope="col">
                        <Header
                            title={strings.shinyrates.checks}
                            classOut="row p-0 justify-content-center" class="ml-2 align-self-center "
                            checked={this.props.fourthColumn}
                        />
                    </th>
                </tr>
            </thead>
        );
    }
}

export default ShinyTableThead;

