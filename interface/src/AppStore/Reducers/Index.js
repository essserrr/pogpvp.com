import { combineReducers } from 'redux'
import Session from './Session'
import CustomMoves from './CustomMoves'
import Bases from './Bases'

export default combineReducers({
    session: Session,
    customMoves: CustomMoves,
    bases: Bases,
})