/* eslint-env browser */
import * as types from './types'

export default function login(username, password, callback) {
  fetch('https://curbmap.com/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `username=${username}&password=${password}`,
  })
    .then(responseUser => responseUser.json())
    .then((responseJSON) => {
      const newResponse = responseJSON
      newResponse.success = true
      newResponse.username = username
      newResponse.password = password
      newResponse.loggedIn = true
      newResponse.type = types.LOGIN
      if (callback !== null) callback(newResponse)
    })
    .catch((e) => {
      if (callback !== null) {
        callback({
          success: false,
          username,
          password,
          loggedIn: false,
          type: types.LOGIN,
          err: e,
        })
      }
    })
}
