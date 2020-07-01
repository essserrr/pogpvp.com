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
                switch (props.folder === "/art/") {
                    case true:
                        if (i === 0) {
                            let withoutForme = props.src.split("-")
                            ev.target.src = "/images" + props.folder + withoutForme[0] + ".jpg"
                        }
                        if (i === 1) {
                            ev.target.src = iconList[0] + props.src + ".png"
                        }
                        if (i === 2) {
                            ev.target.src = "/images/missingno.png"
                        }
                        i++
                        break
                    default:
                        ev.target.src = "/images/missingno.png"
                        break
                }
        }
    }

    return (
        navigator.userAgent !== "ReactSnap" && <img
            src={"/images" + (props.folder ? props.folder : "/pokemons/") +
                props.src + (props.folder === "/art/" ? ".jpg" : ".png")}
            onError={addDefaultSrc}
            className={props.class}
            alt=""
            data-tip data-for={props.for} />
    )
});

export default PokemonIconer