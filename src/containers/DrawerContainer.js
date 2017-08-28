import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height,
    backgroundColor: '#000',
    borderRightColor: '#888',
    borderRightWidth: 1,
    paddingTop: 20,
  },
  headerContainer: {
    height: height * 0.25,
    flexDirection: 'row',
    flex: 2,
  },
  header: {
    paddingTop: 0,
    backgroundColor: '#805080',
  },
  bodySection: {
    height: height * 0.75,
    backgroundColor: '#1e1e1e',
  },
  avatar: {
    margin: 10,
    padding: 20,
    backgroundColor: 'lightblue',
    zIndex: 0,
    height: 100,
    width: 100,
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'column',
  },
  userinfo: {
    height: height * 0.25,
    paddingTop: 20,
    backgroundColor: '#805080',
    flex: 1,
  },
  username: {
    color: 'white',
    fontSize: 20,
  },
  userscore: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  menuitem: {
    alignItems: 'flex-start',
    marginTop: 5,
  },
  menubutton: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(100,100,100,0.0)',
  },
})

class DrawerContainer extends Component {
  onPress(value) {
    this.props.navigation.navigate(value, this.props)
  }

  render() {
    let badge
    switch (this.props.auth.badge) {
      case '1':
        badge = <Image source={require('../assets/img/beginner.png')} />
        break
      default:
        badge = <Image source={require('../assets/img/undefined.png')} />
        break
    }
    const header = (
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            {badge}
          </View>
        </View>
        <View style={styles.userinfo}>
          <Text style={styles.username} />
          <Text style={styles.username}>
            {this.props.auth.username}
          </Text>
          <Text style={styles.userscore}>
            SCORE: {this.props.auth.score}
          </Text>
        </View>
      </View>
    )
    let body = (
      <KeyboardAwareScrollView
        ref={(scrollObj) => {
          this.scrollView = scrollObj
        }}
      >
        <Button
          raised
          large
          containerViewStyle={styles.menuitem}
          buttonStyle={styles.menubutton}
          color="rgba(255,255,255,1)"
          onPress={() => this.onPress('MapContainer')}
          title="Map"
          fontSize={20}
          icon={{ name: 'home', size: 32 }}
        />
        <Button
          raised
          large
          containerViewStyle={styles.menuitem}
          buttonStyle={styles.menubutton}
          color="rgba(255,255,255,1)"
          onPress={() => this.onPress('Login')}
          title="Login"
          fontSize={20}
          icon={{ name: 'fingerprint', size: 32 }}
        />
        <Button
          raised
          large
          containerViewStyle={styles.menuitem}
          buttonStyle={styles.menubutton}
          color="rgba(255,255,255,1)"
          onPress={() => this.onPress('Signup')}
          title="Signup"
          fontSize={20}
          icon={{ name: 'assignment-ind', size: 32 }}
        />
      </KeyboardAwareScrollView>
    )
    if (this.props.auth.loggedIn) {
      body = (
        <KeyboardAwareScrollView
          ref={(scrollObj) => {
            this.scrollView = scrollObj
          }}
        >
          <Button
            raised
            large
            containerViewStyle={styles.menuitem}
            buttonStyle={styles.menubutton}
            color="rgba(255,255,255,1)"
            onPress={() => this.onPress('MapContainer')}
            title="Map"
            fontSize={20}
            icon={{ name: 'home', size: 32 }}
          />
          <Button
            raised
            large
            containerViewStyle={styles.menuitem}
            buttonStyle={styles.menubutton}
            color="rgba(255,255,255,1)"
            onPress={() => this.onPress('Settings')}
            title="Settings"
            fontSize={20}
            icon={{ name: 'settings', size: 32 }}
          />
        </KeyboardAwareScrollView>
      )
    }
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.bodySection}>
          {body}
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
export default connect(mapStateToProps)(DrawerContainer)
