import React from "react";


const PokemonCard = React.memo(function (props) {
    return (
        <div className={"row m-0 p-0  justify-content-center "}>
            <div className={props.class}>
                <div className={props.classHeader}>
                    {props.name}
                </div>
                <div className={"col-12 m-0 p-0 "} >
                    <div className={props.classBodyWrap ? props.classBodyWrap : "row justify-content-center m-0 p-0"}>
                        <div className={props.classIcon}>
                            {props.icon}
                        </div>
                        <div className={props.classBody}>
                            {props.body}
                        </div>
                    </div>
                </div>
                {props.footer && <div className={props.classFooter}>
                    {props.footer}
                </div>}
            </div>
        </div>
    )

});

export default PokemonCard;