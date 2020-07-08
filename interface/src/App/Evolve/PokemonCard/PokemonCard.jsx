import React from "react";


const PokemonCard = React.memo(function (props) {
    return (
        <div className={props.class}>
            <div className={props.classHeader}>
                {props.name}
            </div>
            <div className={props.classBodyWrap ? props.classBodyWrap : "row justify-content-center m-0 p-0 px-1"}>
                {props.icon}
                <div className={props.classBody}>
                    {props.body}
                </div>
            </div>
            {props.footer && <div className={props.classFooter}>
                {props.footer}
            </div>}
        </div>
    )

});

export default PokemonCard;