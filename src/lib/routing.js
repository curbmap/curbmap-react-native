import { DrawerNavigator, StackNavigator } from 'react-navigation'
import Home from '../components/Home'
import Settings from '../components/Settings'
import Login from '../components/Login'
import Signup from '../components/Signup'
import SignedInDrawer from '../components/SignedInDrawer'
import SignedOutDrawer from '../components/SignedOutDrawer'

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

export default function createRootNavigator(signedIn = false) {
  console.log('yyy')
  console.log(signedIn)
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
      },
    },
    {
      headerMode: 'none',
      mode: 'modal',
      initialRouteName: signedIn ? 'SignedIn' : 'SignedOut',
    },
  )
}
