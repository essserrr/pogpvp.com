import React from "react"

import AdvisorPanel from "./AdvisorPanel/AdvisorPanel"

class AdvisorRender extends React.PureComponent {
    render() {
        return (
            this.props.list.map((elem, i) =>
                <div key={i} className={"col-12 p-0 m-0 mb-1"} rate={elem.rate} zeros={elem.zeros.length}>
                    <AdvisorPanel
                        first={this.props.leftPanel.listForBattle[elem.first]}
                        second={this.props.leftPanel.listForBattle[elem.second]}
                        third={this.props.leftPanel.listForBattle[elem.third]}
                        i={i}

                        list={this.props.list}
                        rawResult={this.props.rawResult}

                        leftPanel={this.props.leftPanel}
                        rightPanel={this.props.rightPanel}
                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}
                    />
                </div>
            )
        );
    }
};

export default AdvisorRender;
