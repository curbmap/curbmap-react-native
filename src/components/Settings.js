import React, { Component } from 'react'
import { StyleSheet, Image, View, Dimensions, Text } from 'react-native'
import { Button } from 'react-native-elements'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MenuIcon from '../MenuIcon'
import * as ActionCreators from '../actions'

function generateStyle() {
  const { width, height } = Dimensions.get('window')
  return StyleSheet.create({
    full: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#1e1e1e',
    },
    titleHolder: {
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      marginBottom: 10,
    },
    title: {
      color: 'white',
      fontSize: 30,
      textAlign: 'center',
    },
    settingsscrollholder: {
      backgroundColor: '#1e1e1e',
      width: width * 0.8,
      height: 100,
    },
    settingsholder: {
      width: width * 0.8,
      backgroundColor: '#1e1e1e',
      margin: 20,
      marginTop: 60,
      marginBottom: 60,
      flex: 1,
    },
    card: {
      padding: 10,
      backgroundColor: '#1e1e1e',
      margin: 0,
      borderWidth: 0,
    },
    cardwrapper: {
      width: width * 0.8,
      backgroundColor: '#1e1e1e',
      height: height * 0.8,
      borderWidth: 0,
    },
  })
}

let styles = generateStyle()

class Settings extends Component {
  static navigationOptions = {
    drawerLabel: 'Settings',
    drawerIcon: ({ tintColor }) => <Image style={[styles.icon, { tintColor }]} />,
  }

  layoutChanged() {
    styles = generateStyle()
    this.setState({})
  }

  logout() {
    // For some reason the binding isn't working to props
    const action = ActionCreators.ActionCreators.authenticate(
      {
        username: this.props.auth.username,
        password: null,
      },
      this.props.auth.session,
      this.props,
      null,
    )
    this.props.dispatch(action)
  }

  render() {
    if (!this.props.auth.loggedIn) {
      this.props.navigation.navigate('MapContainer', this.props)
    }
    return (
      <View style={styles.full} onLayout={() => this.layoutChanged()}>
        <MenuIcon onPress={() => this.props.navigation.navigate('DrawerOpen')} />
        <View style={styles.settingsholder}>
          <View style={styles.titleHolder}>
            <Text style={styles.title}>
              {'Settings'}
            </Text>
          </View>
          <View style={styles.card} wrapperStyle={styles.cardWrapper}>
            <KeyboardAwareScrollView
              style={styles.settingscrollsholder}
              ref={(scrollObj) => {
                this.scrollView = scrollObj
              }}
            >
              <Button
                backgroundColor="#0000ff"
                color="#fcfcfc"
                title="Signout"
                onPress={() => {
                  this.logout()
                }}
              >
                Signout
              </Button>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

// Shouldn't we really be using store defined above here?
export default connect(mapStateToProps)(Settings)
