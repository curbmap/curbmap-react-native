/* eslint-env browser */
import * as types from './types'
/**
 * This function serves as both login and logout controling the state related to authentication
 * @param {String} user 
 * @param {String} session 
 * @param {Object} state 
 * @param {Function} callback 
 */

export function loginFinished(result) {
  return {
    type: types.AUTH,
    auth: result,
  }
}

export function logoutFinished(result, state, user = null, session = null) {
  let newState = JSON.parse(JSON.stringify(state.auth)) // In case the user could not be logged out
  if (result.success) {
    newState = {
      username: 'curbmaptest',
      password: 'TestCurbm@p1',
      score: 0,
      badge: '1',
      loginPending: false,
      loggedIn: false,
    }
  }
  return {
    type: types.AUTH,
    auth: newState,
  }
}

export function authenticate(user, session, state, callback) {
  if (user.password !== null) {
    if (!state.loggedIn) {
      return (dispatch, getState) => {
        fetch('https://curbmap.com/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `username=${user.username}&password=${user.password}`,
        })
          .then(responseUser => responseUser.json())
          .then((responseJSON) => {
            const newResponse = responseJSON
            newResponse.success = true
            newResponse.username = user.username
            newResponse.password = user.password
            newResponse.loggedIn = true
            newResponse.loginPending = false
            newResponse.type = types.LOGIN
            if (callback !== null) callback(newResponse)
            dispatch(loginFinished(newResponse))
          })
          .catch((e) => {
            if (callback !== null) {
              const result = {
                success: false,
                username: user.username,
                password: user.password,
                loggedIn: false,
                loginPending: false,
                type: types.AUTH,
                err: e,
              }
              if (callback !== null) callback(result)
              dispatch(loginFinished(result))
            }
          })
      }
    }
    return { type: types.AUTH, state }
  }
  const userToDelete = global.realm.objectForPrimaryKey('user', user.username)
  return (dispatch, getState) => {
    console.log(user.username)
    fetch('https://curbmap.com/logout', {
      method: 'post',
      headers: {
        session,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${user.username}`,
    })
      .then(response => response.json())
      .then((responseJSON) => {
        console.log(responseJSON)
        console.log(userToDelete)
        if (responseJSON.success === true && userToDelete !== undefined && userToDelete !== null) {
          global.realm.write(() => {
            global.realm.delete(userToDelete)
          })
        }
        if (callback !== null) {
          callback(responseJSON)
        }
        dispatch(logoutFinished(responseJSON, state))
      })
      .catch((error) => {
        console.log(error)
        dispatch(logoutFinished({ success: false }, state, user, session))
      })
  }
}
