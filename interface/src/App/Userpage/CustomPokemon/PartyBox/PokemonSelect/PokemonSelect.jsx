import React from "react"

import SearchableSelect from "../../../../PvP/components/SearchableSelect/SearchableSelect"
import { calculateCP } from "../../../../../js/indexFunctions"


class PokemonSelect extends React.PureComponent {

    makePokList(list) {
        return list.map((value, index) => {
            let val = `${value.Name} / CP${calculateCP(value.Name, value.Lvl, value.Atk, value.Def, value.Sta, this.props.pokemonTable)}
             / ${value.IsShadow === "true" ? "shadow" : "normal"} / ${value.QuickMove} / ${value.ChargeMove} / ${value.ChargeMove2} /
             Lvl${value.Lvl}: Atk${value.Atk} / Def${value.Def} / Sta${value.Sta}`

            return { value: val, index: index, label: <div style={{ textAlign: "left" }}>{val}</div> }
        })
    }


    render() {
        return (
            <>
                <SearchableSelect
                    label={this.props.label}
                    attr={this.props.attr}
                    category={this.props.category}

                    list={this.makePokList(this.props.list)}

                    onChange={this.props.onChange}
                />
            </>
        );
    }
}

export default PokemonSelect

