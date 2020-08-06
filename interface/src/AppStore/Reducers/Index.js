import { combineReducers } from 'redux'
import Session from './Session'
import CustomMoves from './CustomMoves'

export default combineReducers({
    session: Session,
    customMoves: CustomMoves,
})