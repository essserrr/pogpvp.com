import React from "react";

import ButtonsBlock from "../../Movedex/ButtonsBlock/ButtonsBlock"

const GenRow = React.memo(function (props) {

    return (
        <ButtonsBlock
            class="row m-0 mb-3 text-center dexButtonGroup justify-content-center"
            onClick={props.onFilter}
            buttons={[{
                attr: "gen1",
                title: "# " + 1,
                class: props.filter.gen1 ? "col py-1 dexRadio active" : "col py-1 dexRadio",
            },
            {
                attr: "gen2",
                title: "# " + 2,
                class: props.filter.gen2 ? "col py-1 dexRadio active" : "col py-1 dexRadio",
            },
            {
                attr: "gen3",
                title: "# " + 3,
                class: props.filter.gen3 ? "col py-1 dexRadio active" : "col py-1 dexRadio",
            },
            {
                attr: "gen4",
                title: "# " + 4,
                class: props.filter.gen4 ? "col py-1 dexRadio active" : "col py-1 dexRadio",
            },
            {
                attr: "gen5",
                title: "# " + 5,
                class: props.filter.gen5 ? "col py-1 dexRadio active" : "col py-1 dexRadio",
            },
            {
                attr: "gen6",
                title: "# " + 6,
                class: props.filter.gen6 ? "col py-1 dexRadio active" : "col py-1 dexRadio",
            },
            {
                attr: "gen7",
                title: "# " + 7,
                class: props.filter.gen7 ? "col py-1 dexRadio active" : "col py-1 dexRadio",
            },
            {
                attr: "gen8",
                title: "# " + 8,
                class: props.filter.gen8 ? "col py-1 dexRadio active" : "col py-1 dexRadio",
            },]}
        />
    )

});

export default GenRow;