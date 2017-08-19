import React, { Component } from 'react'
import { isSignedIn } from './auth'
import { createRootNavigator } from '../src/routing'

class App extends Component {
  state = {
    signedIn: false,
    checkedSignIn: false,
  }

  componentWillMount() {
    isSignedIn()
      .then((result) => {
        this.setState({ signedIn: result, checkedSignIn: true })
      })
      .catch((err) => {
        console.error(`ERROR:${err}`)
      })
  }

  render() {
    if (!this.state.checkedSignIn) {
      return null
    }

    const FirstView = createRootNavigator(this.state.signedIn)
    return <FirstView />
  }
}

export default App
