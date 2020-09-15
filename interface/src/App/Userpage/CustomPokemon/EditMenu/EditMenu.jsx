import React from "react"
import LocalizedStrings from "react-localization"

import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import Errors from "../../../PvP/components/Errors/Errors"
import PokemonPanel from "../../../PvE/Components/Panels/PokemonPanel/PokemonPanel"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);


class EditMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="row justify-content-center">
                <div className="col-12 mb-3 px-0">
                    <PokemonPanel
                        colSize="col-12 my-1"
                        attr={this.props.attr}
                        canBeShadow={true}
                        hasSecondCharge={true}

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}


                        pokList={this.props.pokList}
                        chargeMoveList={this.props.chargeMoveList}
                        quickMoveList={this.props.quickMoveList}

                        value={this.props.editPokemon}

                        onChange={this.props.onChange}
                        onClick={this.props.onMenuClose}
                    />
                </div>
                {Object.values(this.props.editNotOk).reduce((sum, val) => sum + (val === "" ? false : true), false) &&
                    <div className="col-12 mx-2 mb-3 ">
                        <Errors class="alert alert-danger p-2" value={
                            Object.values(this.props.editNotOk).reduce((sum, val, index) => {
                                sum.push(<div key={index} className="col-12 py-1">{val}</div>)
                                return sum
                            }, [])
                        }
                        />
                    </div>}
                <SubmitButton
                    class="submit-button--lg btn btn-primary btn-sm mx-1 my-2"
                    attr={this.props.attr}
                    label={strings.moveconstr.changes}
                    onSubmit={this.props.onPokemonEditSubmit} />
            </div>
        );
    }
}


export default EditMenu