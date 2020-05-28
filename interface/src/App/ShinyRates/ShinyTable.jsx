import React from "react";
import CSSTransitionGroup from 'react-addons-css-transition-group'
import LocalizedStrings from 'react-localization';
import ReactTooltip from "react-tooltip"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"

let strings = new LocalizedStrings(locale);


const ShinyTable = React.memo(function Pokemon(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <input onChange={props.onChange} className="form-control" type="text" placeholder={strings.shinyrates.searchplaceholder}>
            </input>
            <table className="table  table-sm text-center">
                <thead>
                    <tr>
                        <th colType="string" className="text-left  clickable align-text-top mx-0 mx-sm-2" name="0" onClick={props.onClick} scope="col">
                            <div className="row  m-0 p-0 justify-content-center justify-content-sm-start">
                                {strings.shinyrates.pokname}
                                <div className={"ml-2 align-self-center " + (props.firstColumn ? "fas fa-angle-down fa-md" : "fas fa-angle-up fa-md")} />
                            </div>
                        </th>
                        <th colType="number" className="clickable align-text-top mx-0 mx-sm-2" name="1" onClick={props.onClick} scope="col">
                            <div className="row m-0 p-0 justify-content-center">
                                {strings.shinyrates.rate1}<wbr />{strings.shinyrates.rate2}
                                <div className={"ml-2 align-self-center " + (props.secondColumn ? "fas fa-angle-up fa-md" : "fas fa-angle-down fa-md")} />

                            </div>
                        </th>
                        <th colType="number" className="clickable align-text-top mx-0 mx-sm-2" name="1" onClick={props.onClick} id="estimated" scope="col">
                            <div className="row m-0 p-0 justify-content-center">
                                <div className="d-flex">
                                    {strings.shinyrates.rateest}
                                    <i data-tip data-for={"shinyrate"} className="align-self-center fas fa-info-circle ml-1">
                                        {<ReactTooltip
                                            className={"infoTip"}
                                            id={"shinyrate"} effect='solid'
                                            place={"top"}
                                            multiline={true}
                                        >
                                            {strings.shinyrates.tip}
                                        </ReactTooltip>}
                                    </i>
                                </div>
                                <div className={"ml-2 align-self-center " + (props.secondColumn ? "fas fa-angle-up fa-md" : "fas fa-angle-down fa-md")} />

                            </div>
                        </th>
                        <th colType="number" className="clickable align-text-top mx-0 mx-sm-2" name="3" onClick={props.onClick} scope="col">
                            <div className="row m-0 p-0 justify-content-center">
                                {strings.shinyrates.checks}
                                <div className={"ml-2 align-self-center " + (props.fourthColumn ? "fas fa-angle-up fa-md" : "fas fa-angle-down fa-md")} />

                            </div>
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

