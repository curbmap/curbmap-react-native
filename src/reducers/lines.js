import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const lines = createReducer(
  {},
  {
    [types.LINES](state, action) {
      // what to do with the state and action
      return action.lines
    },
  },
)
