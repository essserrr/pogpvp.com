import React from "react"

class FilteredEggsList extends React.Component {
    isFiltered(elem) {
        if (!this.props.filter) {
            return true
        }
        if (!this.props.filter.eggs0 && !this.props.filter.eggs1 && !this.props.filter.eggs2 && !this.props.filter.eggs3 && !this.props.filter.eggs4 && !this.props.filter.eggs5) {
            return true
        }
        return this.props.filter[elem.key]
    }

    render() {
        return (
            this.props.list.filter(elem => this.isFiltered(elem))
        );
    }
}

export default FilteredEggsList






