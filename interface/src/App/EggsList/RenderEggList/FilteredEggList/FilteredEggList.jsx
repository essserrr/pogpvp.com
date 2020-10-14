import React from "react"

class FilteredEggsList extends React.Component {
    isFiltered(elem) {
        if (!this.props.filter) {
            return true
        }
        let filterProduct = Object.entries(this.props.filter).reduce((sum, value) => { return value[0].includes("eggs") ? sum * !value[1] : sum }, true)
        if (filterProduct) { return true }
        return this.props.filter[elem.key]
    }

    render() {
        return (
            this.props.list.filter(elem => this.isFiltered(elem))
        );
    }
}

export default FilteredEggsList






