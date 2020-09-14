import React from "react"

import ShinyTable from "../../ShinyTable/ShinyTable"

class ShinyTableSort extends React.Component {

    sortNumber() {
        switch (this.props.filter.order) {
            case true:
                return this.props.list.sort((a, b) => { return a[1][this.props.filter.field] - b[1][this.props.filter.field] })
            default:
                return this.props.list.sort((a, b) => { return b[1][this.props.filter.field] - a[1][this.props.filter.field] })
        }
    }

    sortString() {
        switch (this.props.filter.order) {
            case true:
                return this.props.list.sort((a, b) => {
                    if (a[1][this.props.filter.field] < b[1][this.props.filter.field]) { return -1; }
                    if (b[1][this.props.filter.field] < a[1][this.props.filter.field]) { return 1; }
                    return 0;
                })
            default:
                return this.props.list.sort((a, b) => {
                    if (a[1][this.props.filter.field] > b[1][this.props.filter.field]) { return -1; }
                    if (b[1][this.props.filter.field] > a[1][this.props.filter.field]) { return 1; }
                    return 0;
                })
        }
    }

    render() {
        return (
            <ShinyTable
                list={this.props.filter.type === "number" ? this.sortNumber() : this.sortString()}

                onClick={this.props.onClick}
                onChange={this.props.onChange}
                firstColumn={this.props.firstColumn}
                secondColumn={this.props.secondColumn}
                thirdColumn={this.props.thirdColumn}
                fourthColumn={this.props.fourthColumn}

                pokTable={this.props.pokTable}
            />
        );
    }
}

export default ShinyTableSort



