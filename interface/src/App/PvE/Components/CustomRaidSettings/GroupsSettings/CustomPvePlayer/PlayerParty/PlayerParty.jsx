import React from "react"

import SearchableSelect from "../../../../../../PvP/components/SearchableSelect/SearchableSelect"

class PlayerParty extends React.PureComponent {
    render() {
        return (
            <div className="row m-0 align-itmes-center justify-conten-center text-left">
                <div style={{ textTransform: "capitalize" }} className="col-12 px-0">{`${this.props.title} ${this.props.partyNumber + 1}`}</div>
                <div className="col-12 px-0">
                    <SearchableSelect
                        value={this.props.value}
                        list={this.props.list}

                        attr={{ playerNumber: this.props.playerNumber, partyNumber: this.props.partyNumber }}
                        category={"partySelect"}
                        onChange={this.props.onChange}
                    />
                </div>
            </div>
        )
    }
}


export default PlayerParty