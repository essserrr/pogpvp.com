import React from "react"

import MovedexListSort from "./MovedexListSort/MovedexListSort"

class MovedexListFilter extends React.Component {

    filterList() {
        return Object.entries(this.props.list).filter(element => {
            return this.applyNameFilter(element[0]) && this.applyColFilter(element[1], this.props.filter)
        })
    }

    applyNameFilter(currName) {
        return currName.toLowerCase().indexOf(this.props.name.toLowerCase()) > -1
    }

    applyColFilter(element, filter) {
        let corresponds = true
        if (filter.showCharge || filter.showQuick) {
            switch (element.MoveCategory) {
                case "Charge Move":
                    corresponds *= filter.showCharge
                    break
                default:
                    corresponds *= filter.showQuick
            }
        }
        if (filter.type0 || filter.type1 || filter.type2 || filter.type3 || filter.type4 || filter.type5 ||
            filter.type6 || filter.type7 || filter.type8 || filter.type9 || filter.type10 || filter.type11 ||
            filter.type12 || filter.type13 || filter.type14 || filter.type15 || filter.type16 || filter.type17) {
            if (!filter["type" + element.MoveType]) {
                corresponds *= false
            }
        }
        return corresponds
    }


    render() {
        return (
            <MovedexListSort
                onClick={this.props.onClick}
                sort={this.props.sort}

                list={this.filterList()}
            />
        );
    }
}

export default MovedexListFilter