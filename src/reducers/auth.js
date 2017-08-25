import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

const login = createReducer(
  {
    username: 'curbmaptest',
    password: '',
    session: 'x',
    loggedIn: Date.now(),
  },
  {
    [types.LOGIN](state, action) {
      console.log(action)
    },
  },
)

export default login
