/* eslint-env browser */
import React, { Component } from 'react'
import { StyleSheet, View, Image, TextInput, Dimensions, AsyncStorage } from 'react-native'
import { Card, Button } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MenuIcon from './MenuIcon'
import curbmapImg from './assets/img/curbmap.png'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#4e2e2e',
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
    backgroundColor: '#4e2e2e',
  },
  cardwrapper: {},
})

class Login extends Component {
  static navigationOptions = {
    drawerLabel: 'Login',
    drawerIcon: ({ tintColor }) => <Image style={[styles.icon, { tintColor }]} />,
  }

  stateValues = { buttonLoginDisabled: false }

  doLogin = () => {
    this.stateValues.buttonLoginDisabled = true
    fetch('https://curbmap.com/login', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${this.state.user}&password=${this.state.pass}`,
    })
      .then(responseUser => responseUser.json())
      .then((responseUserJSON) => {
        AsyncStorage.setItem('SESSION', responseUserJSON.session)
        AsyncStorage.setItem('USERNAME', this.state.user)
        AsyncStorage.setItem('PASSWORD', this.state.pass) // if user needs to request a new oauth token
        AsyncStorage.setItem('BADGE', responseUserJSON.badge)
        AsyncStorage.setItem('SCORE', `${responseUserJSON.score}`)
        this.props.navigation.navigate('SignedIn', {
          username: this.state.user,
          session: responseUserJSON.session,
        })
      })
      .catch((e) => {
        console.log(`Error in login: ${e}`)
        this.stateValues.buttonLoginDisabled = false
      })
  }

  submit = () => {
    this.doLogin()
  }

  render() {
    return (
      <View style={styles.full}>
        <MenuIcon onPress={() => this.props.navigation.navigate('DrawerOpen')} />
        <View style={styles.loginViewHolder}>
          <Card style={styles.card} wrapperStyle={styles.cardwrapper}>
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
                onChangeText={text => this.setState({ user: text })}
                placeholder="username"
                placeholderTextColor="lightgray"
                value={this.stateValues.user}
              />

              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.loginbox}
                onChangeText={text => this.setState({ pass: text })}
                placeholder="password"
                placeholderTextColor="lightgray"
                secureTextEntry
                value={this.stateValues.pass}
              />

              <Button
                title="Login"
                onPress={() => this.submit()}
                color="#fcfcfc"
                backgroundColor="#6147d0"
                fontSize={20}
                buttonStyle={styles.buttonlogin}
                disabled={this.stateValues.buttonLoginDisabled}
              >
                Login
              </Button>
            </KeyboardAwareScrollView>
          </Card>
        </View>
      </View>
    )
  }
}

export default Login
