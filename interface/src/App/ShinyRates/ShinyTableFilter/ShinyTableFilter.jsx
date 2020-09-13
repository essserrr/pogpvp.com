import React from "react"

import ShinyTableSort from "./ShinyTableSort/ShinyTableSort"

class ShinyTableFilter extends React.Component {

    render() {
        return (
            <ShinyTableSort
                list={Object.entries(this.props.list).filter(element =>
                    element[0].toLowerCase().indexOf(this.props.value.toLowerCase()) !== -1)}

                filter={this.props.filter}

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

export default ShinyTableFilter



