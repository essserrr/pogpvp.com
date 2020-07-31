import React from "react";
import CSSTransitionGroup from "react-addons-css-transition-group"
import LocalizedStrings from "react-localization";
import ReactTooltip from "react-tooltip"

import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/getCookie"
import Header from "../../Movedex/Header/Header"
import Input from "../../PvP/components/Input/Input"


let strings = new LocalizedStrings(locale);


const ShinyTable = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <Input
                class="modifiedBorder form-control mb-2"
                onChange={props.onChange}
                place={strings.shinyrates.searchplaceholder}
            />
            <table className="table  table-sm text-center">
                <thead>
                    <tr>
                        <th coltype="string" className="clickable align-text-top mx-0 mx-sm-2" name="Name" onClick={props.onClick} scope="col">
                            <Header
                                title={strings.shinyrates.pokname}
                                class="ml-2 align-self-center " classOut="row m-0 justify-content-center justify-content-sm-start"
                                checked={props.firstColumn}
                            />
                        </th>
                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="Odds" onClick={props.onClick} scope="col">
                            <Header
                                title={<>{strings.shinyrates.rate1}<wbr />{strings.shinyrates.rate2}</>}
                                class="ml-2 align-self-center " classOut="row p-0 justify-content-center"
                                checked={props.secondColumn}
                            />

                        </th>
                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="Odds" onClick={props.onClick} id="estimated" scope="col">
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
                                checked={props.thirdColumn}
                            />
                        </th>
                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="Checks" onClick={props.onClick} scope="col">
                            <Header
                                title={strings.shinyrates.checks}
                                classOut="row p-0 justify-content-center" class="ml-2 align-self-center "
                                checked={props.fourthColumn}
                            />
                        </th>
                    </tr>
                </thead>
                <CSSTransitionGroup
                    component="tbody"
                    transitionName="shiny"
                    transitionEnterTimeout={150}
                    transitionLeaveTimeout={150}
                >
                    {props.body}
                </CSSTransitionGroup>

            </table>
        </>
    )

});

export default ShinyTable;

