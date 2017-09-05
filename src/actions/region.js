import * as types from './types'

export function region(region) {
  return {
    type: types.REGION,
    region,
  }
}
