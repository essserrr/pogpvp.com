import React from "react";
import PropTypes from 'prop-types';

import CpCalc from "./CpCalc";
import { calculateEffStat } from "js/calculateEffStat";
import { checkLvl } from "js/checks/checkLvl";
import { checkIV } from "js/checks/checkIV";
const maxLevel = 40;

class CpBlock extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pokemon: {
                Lvl: `${maxLevel}`,
                Atk: "15",
                Def: "15",
                Sta: "15",

                AtkStage: 0,
                DefStage: 0,
                IsShadow: "false",

                effAtk: calculateEffStat(props.pok.Title, maxLevel, 15, 0, props.pokTable, "Atk", "false"),
                effDef: calculateEffStat(props.pok.Title, maxLevel, 15, 0, props.pokTable, "Def", "false"),
                effSta: calculateEffStat(props.pok.Title, maxLevel, 15, 0, props.pokTable, "Sta"),

            },
        };
        this.onChange = this.onChange.bind(this)
    }


    onIvChange(event, attributes) {
        const { attr } = attributes;

        let eff = calculateEffStat(this.props.pok.Title, this.state[attr].Lvl, event.target.value, this.state[attr][event.target.name + "Stage"], this.props.pokTable, event.target.name, this.state[attr].IsShadow)
        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: checkIV(event.target.value) + "",
                ["eff" + event.target.name]: eff
            },
        });
    }


    onLevelChange(event, attributes) {
        const { attr } = attributes;

        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: checkLvl(event.target.value) + "",
                effAtk: calculateEffStat(this.state[attr].name, event.target.value, this.state[attr].Atk, this.state[attr].AtkStage, this.props.pokTable, "Atk", this.state[attr].IsShadow),
                effDef: calculateEffStat(this.state[attr].name, event.target.value, this.state[attr].Def, this.state[attr].DefStage, this.props.pokTable, "Def", this.state[attr].IsShadow),
                effSta: calculateEffStat(this.state[attr].name, event.target.value, this.state[attr].Sta, 0, this.props.pokTable, "Sta"),
            },
        });
    }

    onChange(event, attributes) {
        //check if it's an iv change
        if (event.target.name === "Sta" || event.target.name === "Def" || event.target.name === "Atk") {
            this.onIvChange(event, attributes)
            return
        }
        //check if it's an level change
        if (event.target.name === "Lvl") {
            this.onLevelChange(event, attributes)
            return
        }
    }


    render() {
        return (
            <CpCalc
                value={this.state.pokemon}
                name={this.props.pok.Title}
                attr="pokemon"
                pokTable={this.props.pokTable}
                onChange={this.onChange}
            />
        );
    }
}

export default CpBlock;

CpBlock.propTypes = {
    pok: PropTypes.object.isRequired,
    pokTable: PropTypes.object.isRequired,
};