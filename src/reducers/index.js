import { combineReducers } from 'redux'
import * as AuthReducers from './auth'

export default combineReducers(Object.assign({}, AuthReducers))
