import React from "react"
import Iconer from "App/Components/Iconer/Iconer"
import { calculateCP, weatherDecoder } from "js/indexFunctions"

const CardBody = React.memo(function (props) {
    return (
        <>
            <div className="col-12 p-0">
                {(props.pokTable[props.name].Type[0] !== undefined) &&
                    <Iconer
                        className={"icon18"}
                        size={18}
                        folderName="/type/"
                        fileName={props.pokTable[props.name].Type[0]}
                    />}
                {(props.pokTable[props.name].Type[1] !== undefined) &&
                    <Iconer
                        className={"ml-2 icon18"}
                        size={18}
                        folderName="/type/"
                        fileName={props.pokTable[props.name].Type[1]}
                    />}
            </div>
            {"CP: " + calculateCP(props.name, 20, 10, 10, 10, props.pokTable) + "-" + calculateCP(props.name, 20, 15, 15, 15, props.pokTable)}
            <div className="col-12 p-0">
                {(props.pokTable[props.name].Type[0] !== undefined) &&
                    <Iconer
                        folderName="/weather/"
                        fileName={weatherDecoder[props.pokTable[props.name].Type[0]]}
                        size={18}
                        className={"icon18"} />}
                {(props.pokTable[props.name].Type[1] !== undefined) && weatherDecoder[props.pokTable[props.name].Type[1]] !== weatherDecoder[props.pokTable[props.name].Type[0]] &&
                    <Iconer
                        folderName="/weather/"
                        fileName={weatherDecoder[props.pokTable[props.name].Type[1]]}
                        size={18}
                        className={"icon18"}
                    />}
                {": " + calculateCP(props.name, 25, 10, 10, 10, props.pokTable) + "-" + calculateCP(props.name, 25, 15, 15, 15, props.pokTable)}
            </div>
        </>
    )
});
export default CardBody;