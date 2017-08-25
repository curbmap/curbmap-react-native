import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ActionCreators from '../actions'
import createRootNavigator from '../lib/routing'

class Main extends Component {
  componentDidMount() {}
  render() {
    const FirstView = createRootNavigator(this.props.user.loggedIn)
    return <FirstView />
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch)
}

function mapStateToProps(state) {
  return {
    user: state.default,
    navigationState: state.navigationState,
  }
}

// Shouldn't we really be using store defined above here?
export default connect(mapStateToProps, mapDispatchToProps)(Main)
