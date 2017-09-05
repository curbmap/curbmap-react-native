import { combineReducers } from 'redux'
import * as AuthReducers from './auth'
import * as LinesReducers from './lines'
import * as RegionReducers from './region'

const reducers = combineReducers(Object.assign({}, AuthReducers, LinesReducers, RegionReducers))
export default reducers
