import React from "react";
import LocalizedStrings from 'react-localization';

import Type from "../../PvP/components/CpAndTypes/Type"
import { getCookie, typeDecoder, culculateCP } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"

let strings = new LocalizedStrings(dexLocale);

const IconBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="row m-0 p-0">
            <PokemonIconer
                src={props.value.Number + (props.value.Forme !== "" ? "-" + props.value.Forme : "")}
                class={"dexCardIcon mr-3"}
                folder={"/art/"}
            />
            <div className="col d-inline m-0 p-0 ">
                <div className={"fBolder dexCardText typefont color" + props.value.Type[0]}># {props.value.Number}</div>
                <span className={"fBolder dexCardText typefont color" + props.value.Type[0]}>{props.value.Title}</span>
                <div className="col-12 d-flex m-0 p-0  mt-2">
                    <span className="dexFont align-self-center">{strings.mt.tp + ":"}</span>
                    <Type
                        abbrStyle="initialism align-self-center"
                        class={"ml-2  mr-1 icon24"}
                        code={props.value.Type[0]}
                        value={typeDecoder[props.value.Type[0]]} />
                    {props.value.Type.length > 1 && <Type
                        abbrStyle="initialism align-self-center"
                        class={"ml-2  mr-1 icon24"}
                        code={props.value.Type[1]}
                        value={typeDecoder[props.value.Type[1]]} />}
                </div>
                <div className="col-12 m-0 p-0 mt-2">
                    <span className="dexFont">{"Max CP: "}</span>
                    <span className="dexFont font-weight-bold">
                        {culculateCP(props.value.Title, 40, 15, 15, 15, props.pokeTable)}</span>
                </div>
                <div className="col-12 m-0 p-0 mt-2">
                    <span className="dexFont">{strings.generation} {props.value.Generation}</span>
                </div>
            </div>
        </div>
    )

});

export default IconBlock;