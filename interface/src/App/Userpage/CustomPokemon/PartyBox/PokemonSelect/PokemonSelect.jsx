import React from "react"

import SearchableSelect from "../../../../PvP/components/SearchableSelect/SearchableSelect"

import "./PokemonSelect.scss"

class PokemonSelect extends React.PureComponent {

    makePokList(list) {
        return list.map((value, index) =>
            ({
                value: index,

                label: <div style={{ textAlign: "left" }}>{`${value.Name} / ${value.CP} / ${value.IsShadow === "true" ? "shadow" : "normal"} / 
                ${value.QuickMove} / ${value.ChargeMove} / ${value.ChargeMove2} / 
                ${value.Lvl}: ${value.Atk} / ${value.Def} / ${value.Sta}`}</div>
            })
        )
    }


    render() {
        return (
            <>
                <div className="user-pokemon-select__text col-12 px-0">{this.props.label}</div>
                <SearchableSelect
                    list={this.makePokList(this.props.list)}
                    attr={this.props.attr}
                    onChange={this.props.onChange}
                />
            </>
        );
    }
}

export default PokemonSelect

