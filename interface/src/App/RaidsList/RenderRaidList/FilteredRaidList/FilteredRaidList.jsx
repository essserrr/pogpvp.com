import React from "react"

class FilteredRaidList extends React.Component {

    isFiltered(elem) {
        if (!this.props.filter) {
            return true
        }
        if (!this.props.filter.tier1 && !this.props.filter.tier2 && !this.props.filter.tier3 && !this.props.filter.tier4
            && !this.props.filter.tier5 && !this.props.filter.megaRaids) {
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

export default FilteredRaidList






