import React from "react"

import PokedexListRender from "./PokedexListRender/PokedexListRender"

class PokedexListSort extends React.Component {

    sortNumber() {
        switch (this.props.sort.order) {
            case true:
                return this.props.children.sort((a, b) => {
                    return b[1][this.props.sort.field] - a[1][this.props.sort.field]
                })
            default:
                return this.props.children.sort((a, b) => {
                    return a[1][this.props.sort.field] - b[1][this.props.sort.field]
                })
        }
    }

    sortString() {
        switch (this.props.sort.order) {
            case true:
                return this.props.children.sort((a, b) => {
                    if (a[1][this.props.sort.field] > b[1][this.props.sort.field]) { return -1; }
                    if (b[1][this.props.sort.field] > a[1][this.props.sort.field]) { return 1; }
                    return 0;
                })
            default:
                return this.props.children.sort((a, b) => {
                    if (a[1][this.props.sort.field] < b[1][this.props.sort.field]) { return -1; }
                    if (b[1][this.props.sort.field] < a[1][this.props.sort.field]) { return 1; }
                    return 0;
                })
        }
    }


    sortTypeArr() {
        switch (this.props.sort.order) {
            case true:
                return this.props.children.sort((a, b) => {
                    if (b[1][this.props.sort.field][0] === a[1][this.props.sort.field][0]) {
                        if (b[1][this.props.sort.field].length > 1 && a[1][this.props.sort.field].length > 1) { return b[1][this.props.sort.field][1] - a[1][this.props.sort.field][1]; }
                        if (b[1][this.props.sort.field].length > 1) { return 1 }
                        return -1
                    }
                    return b[1][this.props.sort.field][0] - a[1][this.props.sort.field][0];
                })
            default:
                return this.props.children.sort((a, b) => {
                    if (b[1][this.props.sort.field][0] === a[1][this.props.sort.field][0]) {
                        if (b[1][this.props.sort.field].length > 1 && a[1][this.props.sort.field].length > 1) { return a[1][this.props.sort.field][1] - b[1][this.props.sort.field][1]; }
                        if (a[1][this.props.sort.field].length > 1) { return 1 }
                        return -1
                    }
                    return a[1][this.props.sort.field][0] - b[1][this.props.sort.field][0];
                })
        }

    }


    render() {
        return (
            <PokedexListRender
                onClick={this.props.onClick}
                sort={this.props.sort}

                list={this.props.sort.type === "number" ? this.sortNumber() :
                    (this.props.sort.type === "array" ? this.sortTypeArr() : this.sortString())}
                pokTable={this.props.pokTable}
            />
        );
    }
}

export default PokedexListSort