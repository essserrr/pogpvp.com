import React from "react"

import SearchableSelect from "../../../../PvP/components/SearchableSelect/SearchableSelect"

import "./PartiesSelect.scss"

class PartiesSelect extends React.PureComponent {

    render() {
        let entries = Object.entries(this.props.list)
        return (
            <>
                <div className="user-party-select__text col-12 px-0">{`${this.props.label} (${entries.length}/${this.props.maxSize})`}</div>
                <SearchableSelect
                    value={this.props.activePartyName}
                    list={entries.map((value) => ({ value: value[0], label: <div style={{ textAlign: "left" }}>{value[0]}</div> }))}
                    attr={this.props.attr}
                    onChange={this.props.onChange}
                />
            </>
        );
    }
}

export default PartiesSelect

