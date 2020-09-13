import React from "react"

import AdvisorRender from "./AdvisorRender/AdvisorRender"

class AdvisorSort extends React.PureComponent {

    sortList() {
        switch (this.props.filter) {
            case "rating":
                return this.props.list.sort((a, b) => {
                    if (a.rate === b.rate) { return a.zeros.length - b.zeros.length }
                    return b.rate - a.rate
                });
            default:
                return this.props.list.sort((a, b) => {
                    if (a.zeros.length === b.zeros.length) { return b.rate - a.rate }
                    return a.zeros.length - b.zeros.length
                });
        }
    }

    render() {
        return (
            <AdvisorRender
                leftPanel={this.props.leftPanel}
                rightPanel={this.props.rightPanel}
                moveTable={this.props.moveTable}
                pokemonTable={this.props.pokemonTable}

                rawResult={this.props.rawResult}
                list={this.sortList()}
            />
        );
    }
};

export default AdvisorSort;
