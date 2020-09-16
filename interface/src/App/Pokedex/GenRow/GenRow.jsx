import React from "react"

import Button from "../../Movedex/MoveCard/DoubleSlider/Button/Button"

import "./GenRow.scss"

const GenRow = React.memo(function (props) {

    return (
        <div className={"genslider-group row m-0 mb-3 text-center justify-content-center"} >
            <Button
                attr="gen1"
                title={"# " + 1}
                class={props.filter.gen1 ? "genslider-group__button active col py-1" : "genslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="gen2"
                title={"# " + 2}
                class={props.filter.gen2 ? "genslider-group__button active col py-1" : "genslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"gen3"}
                title={"# " + 3}
                class={props.filter.gen3 ? "genslider-group__button active col py-1" : "genslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"gen4"}
                title={"# " + 4}
                class={props.filter.gen4 ? "genslider-group__button active col py-1" : "genslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"gen5"}
                title={"# " + 5}
                class={props.filter.gen5 ? "genslider-group__button active col py-1" : "genslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"gen6"}
                title={"# " + 6}
                class={props.filter.gen6 ? "genslider-group__button active col py-1" : "genslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"gen7"}
                title={"# " + 7}
                class={props.filter.gen7 ? "genslider-group__button active col py-1" : "genslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="gen8"
                title={"# " + 8}
                class={props.filter.gen8 ? "genslider-group__button active col py-1" : "genslider-group__button col py-1"}
                onClick={props.onFilter}
            />
        </div>
    )

});

export default GenRow;