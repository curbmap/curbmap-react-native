import { combineReducers } from 'redux'
import * as AuthReducers from './auth'
import * as LinesReducers from './lines'

const reducers = combineReducers(Object.assign({}, AuthReducers, LinesReducers))
export default reducers
