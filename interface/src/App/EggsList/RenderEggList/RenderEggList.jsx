import React from "react"

import EggsTier from "./EggsTier/EggsTier"
import EggsIcon from "./EggsIcon/EggsIcon"
import FilteredEggsList from "./FilteredEggList/FilteredEggList"

import "./RenderEggList.scss"

class RenderEggList extends React.Component {

    returnEggsList() {
        let matrix = ["10KM Eggs", "7KM Gift Eggs", "5KM Eggs", "2KM Eggs", "10KM Eggs (50KM)", "5KM Eggs (25KM)",]
        return matrix.map((block, i) => <EggsTier
            key={"eggs" + i}
            class="eggs-list__separator"
            title={<EggsIcon tier={block} />}
            list={this.props.list[block]}
            pokTable={this.props.pokTable}
            showReg={this.props.filter.showReg}
        />);
    }

    render() {
        return (
            <FilteredEggsList
                list={this.returnEggsList()}
                filter={this.props.filter}
            />
        );
    }
}

export default RenderEggList






