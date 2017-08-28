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

export function getLines(lat, lng, LONGITUDE_DELTA, LATITUDE_DELTA, auth, state) {
  return (dispatch, getState) => {
    const urlstring = template`https://curbmap.com:50003/areaPolygon?lat1=${0}&lng1=${1}&lat2=${2}&lng2=${3}`
    const LNG_DELTA_MIN = Math.min(LONGITUDE_DELTA, 0.012)
    const LAT_DELTA_MIN = Math.min(LATITUDE_DELTA, 0.012)
    const urlstringfixed = urlstring(
      lat - LAT_DELTA_MIN,
      lng - LNG_DELTA_MIN,
      lat + LAT_DELTA_MIN,
      lng + LNG_DELTA_MIN,
    )
    fetch(urlstringfixed, {
      method: 'get',
      mode: 'cors',
      headers: {
        session: auth.session,
        username: auth.username,
      },
    })
      .then(lines => lines.json())
      .then((linesJSON) => {
        dispatch(processLines(linesJSON, state))
      })
      .catch((e) => {
        console.log(`Line 28 lines.js ERROR:   ${e}`)
      })
  }
}
