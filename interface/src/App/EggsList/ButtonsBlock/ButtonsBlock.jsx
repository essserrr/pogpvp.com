import React from "react";
import LocalizedStrings from "react-localization";


import Button from "../../Movedex/MoveCard/DoubleSlider/Button/Button"
import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/getCookie"

let strings = new LocalizedStrings(locale);


const ButtonsBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (

        <div className={"row m-0 mb-3 text-center sliderGroup justify-content-center"} >
            <Button
                attr="eggs0"
                title={"10 km"}
                class={props.filter.eggs0 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
            <Button
                attr="eggs1"
                title={"7 km"}
                class={props.filter.eggs1 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
            <Button
                attr={"eggs2"}
                title={"5 km"}
                class={props.filter.eggs2 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
            <Button
                attr={"eggs3"}
                title={"2 km"}
                class={props.filter.eggs3 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
            <Button
                attr={"eggs4"}
                title={"10 km (50 km)"}
                class={props.filter.eggs4 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
            <Button
                attr={"eggs5"}
                title={"5 km (25 km)"}
                class={props.filter.eggs5 ? "col py-1 sliderButton active" : "col py-1 sliderButton"}
                onClick={props.onFilter}
            />
        </div>
    )

});

export default ButtonsBlock;