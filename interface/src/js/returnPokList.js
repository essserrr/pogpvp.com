import React from "react";
import Iconer from "App/Components/Iconer/Iconer";

export function returnPokList(pokBase, addNone, locale) {
    let pokList = [];
    if (addNone) {
        pokList.push({ value: "", title: locale, });
    }
    //create pokemons list
    for (const [key, value] of Object.entries(pokBase)) {
        pokList.push({
            value: key,
            title: <>
                <Iconer
                    folderName="/pokemons/"
                    fileName={`${value.Number}${value.Forme !== "" ? `-${value.Forme}` : ""}`}
                    class={"icon24 mr-1"}
                />{key}
            </>,
        });
    }
    return pokList;
}