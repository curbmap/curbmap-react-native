/* eslint-env browser */
import React, { Component } from 'react'
import MapView from 'react-native-maps'
import { StyleSheet, AsyncStorage, View } from 'react-native'
import { isSignedIn } from './auth'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

const Permissions = require('react-native-permissions')

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  viewwindow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  actionButton: {
    zIndex: 10,
    bottom: 10,
    right: 10,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})

function template(strings, ...keys) {
  return ((...values) => {
    const dict = values[values.length - 1] || {}
    const result = [strings[0]]
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key]
      result.push(value, strings[i + 1])
    })
    return result.join('')
  })
}


let LATITUDE_DELTA = 0.02
let LONGITUDE_DELTA = 0.02

class Map extends Component {
  state = {
    region: {
      latitude: 34.0928,
      longitude: -118.3587,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    polylineList: [],
    username: 'curbmaptest',
    session: '',
    checkedSignIn: false,
    locationManuallyChanged: false,
  }

  componentWillMount() {
    this.canGetLocation()
    if (this.props.session) {
      this.setState({
        username: this.props.username,
        session: this.props.session,
      })
    } else if (!this.state.checkedSignIn) {
      isSignedIn().then((resultTest) => {
        this.setState((prevState) => {
          const newState = prevState
          newState.checkedSignIn = true
          return newState
        })
        if (resultTest) {
          AsyncStorage.multiGet(['USERNAME', 'SESSION'])
            .then((stores) => {
              stores.map((result, i, store) => {
                switch (store[i][0]) {
                  case 'USERNAME':
                    this.setState({ username: store[i][1] })
                    break
                  case 'SESSION':
                    this.setState({ session: store[i][1] })
                    break
                  default:
                    break
                }
                return null
              })
            })
            .catch((err) => {
              console.log(`ERROR:${err}`)
            })
        } else {
          // on signout and redirect here, the user should become curbmap
          this.setState({
            username: 'curbmaptest',
            session: 'x',
          })
        }
      })
    }
  }

  componentWillUnmount() {
    if (this.watcher) {
      this.watcher = null
    }
  }

  onRegionChange = (region) => {
    this.setState({ region })
  };

  onRegionChangeComplete = (region) => {
    this.setState({ moved: true })
    setTimeout(() => { this.setState({ moved: false }) }, 1000)
    if (region.latitudeDelta < 10) {
      LATITUDE_DELTA = region.latitudeDelta
      LONGITUDE_DELTA = region.longitudeDelta // from the zoom level at resting
    }

    if (this.state.session) {
      // temporary fix for huge amounts of data, adding the user=... attribute
      const urlstring = template`https://curbmap.com:50003/areaPolygon?lat1=${0}&lng1=${1}&lat2=${2}&lng2=${3}`
      let urlstringfixed
      if (LONGITUDE_DELTA < 0.012) {
        urlstringfixed = urlstring((this.state.region.latitude - LATITUDE_DELTA),
          (this.state.region.longitude - LONGITUDE_DELTA),
          (this.state.region.latitude + LATITUDE_DELTA),
          (this.state.region.longitude + LONGITUDE_DELTA))
      } else {
        urlstringfixed = urlstring((this.state.region.latitude - 0.012),
          (this.state.region.longitude - 0.012),
          (this.state.region.latitude + 0.012),
          (this.state.region.longitude + 0.012))
      }
      console.log(`fetching with u: ${this.state.username} session: ${this.state.session}`)
      this.state.time_start = new Date().getTime()
      fetch(urlstringfixed, {
        method: 'get',
        mode: 'cors',
        headers: {
          session: this.state.session,
          username: this.state.username,
        },
      })
        .then(lines => lines.json())
        .then(this.processLines)
        .catch((e) => {
          console.log(`Line 153 ERROR:   ${e}`)
        })
    }
  };

  canGetLocation = async () => {
    let permission = undefined
    if (this.state.locationPermission === undefined) {
      Permissions.check('location').then((response) => {
        this.setState({ locationPermission: response })
        permission = response
      })
    } else if (this.state.locationPermission === 'undetermined') {
      // Open location settings
      Permissions.request('location')
        .then((response) => {
          this.setState({ locationPermission: response })
          permission = response
        })
    }
    return permission
  }

  processLines = async (linesJSON) => {
    const start = new Date().getTime()
    console.log(`Time received fetch: ${start - this.state.time_start}`)
    console.log(`Got json lines:${linesJSON.length}`)
    console.log(linesJSON[0])
    this.state.polylineList = []
    this.setState({})
    linesJSON.forEach((line) => {
      const lineObj = { coordinates: [], color: '#000', id: line.key }
      line.coordinates.forEach((point) => {
        const LatLng = { longitude: point[0], latitude: point[1] }
        lineObj.coordinates.push(LatLng)
      })
      if (line.restrs.length > 0) {
        lineObj.color = this.constructColorFromLineRestrs(line.restrs)
      }
      this.state.polylineList.push(lineObj)
    })

    this.setState({})
    // CONSOLE OUTPUT:
    console.log(`time taken: ${new Date().getTime() - start}`)
  };

  constructColorFromLineRestrs = (lineRestrs) => {
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
  };

  onRegionManuallyChanged = (position) => {
    this.watcher = null
    this.setState({locationManuallyChanged: true})
  }

  startFollowing = () => {
    this.setState({locationManuallyChanged: false})
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.setState({
          region: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          },
        })
      },
      () => {
        this.setState({
          errorMessage: 'Could not get position',
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    this.watchLocation(true)
  }

  watchLocation = async (force = false) => {
    if ((!force) && (this.state.locationPermission !== 'authorized' || this.state.locationManuallyChanged === true)) {
      return
    }

    this.watcher = await navigator.geolocation.watchPosition(
      ({ coords }) => {
        this.setState({
          region: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
        })
      },
      () => {
        this.setState({
          errorMessage: 'Could not get position',
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 500,
        distanceFilter: 10,
      },
    )
  };

  linePressed = (lineid) => {
    console.log(`Line Pressed:${lineid}`)
  }


  render() {
    if (this.watcher === undefined) {
      this.watchLocation()
    }
    return (
      <View style={styles.viewwindow}>
      <MapView
      style={styles.map}
      region={this.state.region}
      onRegionChange={this.onRegionChange}
      onRegionChangeComplete={this.onRegionChangeComplete}
      onPanDrag={this.onRegionManuallyChanged}
      loadingEnabled
      showsUserLocation
      >
      { this.state.polylineList.map(
        polyline =>
        (<MapView.Polyline
          key={polyline.id}
          coordinates={polyline.coordinates}
          strokeColor={polyline.color}
          strokeWidth={2}
          />),
      )
      }
      </MapView>
      <ActionButton style={styles.actionButton} buttonColor="rgba(231,76,60,1)">
      <ActionButton.Item buttonColor="rgba(100,200,100,0.5)" title="Follow me" onPress={() => {this.startFollowing()}}>
      <Icon name="md-navigate" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      </ActionButton>
      </View>
    )
  }
}

export default Map
