import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ActionCreators from '../actions'
import Home from './Home'

class Main extends Component {
  componentDidMount() {}
  render() {
    return <Home {...this.props} />
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    navigationState: state.navigationState,
  }
}

// Shouldn't we really be using store defined above here?
export default connect(() => ({}), mapStateToProps)(Main)
