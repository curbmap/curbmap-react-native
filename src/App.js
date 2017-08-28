import React, { AsyncStorage } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import Main from './containers/Main'

const Realm = require('realm')

const UserSchema = {
  name: 'user',
  primaryKey: 'username',
  properties: {
    username: { type: 'string', optional: false },
    password: { type: 'string', optional: false },
    session: { type: 'string', optional: false },
    loggedIn: { type: 'date', optional: false },
  },
}

/*
  Set up to use realm synchronously with the user schema. Maybe with other things later
*/
const realm = new Realm({ schema: [UserSchema] })
global.realm = realm

const logger = createLogger({ predicate: (getState, action) => __DEV__ })

function configureStore(initialState) {
  const enhancer = compose(applyMiddleware(thunkMiddleware, logger))
  return createStore(reducer, initialState, enhancer)
}
const store = configureStore({
  auth: {
    username: 'curbmaptest',
    password: 'TestCurbm@p1',
    session: 'x',
    loggedIn: false,
    loginPending: false,
    badge: '1',
    score: 0,
  },
})

const App = () =>
  (<Provider store={store}>
    <Main />
  </Provider>)

export default App
