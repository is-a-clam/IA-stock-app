import React from 'react'
import Login from './Login'
import Signup from './Signup'

class Accounts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login: true,
    }
  }

  onChangePage(isLogin) {
    this.setState({ login: isLogin })
  }

  render() {
    if (this.state.login) {
      // Return Login View
      return <Login onChangePage={() => this.onChangePage(false)} checkLogin={this.props.checkLogin} />
    } else {
      // Return Register View
      return <Signup onChangePage={() => this.onChangePage(true)} checkLogin={this.props.checkLogin} />
    }
  }
}

export default Accounts
