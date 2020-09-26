import React from "react"
import LocalizedStrings from "react-localization"

import Type from "../../../../PvP/components/CpAndTypes/Type"
import CloseButton from "../../../../PvP/components/MagicBox/CloseButton"

import { getCookie } from "../../../../../js/getCookie"
import { userLocale } from "../../../../../locale/userLocale"

import "./UserMove.scss"

let strings = new LocalizedStrings(userLocale)

const UserMove = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <div className={"col-auto px-0 mr-2 my-1 usermove"} onClick={() => props.onMoveOpen(props.move)}>
            <div className="row mx-0 p-1">
                <div className="col px-0 mt-1 mx-1 usermove__thead">
                    <Type
                        class={"mr-1 mb-1 icon18"}
                        code={props.move.MoveType}
                    />
                    {props.move.Title}
                </div>
                <CloseButton onClick={() => props.onMoveDelete(props.move)} />
                <div className="col-12 px-0 mx-1 usermove__body">{props.move.MoveCategory === "Fast Move" ? strings.moveconstr.catopt.q : strings.moveconstr.catopt.ch}</div>
            </div>
        </div>
    )
});

export default UserMove









