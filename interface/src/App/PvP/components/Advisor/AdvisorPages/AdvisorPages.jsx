import React from "react"
import AdvisorSort from "./AdvisorSort/AdvisorSort"

class AdvisorPages extends React.PureComponent {
    render() {
        const upperBound = this.props.list.length >= this.props.n * 50 ? this.props.n * 50 : this.props.list.length
        return (
            <AdvisorSort
                leftPanel={this.props.leftPanel}
                rightPanel={this.props.rightPanel}
                moveTable={this.props.moveTable}
                pokemonTable={this.props.pokemonTable}

                rawResult={this.props.rawResult}
                filter={this.props.filter}
                list={this.props.list.slice(0, upperBound)}
            />
        );
    }
};

export default AdvisorPages;
