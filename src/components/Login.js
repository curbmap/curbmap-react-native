/* eslint-env browser */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Image, Text, TextInput, Dimensions, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay'
import MenuIcon from '../MenuIcon'
import curbmapImg from '../assets/img/curbmap.png'
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
    loginbox: {
      marginTop: 10,
      padding: 10,
      height: 50,
      color: 'white',
      backgroundColor: '#4e2e2e',
      borderColor: '#999',
      borderWidth: 1,
      borderRadius: 5,
    },
    buttonlogin: {
      marginTop: 10,
      borderRadius: 5,
    },
    loginholder: {
      flexDirection: 'column',
      padding: 10,
      height: height * 0.7,
      width: width * 0.8,
    },
    loginimageview: {
      alignItems: 'center',
    },
    loginimage: {
      height: 150,
      width: 150,
    },
    loginViewHolder: {
      marginTop: 60,
      marginBottom: 50,
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
    error: {
      width: width * 0.7,
      marginLeft: width * 0.1,
      backgroundColor: 'rgba(255, 50, 50, 0.5)',
      padding: 20,
    },
    errorText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
    },
  })
}

const styles = generateStyle()

class Login extends Component {
  static navigationOptions = {
    drawerLabel: 'Login',
    drawerIcon: ({ tintColor }) => <Image style={[styles.icon, { tintColor }]} />,
  }

  state = {
    loginPending: this.props.auth.loginPending,
    username: '',
    password: '',
    error: null,
  }

  componendWillMount() {}

  loginCompleted = (results) => {
    this.setState({ loginPending: results.loginPending })
    if (results.loggedIn) {
      this.props.navigation.navigate('MapContainer', this.props)
    }
    this.setState({ error: 'Make sure you entered your password correctly' })
  }

  submit = () => {
    this.setState({ loginPending: true })
    const action = ActionCreators.ActionCreators.authenticate(
      {
        username: this.state.username,
        password: this.state.password,
      },
      null,
      this.props.auth,
      this.loginCompleted,
    )
    this.props.dispatch(action)
  }

  render() {
    // I know this is bad, but it's not registering in componentWillMount
    let warning = <View />
    if (this.state.error !== null) {
      warning = (
        <View style={styles.error}>
          <Text style={styles.errorText}>
            {this.state.error}
          </Text>
        </View>
      )
    }
    let innerContent = (
      <View style={styles.full}>
        <MenuIcon onPress={() => this.props.navigation.navigate('DrawerOpen', this.props)} />
        <View style={styles.loginViewHolder}>
          {warning}
          <View style={styles.card}>
            <KeyboardAwareScrollView
              style={styles.loginholder}
              ref={(scrollObj) => {
                this.scrollView = scrollObj
              }}
            >
              <View style={styles.loginimageview}>
                <Image style={styles.loginimage} source={curbmapImg} />
              </View>
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.loginbox}
                onChangeText={text => this.setState({ username: text })}
                placeholder="username"
                placeholderTextColor="lightgray"
                value={this.state.username}
              />

              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.loginbox}
                onChangeText={text => this.setState({ password: text })}
                placeholder="password"
                placeholderTextColor="lightgray"
                secureTextEntry
                value={this.state.password}
              />

              <Button
                title="Login"
                onPress={() => this.submit()}
                color="#fcfcfc"
                backgroundColor="#6147d0"
                fontSize={20}
                buttonStyle={styles.buttonlogin}
              >
                Login
              </Button>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </View>
    )
    if (this.state.loginPending) {
      innerContent = (
        <View style={styles.full}>
          <Spinner
            color="#FFF"
            textContent={'Logging you in...'}
            textStyle={{ color: '#FFF' }}
            visible={this.state.loginPending}
          />
        </View>
      )
    }
    return innerContent
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(Login)
