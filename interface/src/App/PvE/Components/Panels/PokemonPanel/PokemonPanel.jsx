import React from "react";

import PvePokemon from "../../PvePokemon";

const PokemonPanel = React.memo(function PokemonPanel(props) {
    const { title, ...other } = props;

    return (
        <div className="row mx-0 justify-content-center align-items-center">
            {title && <div className="col-12 px-0 text-center my-1"><h5 className="fBolder m-0 p-0">{title}</h5></div>}
            <div className="col-12 px-0">
                <PvePokemon
                    {...other}
                />
            </div>

        </div>
    )
});

export default PokemonPanel