import { combineReducers } from 'redux'
import Session from './Session/Session'
import CustomMoves from './CustomMoves/CustomMoves'
import Bases from './Bases/Bases'
import SavedParties from "./SavedParties/SavedParties"

export default combineReducers({
    session: Session,
    customMoves: CustomMoves,
    bases: Bases,
    parties: SavedParties,
})