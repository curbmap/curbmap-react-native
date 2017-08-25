import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, Dimensions, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height,
    backgroundColor: '#101010',
    marginTop: 30,
  },
  headerContainer: {
    height: height * 0.25,
    flexDirection: 'row',
    flex: 1,
  },
  header: {
    marginTop: 30,
    backgroundColor: '#707070',
  },
  bodySection: {
    height: height * 0.7,
    backgroundColor: '#4e2e2e',
    marginTop: 3,
  },
  avatar: {
    margin: 10,
    padding: 10,
    backgroundColor: 'lightblue',
    zIndex: 0,
    height: 100,
    width: 100,
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'column',
  },
  userinfo: {
    height: height * 0.5,
    marginTop: 30,
    backgroundColor: '#707070',
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
    marginTop: 5,
  },
  menubutton: {
    backgroundColor: 'rgba(200,200,200,0.0)',
  },
})

export default class SignedInDrawer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      username: '',
      password: '',
      score: '',
      session: '',
      badge: 'undefined',
    }
  }

  onPress(value, props) {
    this.props.navigation.navigate(value, props)
  }

  render() {
    let badge
    switch (this.state.badge) {
      case 'beginner':
        badge = <Image source={require('../assets/img/beginner.png')} />
        break
      default:
        badge = <Image source={require('../assets/img/undefined.png')} />
        break
    }
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              {badge}
            </View>
          </View>
          <View style={styles.userinfo}>
            <Text style={styles.username} />
            <Text style={styles.username}>
              {this.state.username}
            </Text>
            <Text style={styles.userscore}>
              SCORE: {this.state.score}
            </Text>
          </View>
        </View>
        <View style={styles.bodySection}>
          <Button
            raised
            large
            containerViewStyle={styles.menuitem}
            buttonStyle={styles.menubutton}
            color="rgba(255,255,255,1)"
            onPress={() =>
              this.onPress('Home', {
                username: this.state.username,
                password: this.state.password,
                session: this.state.session,
              })}
            title="Home"
            fontSize={20}
            icon={{ name: 'home', size: 32 }}
          >
            Home
          </Button>
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
          >
            Settings
          </Button>
        </View>
      </View>
    )
  }
}
