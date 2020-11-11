import React from "react"

import CP from "App/Components/CpAndTypes/CP"
import Stats from "App/PvP/components/Stats/Stats"

import "./CpCalc.scss"

const CpCalc = React.memo(function (props) {
    return (
        <>
            <Stats
                Lvl={props.value.Lvl}
                Atk={props.value.Atk}
                Def={props.value.Def}
                Sta={props.value.Sta}
                attr={props.attr}
                onChange={props.onChange}
            />
            <div className="col-12  text-center">
                <CP
                    class="cp-calc d-inline mr-2"
                    name={props.pok.Title}
                    isBoss={false}

                    Lvl={props.value.Lvl}
                    Atk={props.value.Atk}
                    Def={props.value.Def}
                    Sta={props.value.Sta}
                    pokemonTable={props.pokTable}
                />
            </div>
        </>
    )
});

export default CpCalc;