import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const region = createReducer(
  {
    latitude: 34.0928,
    longitude: -118.3587,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  },
  {
    [types.REGION](state, action) {
      // what to do with the state and action
      return action.region
    },
  },
)
