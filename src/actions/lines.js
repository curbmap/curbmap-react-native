/* eslint-env browser */
import * as types from './types'
import { template } from '../lib/template'

const constructColorFromLineRestrs = (lineRestrs) => {
  let color = ''
  lineRestrs.forEach((lineRestr) => {
    switch (lineRestr[0]) {
      case 'red':
        color = '#f00'
        break
      case 'np':
        color = '#f00'
        break
      case 'hyd':
        color = '#f00'
        break
      case 'sweep':
        color = '#c0c'
        break
      case 'ppd':
        color = '#00adcc'
        break
      case 'dis':
        color = '#00f'
        break
      case 'yellow':
        color = '#ff0'
        break
      case 'white':
        color = '#fff'
        break
      default:
        color = '#000'
        break
    }
  })
  return color
}

export function processLines(linesJSON, state) {
  const polylineMap = {}
  linesJSON.forEach((line) => {
    if (line.key in state) {
      // deep copy
      polylineMap[line.key] = state[line.key]
    } else {
      // not already defined, redefine
      const lineObj = { coordinates: [], color: '#000', id: line.key }
      line.coordinates.forEach((point) => {
        lineObj.coordinates.push({ longitude: point[0], latitude: point[1] })
      })
      if (line.restrs.length > 0) {
        lineObj.color = constructColorFromLineRestrs(line.restrs)
      }
      polylineMap[line.key] = lineObj
    }
  })
  return { type: types.LINES, lines: polylineMap }
}

export function getLines(region) {
  return (dispatch, getState) => {
    const urlstring = template`https://curbmap.com:50003/areaPolygon?lat1=${0}&lng1=${1}&lat2=${2}&lng2=${3}`
    const LNG_DELTA_MIN = Math.min(region.longitudeDelta, 0.012)
    const LAT_DELTA_MIN = Math.min(region.latitudeDelta, 0.012)
    const urlstringfixed = urlstring(
      region.latitude - LAT_DELTA_MIN,
      region.longitude - LNG_DELTA_MIN,
      region.latitude + LAT_DELTA_MIN,
      region.longitude + LNG_DELTA_MIN,
    )
    const firstTestRegion = getState().region
    if (
      firstTestRegion.longitude === region.longitude &&
      firstTestRegion.latitude === region.latitude
    ) {
      fetch(urlstringfixed, {
        method: 'get',
        mode: 'cors',
        headers: {
          session: getState().auth.session,
          username: getState().auth.username,
        },
      })
        .then((lines) => {
          const secondTestRegion = getState().region
          if (
            secondTestRegion.longitude === region.longitude &&
            secondTestRegion.latitude === region.latitude
          ) {
            return lines.json()
          }
          throw new Error('Error getting state')
        })
        .then((linesJSON) => {
          dispatch(processLines(linesJSON, getState().lines))
        })
        .catch((e) => {
          console.log(`Line 28 lines.js ERROR:   ${e}`)
        })
    }
  }
}

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  const m = encodeURIComponent(str).match(/%[89ABab]/g)
  return str.length + (m ? m.length : 0)
}
