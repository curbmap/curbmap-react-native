export {
  name: 'user',
  properties: {
    username: { type: 'string', optional: false },
    password: { type: 'string', optional: false },
    session: { type: 'string', optional: false },
    loggedIn: { type: 'date', optional: false },
  },
}
