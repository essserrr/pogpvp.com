import React from "react";

const PokemonIconer = React.memo(function (props) {
    //if we are looking for a pokemon icon
    let iconList = [
        "/images/low/",
    ]
    let i = 0

    function addDefaultSrc(ev) {
        switch (!props.folder) {
            case true:
                if (i < iconList.length) {
                    ev.target.src = iconList[i] + props.src + ".png"
                    i++
                } else {
                    ev.target.src = "/images/missingno.png"
                }
                break
            default:
                ev.target.src = "/images/missingno.png"
                break
        }
    }

    return (
        navigator.userAgent !== "ReactSnap" && <img
            src={"/images" + (props.folder ? props.folder : "/pokemons/") + props.src + ".png"}
            onError={addDefaultSrc}
            className={props.class}
            alt=""
            data-tip data-for={props.for} />
    )
});

export default PokemonIconer