import React, { AsyncStorage } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import Main from './containers/Main'
import login from './actions/auth'

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
let store = configureStore({
  default: {
    username: 'curbmaptest',
    password: 'TestCurbm@p1',
    session: 'x',
    loggedIn: false,
  },
})

const loginCompleted = (results) => {
  if (results.success === false) {
    const userToDelete = realm.objectForPrimaryKey('user', results.username)
    realm.write(() => {
      realm.delete(userToDelete)
    })
  } else {
    store = configureStore({
      default: {
        username: results.username,
        password: results.password,
        session: results.session,
        loggedIn: results.loggedIn,
      },
    })
    if (results.loggedIn) {
      const userToUpdate = realm.objectForPrimaryKey('user', results.username)
      realm.write(() => {
        userToUpdate.loggedIn = new Date()
        userToUpdate.session = results.session
      })
    }
  }
}

const getUser = () => {
  const userObjects = realm.objects('user')
  if (userObjects.length > 0) {
    if (Math.abs(new Date() - userObjects[0].loggedIn) / 36e4 < 3.0) {
      loginCompleted({
        success: true,
        username: userObjects[0].username,
        password: userObjects[0].password,
        session: userObjects[0].session,
        loggedIn: true,
      })
    }
    // old login -- try logging in now
    const result = login(userObjects[0].username, userObjects[0].password, loginCompleted)
  }
}

getUser()

const App = () =>
  (<Provider store={store}>
    <Main />
  </Provider>)

export default App
