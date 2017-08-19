import { DrawerNavigator, StackNavigator } from 'react-navigation'
import Home from './Home'
import Settings from './Settings'
import Login from './Login'
import Signup from './Signup'
import SignedInDrawer from './SignedInDrawer'
import SignedOutDrawer from './SignedOutDrawer'

const SignedOut = DrawerNavigator(
  {
    Home: {
      screen: Home,
    },
    Login: {
      screen: Login,
    },
    Signup: {
      screen: Signup,
    },
  },
  {
    contentComponent: SignedOutDrawer,
    contentOptions: {
      style: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#000000',
      },
    },
  },
)

const SignedIn = DrawerNavigator(
  {
    Home: {
      screen: Home,
    },
    Settings: {
      screen: Settings,
    },
  },
  {
    contentComponent: SignedInDrawer,
    initialRouteName: 'Home',
    contentOptions: {
      activeTintColor: '#e06e63',
      style: {
        flex: 1,
        paddingTop: 20,
      },
    },
  },
)

export function createRootNavigator(signedIn = false) {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false,
        },
        params: {
          username: 'curbmaptest',
          password: 'TestCurbm@p1',
          session: 'x',
        },
      },
    },
    {
      headerMode: 'none',
      mode: 'modal',
      initialRouteName: signedIn ? 'SignedIn' : 'SignedOut',
    },
  )
}
