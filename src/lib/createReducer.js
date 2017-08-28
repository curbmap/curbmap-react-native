/* 
https://medium.com/@jonlebensold/getting-started-with-react-native-redux-2b01408c0053
*/
export default function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      // because we're returning this object's value it doesn't like that we're testing it here
      return handlers[action.type](state, action)
    }
    return state
  }
}
