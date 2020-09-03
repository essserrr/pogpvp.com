import { combineReducers } from 'redux'
import Session from './Session/Session'
import CustomMoves from './CustomMoves/CustomMoves'
import CustomPokemon from './CustomPokemon/CustomPokemon'
import Bases from './Bases/Bases'
import SavedParties from "./SavedParties/SavedParties"

export default combineReducers({
    session: Session,
    customMoves: CustomMoves,
    customPokemon: CustomPokemon,
    bases: Bases,
    parties: SavedParties,
})