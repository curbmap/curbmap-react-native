const isFunction = input => typeof input === 'function'
export default predicate => (elemOrThunk) => {
  if (predicate) {
    if (isFunction(elemOrThunk)) {
      return elemOrThunk()
    }
    return elemOrThunk
  }
  return null
}
