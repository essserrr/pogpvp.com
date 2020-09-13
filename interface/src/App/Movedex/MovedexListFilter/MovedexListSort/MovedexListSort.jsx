import React from "react"

import MovedexListRender from "./MovedexListRender/MovedexListRender"

class MovedexListSort extends React.Component {

    sortNumber() {
        switch (this.props.sort.order) {
            case true:
                return this.props.list.sort((a, b) => {
                    return b[1][this.props.sort.field] - a[1][this.props.sort.field]
                })
            default:
                return this.props.list.sort((a, b) => {
                    return a[1][this.props.sort.field] - b[1][this.props.sort.field]
                })
        }
    }

    sortString() {
        switch (this.props.sort.order) {
            case true:
                return this.props.list.sort((a, b) => {
                    if (a[1][this.props.sort.field] > b[1][this.props.sort.field]) { return -1; }
                    if (b[1][this.props.sort.field] > a[1][this.props.sort.field]) { return 1; }
                    return 0;
                })
            default:
                return this.props.list.sort((a, b) => {
                    if (a[1][this.props.sort.field] < b[1][this.props.sort.field]) { return -1; }
                    if (b[1][this.props.sort.field] < a[1][this.props.sort.field]) { return 1; }
                    return 0;
                })
        }
    }


    render() {
        return (
            <MovedexListRender
                onClick={this.props.onClick}
                sort={this.props.sort}

                list={this.props.sort.type === "number" ? this.sortNumber() : this.sortString()}
            />
        );
    }
}

export default MovedexListSort