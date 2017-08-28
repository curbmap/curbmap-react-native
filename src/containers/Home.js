/*
The purpose of Home is to manage which Views are seen in the drawer
*/
import React, { Component } from 'react'
import { DrawerNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import Settings from '../components/Settings'
import Login from '../components/Login'
import Signup from '../components/Signup'
import MapContainer from './MapContainer'
import DrawerContainer from './DrawerContainer'
import * as ActionCreators from '../actions'

const Drawer = DrawerNavigator(
  {
    MapContainer: {
      screen: MapContainer,
    },
    Settings: {
      screen: Settings,
    },
    Login: {
      screen: Login,
    },
    Signup: {
      screen: Signup,
    },
  },
  {
    contentComponent: DrawerContainer,
    initialRouteName: 'MapContainer',
    contentOptions: {
      activeTintColor: '#000',
      style: {
        flex: 1,
        paddingTop: 20,
      },
    },
  },
)

class Home extends Component {
  componentWillMount() {
    this.getUser()
  }
  getUser = () => {
    const userObjects = global.realm.objects('user')
    if (userObjects.length > 0) {
      if (Math.abs(new Date() - userObjects[0].loggedIn) / 36e4 < 3.0) {
        const action = ActionCreators.ActionCreators.authenticate(
          { username: userObjects[0].username, password: userObjects[0].password },
          userObjects[0].session,
          this.props,
          null,
        )
        this.props.dispatch(action)
      }
    }
  }

  render() {
    return <Drawer {...this.props} />
  }
}
function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(Home)
