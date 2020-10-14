import React from "react";
import LocalizedStrings from "react-localization";


import Button from "../../Movedex/MoveCard/DoubleSlider/Button/Button"
import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/getCookie"

import "./ButtonsBlock.scss"

let strings = new LocalizedStrings(locale)

const ButtonsBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (

        <div className={"eggsslider-group row m-0 mb-3 text-center justify-content-center"} >
            <Button
                attr="eggs0"
                title={"10km"}
                class={props.filter.eggs0 ? "eggsslider-group__button active col py-1 " : "eggsslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="eggs1"
                title={"7km"}
                class={props.filter.eggs1 ? "eggsslider-group__button active col py-1 " : "eggsslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"eggs2"}
                title={"5km"}
                class={props.filter.eggs2 ? "eggsslider-group__button active col py-1 " : "eggsslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"eggs3"}
                title={"2km"}
                class={props.filter.eggs3 ? "eggsslider-group__button active col py-1 " : "eggsslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"eggs4"}
                title={"10km (AC)"}
                class={props.filter.eggs4 ? "eggsslider-group__button active col py-1 " : "eggsslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"eggs5"}
                title={"5km (AC)"}
                class={props.filter.eggs5 ? "eggsslider-group__button active col py-1 " : "eggsslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="eggs6"
                title={"12km"}
                class={props.filter.eggs6 ? "eggsslider-group__button active col py-1 " : "eggsslider-group__button col py-1"}
                onClick={props.onFilter}
            />
        </div>
    )

});

export default ButtonsBlock;