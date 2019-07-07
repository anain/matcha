import React from "react"
import { Router, Route } from 'react-router'
import Routes from './Routes'
import history from '../config/history'
import { Provider } from 'react-redux'
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true

class App extends React.Component {
  componentDidMount () {
    this.props.store.dispatch({type: 'SOCKET_CONNECT'})
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <Router history={history}>
          <Route path='/' component={Routes} />
        </Router>
      </Provider>
    )
  }
}

export default App