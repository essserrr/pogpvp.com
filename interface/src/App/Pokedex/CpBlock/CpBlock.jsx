import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie, calculateEffStat, checkLvl, checkIV, } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import CpCalc from "./CpCalc"

let strings = new LocalizedStrings(dexLocale);

class CpBlock extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            pokemon: {
                Lvl: "40",
                Atk: "15",
                Def: "15",
                Sta: "15",

                AtkStage: 0,
                DefStage: 0,
                IsShadow: "false",

                effAtk: calculateEffStat(this.props.pok.Title, 40, 15, 0, this.props.pokeTable, "Atk", "false"),
                effDef: calculateEffStat(this.props.pok.Title, 40, 15, 0, this.props.pokeTable, "Def", "false"),
                effSta: calculateEffStat(this.props.pok.Title, 40, 15, 0, this.props.pokeTable, "Sta"),

            },
        };
        this.onChange = this.onChange.bind(this)
    }


    onIvChange(event) {
        var role = event.target.getAttribute('attr')

        var eff = calculateEffStat(this.props.pok.Title, this.state[role].Lvl, event.target.value, this.state[role][event.target.name + "Stage"], this.props.pokeTable, event.target.name, this.state[role].IsShadow)
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkIV(event.target.value) + "",
                ["eff" + event.target.name]: eff
            },
        });
    }


    onLevelChange(event) {
        var role = event.target.getAttribute('attr')

        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkLvl(event.target.value) + "",
                effAtk: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Atk, this.state[role].AtkStage, this.props.pokeTable, "Atk", this.state[role].IsShadow),
                effDef: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Def, this.state[role].DefStage, this.props.pokeTable, "Def", this.state[role].IsShadow),
                effSta: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Sta, 0, this.props.pokeTable, "Sta"),
            },
        });
    }

    onChange(event) {
        //check if it's an iv change
        if (event.target.name === "Sta" || event.target.name === "Def" || event.target.name === "Atk") {
            this.onIvChange(event)
            return
        }
        //check if it's an level change
        if (event.target.name === "Lvl") {
            this.onLevelChange(event)
            return
        }
    }


    render() {
        return (
            <CpCalc
                value={this.state.pokemon}
                pok={this.props.pok}
                attr="pokemon"
                pokeTable={this.props.pokeTable}
                onChange={this.onChange}
            />
        );
    }
}

export default CpBlock;