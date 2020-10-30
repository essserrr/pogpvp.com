import React from "react";
import Iconer from "App/Components/Iconer/Iconer"
import CP from "App/Components/CpAndTypes/CP"

const CardBody = React.memo(function (props) {
    return (
        <>
            <div className="col-12 text-center p-0">
                {(props.pokemonTable[props.name].Type[0] !== undefined) &&
                    <Iconer
                        className="icon18"
                        size={18}
                        folderName="/type/"
                        fileName={props.pokemonTable[props.name].Type[0]}
                    />}
                {(props.pokemonTable[props.name].Type[1] !== undefined) &&
                    <Iconer
                        className="ml-2 icon18"
                        size={18}
                        folderName="/type/"
                        fileName={props.pokemonTable[props.name].Type[1]}
                    />}
            </div>
            <CP
                class="col-12 p-0 mt-1 text-center"
                name={props.name}
                Lvl={props.state.Lvl}
                Atk={props.state.Atk}
                Def={props.state.Def}
                Sta={props.state.Sta}
                pokemonTable={props.pokemonTable}
            />
        </>
    )
});

export default CardBody