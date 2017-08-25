/* eslint-env browser */
import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import MapView from 'react-native-maps'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  View,
  Platform,
  Dimensions,
} from 'react-native'
import _ from 'lodash'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'
import { renderIf } from '../lib/renderIf'

const Permissions = require('react-native-permissions')

let styles = generateStyles()
function generateStyles() {
  const { width } = Dimensions.get('window')
  return StyleSheet.create({
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
    modalWindow: {
      flex: 0.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalHolder: {
      marginTop: 50,
      marginLeft: width / 2,
      flex: 0.2,
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      backgroundColor: 'rgba(180,180,180,0.65)',
    },
    modalWindowHeader: {
      padding: 5,
      width: width / 2,
      backgroundColor: 'rgba(80,80,80, .9)',
    },
    modalWindowText: {
      padding: 5,
    },
    modalText: {
      color: 'black',
      fontWeight: 'bold',
    },
    modalHeader: {
      color: 'white',
    },
  })
}

function template(strings, ...keys) {
  return (...values) => {
    const dict = values[values.length - 1] || {}
    const result = [strings[0]]
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key]
      result.push(value, strings[i + 1])
    })
    return result.join('')
  }
}

let LATITUDE_DELTA = 0.02
let LONGITUDE_DELTA = 0.02

class Map extends Component {
  static propTypes = {
    username: PropTypes.string,
    session: PropTypes.string,
  }
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
    isAndroid: false,
    showModal: false,
  }

  componentWillMount() {
    this.getOS()
    this.canGetLocation()
    this.modalShow()
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
    if (region.latitudeDelta < 10) {
      LATITUDE_DELTA = region.latitudeDelta
      LONGITUDE_DELTA = region.longitudeDelta // from the zoom level at resting
    }
    this.requestLinesThrottled()
    this.setState({ region })
  }


  onPress = (latLng) => {
    console.log('pressed')
    this.watcher = null
    this.setState({ locationManuallyChanged: true })
  }

  onRegionChangeComplete = (region) => {}

  getOS = () => {
    if (Platform.OS === 'android') {
      this.setState({ isAndroid: true })
    }
  }

  modalShow = () => {
    this.setState({ showModal: true })
  }

  modalDismiss = () => {
    this.setState({ showModal: false })
  }

  requestLines = () => {
    if (this.state.session) {
      // temporary fix for huge amounts of data, adding the user=... attribute
      const urlstring = template`https://curbmap.com:50003/areaPolygon?lat1=${0}&lng1=${1}&lat2=${2}&lng2=${3}`
      let urlstringfixed
      if (LONGITUDE_DELTA < 0.012) {
        urlstringfixed = urlstring(
          this.state.region.latitude - LATITUDE_DELTA,
          this.state.region.longitude - LONGITUDE_DELTA,
          this.state.region.latitude + LATITUDE_DELTA,
          this.state.region.longitude + LONGITUDE_DELTA,
        )
      } else {
        urlstringfixed = urlstring(
          this.state.region.latitude - 0.012,
          this.state.region.longitude - 0.012,
          this.state.region.latitude + 0.012,
          this.state.region.longitude + 0.012,
        )
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
  }

  requestLinesThrottled = _.debounce(this.requestLines, 300)

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
  }

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
  }

  canGetLocation = async () => {
    let permission
    if (this.state.locationPermission === undefined) {
      Permissions.check('location').then((response) => {
        this.setState({ locationPermission: response })
        permission = response
      })
    } else if (this.state.locationPermission === 'undetermined') {
      // Open location settings
      Permissions.request('location').then((response) => {
        this.setState({ locationPermission: response })
        permission = response
      })
    }
    return permission
  }

  startFollowing = () => {
    this.setState({ locationManuallyChanged: false })
    navigator.geolocation.getCurrentPosition(
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
        timeout: 5000,
        maximumAge: 0,
      },
    )
    this.watchLocation(true)
  }

  watchLocation = async (force = false) => {
    if (
      !force &&
      (this.state.locationPermission !== 'authorized' ||
        this.state.locationManuallyChanged === true)
    ) {
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
  }

  linePressed = (lineid) => {
    console.log(`Line Pressed:${lineid}`)
  }

  getFollowing = () => (this.state.locationManuallyChanged ? 'disabled' : 'enabled')

  onLayout = () => {
    console.log('onLayout')
    styles = generateStyles()
  }

  render() {
    if (this.watcher === undefined) {
      this.watchLocation()
    }
    return (
      <View
        style={styles.viewwindow}
        onLayout={() => {
          this.onLayout()
        }}
      >
        {this.state.showModal &&
          <View style={styles.modalHolder}>
            <View style={styles.modalWindowHeader}>
              <TouchableOpacity onPress={this.modalDismiss}>
                <Icon name="ios-close-circle" size={30} color="#4F8EF7" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalWindowText}>
              <Text style={styles.modalText}>
                {`Following is ${this.getFollowing()}`}
              </Text>
            </View>
          </View>}
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          onPress={this.onPress}
          followsUserLocation={!this.state.locationManuallyChanged}
          loadingEnabled
          rotateEnabled
          showsUserLocation
        >
          {this.state.polylineList.map(polyline =>
            (<MapView.Polyline
              key={polyline.id}
              coordinates={polyline.coordinates}
              strokeColor={polyline.color}
              strokeWidth={2}
            />),
          )}
        </MapView>
        <ActionButton style={styles.actionButton} buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="rgba(100,200,100,0.5)"
            title="Follow me"
            onPress={() => {
              this.startFollowing()
            }}
          >
            <Icon name="md-navigate" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    )
  }
}

export default Map
