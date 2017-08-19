import React, { Component } from '../node_modules/react'
import { StyleSheet, Image, View, Dimensions } from '../node_modules/react-native'
import { Button, Card } from '../node_modules/react-native-elements'
import { KeyboardAwareScrollView } from '../node_modules/react-native-keyboard-aware-scroll-view'
import MenuIcon from './MenuIcon'
import { onSignOut } from './auth'

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
  settingsscrollholder: {},
  settingsholder: {
    width: width * 0.9,
    margin: 10,
    marginTop: 60,
    marginBottom: 60,
    flex: 1,
  },
  card: {
    padding: 20,
    margin: 20,
  },
  cardwrapper: {
    width: width * 0.80,
    height: height * 0.8,
  },
})

class Settings extends Component {
  static navigationOptions = {
    drawerLabel: 'Settings',
    drawerIcon: ({ tintColor }) => <Image style={[styles.icon, { tintColor }]} />,
  }

  render() {
    return (
      <View style={styles.full}>
        <MenuIcon onPress={() => this.props.navigation.navigate('DrawerOpen')} />
        <View style={styles.settingsholder}>
          <Card style={styles.card} wrapperStyle={styles.cardWrapper}>
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
                onPress={() => onSignOut().then(() => this.props.navigation.navigate('SignedOut'))}
              >
                Signout
              </Button>
            </KeyboardAwareScrollView>
          </Card>
        </View>
      </View>
    )
  }
}

export default Settings
