/* eslint-env browser */
import React, { Component } from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { Text, TouchableOpacity, StyleSheet, View, Platform, Dimensions } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import _ from 'lodash'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'
import * as ActionCreators from '../actions'

const Permissions = require('react-native-permissions')

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

let styles = generateStyles()
let LATITUDE_DELTA = 0.02
let LONGITUDE_DELTA = 0.02

class Map extends Component {
  state = {
    locationManuallyChanged: false,
    isAndroid: false,
    showModal: false,
    processing: false,
  }

  componentWillMount() {
    this.getOS()
    this.canGetLocation()
    this.modalShow()
  }

  componentWillUnmount() {
    if (this.watcher) {
      this.watcher = null
    }
  }

  onRegionChange = (region) => {
    if (region.latitudeDelta < 10) {
      LATITUDE_DELTA = region.latitudeDelta / 2
      LONGITUDE_DELTA = region.longitudeDelta / 2 // from the zoom level at resting
    }
    const action = ActionCreators.ActionCreators.region(region)
    this.props.dispatch(action)
  }
  onRegionChangeComplete = () => {
    this.requestLines()
  }

  onPress = (latLng) => {
    this.watcher = null
    this.setState({ locationManuallyChanged: true })
  }

  onLayout = () => {
    styles = generateStyles()
  }

  getProcessing() {
    return this.state.processing
  }

  getOS = () => {
    if (Platform.OS === 'android') {
      this.setState({ isAndroid: true })
    }
  }

  getFollowing = () => (this.state.locationManuallyChanged ? 'disabled' : 'enabled')

  resetMoved = () => {
    this.setState({ moved: false })
  }

  modalShow = () => {
    this.setState({ showModal: true })
  }

  modalDismiss = () => {
    this.setState({ showModal: false })
  }

  stopProcessing = () => {
    this.setState({ process: false })
  }

  requestLines = () => {
    // this.setState({ processing: true })
    // setTimeout(this.stopProcessing, 1000)
    const action = ActionCreators.ActionCreators.getLines(this.props.region)
    this.props.dispatch(action)
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
        const action = ActionCreators.ActionCreators.region({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        })
        this.props.dispatch(action)
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

  updateState = ({ coords }) => {
    const action = ActionCreators.ActionCreators.region({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    })
    this.props.dispatch(action)
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
      this.updateState,
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
        {this.state.showModal && (
          <View style={styles.modalHolder}>
            <View style={styles.modalWindowHeader}>
              <TouchableOpacity onPress={this.modalDismiss}>
                <Icon name="ios-close-circle" size={30} color="#4F8EF7" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalWindowText}>
              <Spinner
                visible={this.getProcessing()}
                textContent={'processing lines...'}
                textStyle={{ color: '#FFF' }}
              />
              <Text style={styles.modalText}>
                {`Following is ${this.getFollowing()} \n`}
                {this.getFollowing() === 'enabled' && <Text>{'tap map to disable'}</Text>}
              </Text>
            </View>
          </View>
        )}
        <MapView
          style={styles.map}
          region={this.props.region}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChangeComplete}
          onPress={this.onPress}
          followsUserLocation={!this.state.locationManuallyChanged}
          loadingEnabled
          rotateEnabled
          showsUserLocation
        >
          {Object.keys(this.props.lines).map((key, index) => (
            <MapView.Polyline
              key={this.props.lines[key].id}
              coordinates={this.props.lines[key].coordinates}
              strokeColor={this.props.lines[key].color}
              strokeWidth={2}
            />
          ))}
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

function mapStateToProps(state) {
  return {
    auth: state.auth,
    lines: state.lines,
    region: state.region,
  }
}

export default connect(mapStateToProps)(Map)
