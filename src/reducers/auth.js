import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const auth = createReducer(
  {
    username: 'curbmaptest',
    password: '',
    session: 'x',
    loggedIn: Date.now(),
    loginPending: false,
    badge: '1',
    score: 0,
  },
  {
    [types.AUTH](state, action) {
      const newState = JSON.parse(JSON.stringify(state))
      newState.loggedIn = action.auth.loggedIn
      newState.username = action.auth.username
      newState.password = action.auth.password
      newState.session = action.auth.session
      newState.badge = action.auth.badge
      newState.score = parseInt(action.auth.score, 10)
      newState.loginPending = action.auth.loginPending
      return newState
    },
  },
)
