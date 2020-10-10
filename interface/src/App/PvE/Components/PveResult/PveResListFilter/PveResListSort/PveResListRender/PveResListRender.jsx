import React from "react"
import LocalizedStrings from "react-localization"

import SubmitButton from "../../../../../../PvP/components/SubmitButton/SubmitButton"
import PrescisionWrapper from "./PveResEntry/PrescisionWrapper"

import { locale } from "../../../../../../../locale/locale"
import { getCookie } from "../../../../../../../js/getCookie"

let strings = new LocalizedStrings(locale);

class PveResListRender extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }


    render() {
        const upperBound = this.props.list.length >= this.props.n * 25 ? this.props.n * 25 : this.props.list.length
        const isNextPage = this.props.list.length > upperBound
        return (
            <>
                {this.props.list.slice(0, upperBound).map((elem, i) =>
                    <PrescisionWrapper
                        key={i}
                        customResult={this.props.customResult}

                        i={i}
                        pokemonRes={elem}
                        snapshot={this.props.snapshot}
                        tables={this.props.tables}

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}
                        pokList={this.props.pokList}
                        chargeMoveList={this.props.chargeMoveList}
                        quickMoveList={this.props.quickMoveList}

                        showBreakpoints={this.props.showBreakpoints}
                    />
                )}

                {isNextPage &&
                    <div className="row mx-0 justify-content-center mt-3">
                        <SubmitButton
                            action="Load more"
                            onSubmit={this.props.loadMore}
                            class="submit-button--lg btn btn-primary btn-sm"
                        >
                            {strings.buttons.loadmore}
                        </SubmitButton>
                    </div>}
            </>
        );
    }
}

export default PveResListRender