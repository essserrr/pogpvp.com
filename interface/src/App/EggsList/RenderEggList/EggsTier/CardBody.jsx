import React from "react"
import Iconer from "App/Components/Iconer/Iconer"
import CP from "App/Components/CpAndTypes/CP"


const CardBody = React.memo(function (props) {
    return (
        <>
            <div className="col p-0 pb-0 pb-sm-1">
                {(props.pokTable[props.name].Type[0] !== undefined) && <Iconer
                    className="icon18"
                    size={18}
                    folderName="/type/"
                    fileName={props.pokTable[props.name].Type[0]}
                />}
                {(props.pokTable[props.name].Type[1] !== undefined) && <Iconer
                    className="ml-2 icon18"
                    size={18}
                    folderName="/type/"
                    fileName={props.pokTable[props.name].Type[1]}
                />}
            </div>
            {"CP: "}
            <CP name={props.name} Lvl={15} Atk={10} Def={10} Sta={10} pokemonTable={props.pokTable} />
            {"-"}
            <CP name={props.name} Lvl={15} Atk={15} Def={15} Sta={15} pokemonTable={props.pokTable} />
        </>
    )
});

export default CardBody